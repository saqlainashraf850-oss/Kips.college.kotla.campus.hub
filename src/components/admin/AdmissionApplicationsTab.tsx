import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Search,
  Filter,
  Check,
  X,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  Send,
  Download
} from 'lucide-react';
import { StudentApplication } from '../../types';

interface AdmissionApplicationsTabProps {
  onSelectApplicationForModal?: (app: StudentApplication) => void;
}

export const AdmissionApplicationsTab: React.FC<AdmissionApplicationsTabProps> = () => {
  const {
    applications,
    currentAdmin,
    approveApplication,
    rejectApplication,
    markApplicationUnderReview
  } = usePortal();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Under Review' | 'Approved' | 'Rejected'>('All');
  const [classFilter, setClassFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Modal State
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [rejectingApp, setRejectingApp] = useState<StudentApplication | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [conflictNotice, setConflictNotice] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const adminName = currentAdmin?.name || 'Prof. Muhammad Tariq (Principal)';

  // Filtering
  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'All' && app.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (classFilter !== 'All' && !app.appliedClass.toLowerCase().includes(classFilter.toLowerCase())) return false;
    if (sectionFilter !== 'All' && app.section.toLowerCase() !== sectionFilter.toLowerCase()) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.studentName.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q) ||
      app.studentContact.includes(q) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.fatherName && app.fatherName.toLowerCase().includes(q))
    );
  }).sort((a, b) => {
    if (sortBy === 'name') return a.studentName.localeCompare(b.studentName);
    if (sortBy === 'oldest') return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id); // newest by ID
  });

  const handleApprove = async (appId: string) => {
    setProcessingId(appId);
    setConflictNotice(null);
    setNoticeMessage(null);

    const res = await approveApplication(appId, adminName);
    setProcessingId(null);

    if (res.conflict) {
      // Duplicate Approval Protection
      setConflictNotice(`This application has already been processed by another administrator. (Status: ${res.currentStatus || 'Processed'})`);
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: (res.currentStatus as any) || 'Approved' } : null);
      }
      return;
    }

    if (!res.success) {
      setConflictNotice(res.message);
      return;
    }

    setNoticeMessage(`Application ${appId} Approved! Student account activated.`);
    setTimeout(() => setNoticeMessage(null), 5000);

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: 'Approved', processedBy: adminName } : null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingApp) return;
    const appId = rejectingApp.id;
    setProcessingId(appId);
    setConflictNotice(null);

    const res = await rejectApplication(appId, rejectionReasonInput.trim(), adminName);
    setProcessingId(null);
    setRejectingApp(null);
    setRejectionReasonInput('');

    if (res.conflict) {
      setConflictNotice(`This application has already been processed by another administrator. (Status: ${res.currentStatus || 'Processed'})`);
      return;
    }

    if (!res.success) {
      setConflictNotice(res.message);
      return;
    }

    setNoticeMessage(`Application ${appId} Rejected.`);
    setTimeout(() => setNoticeMessage(null), 5000);

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: 'Rejected', rejectionReason: rejectionReasonInput.trim(), processedBy: adminName } : null);
    }
  };

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-sky-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-600 text-white rounded-xl shadow-md shadow-sky-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Admission Application Management
              </h2>
              <p className="text-xs text-slate-500">
                Review, filter, verify, and approve online student enrollment applications
              </p>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            {pendingCount} Pending
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
            {approvedCount} Approved
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold border border-rose-300">
            {rejectedCount} Rejected
          </span>
        </div>
      </div>

      {/* Notices */}
      {conflictNotice && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>{conflictNotice}</span>
        </div>
      )}

      {noticeMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Student Name, Contact..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"
          >
            <option value="All">All Classes</option>
            <option value="F.Sc Pre-Eng">Pre-Engineering</option>
            <option value="F.Sc Pre-Med">Pre-Medical</option>
            <option value="ICS">ICS</option>
          </select>
        </div>

        {/* Section Filter */}
        <div>
          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"
          >
            <option value="All">All Sections</option>
            <option value="CB1">Section CB1</option>
            <option value="CB2">Section CB2</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Student Name</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-sky-50 text-sky-950 font-bold uppercase border-b border-sky-100">
            <tr>
              <th className="p-3.5">Application ID</th>
              <th className="p-3.5">Student & Details</th>
              <th className="p-3.5">Class & Section</th>
              <th className="p-3.5">Contact</th>
              <th className="p-3.5">Submission Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No admission applications match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-sky-50/40 transition">
                  {/* Application ID */}
                  <td className="p-3.5 font-mono font-bold text-sky-700 whitespace-nowrap">
                    {app.id}
                  </td>

                  {/* Student */}
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2.5">
                      {app.photoUrl ? (
                        <img
                          src={app.photoUrl}
                          alt={app.studentName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold flex-shrink-0">
                          {app.studentName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{app.studentName}</span>
                        <span className="text-[10px] text-slate-400">Father: {app.fatherName}</span>
                      </div>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 block">{app.appliedClass}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded font-bold">
                      Section {app.section}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">
                    <div>{app.studentContact}</div>
                    {app.email && <div className="text-[10px] text-slate-400">{app.email}</div>}
                  </td>

                  {/* Date */}
                  <td className="p-3.5 text-[11px] text-slate-600 whitespace-nowrap">
                    {app.submissionDate}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : app.status === 'Under Review'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* VIEW APPLICATION BUTTON */}
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center space-x-1 transition text-[11px]"
                        title="View Full Application Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* APPROVE BUTTON */}
                      <button
                        type="button"
                        disabled={processingId === app.id || app.status === 'Approved'}
                        onClick={() => handleApprove(app.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold flex items-center space-x-1 transition shadow-xs text-[11px]"
                        title="Approve Application"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      {/* REJECT BUTTON */}
                      <button
                        type="button"
                        disabled={processingId === app.id || app.status === 'Rejected'}
                        onClick={() => {
                          setRejectingApp(app);
                          setRejectionReasonInput('Your admission application has not been approved.');
                        }}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg font-bold flex items-center space-x-1 transition shadow-xs text-[11px]"
                        title="Reject Application"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================== */}
      {/* COMPREHENSIVE APPLICATION DOSSIER MODAL                         */}
      {/* ============================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white max-w-xl w-full rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Admission Application Dossier
                  </h3>
                  <p className="text-[11px] font-mono text-sky-700 font-bold">
                    {selectedApp.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Header */}
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              {selectedApp.photoUrl ? (
                <img
                  src={selectedApp.photoUrl}
                  alt={selectedApp.studentName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-sky-200 text-sky-800 font-black text-xl flex items-center justify-center shadow-md">
                  {selectedApp.studentName.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <h4 className="text-base font-black text-slate-900 truncate">
                  {selectedApp.studentName}
                </h4>
                <p className="text-xs text-slate-500 font-medium">Father: {selectedApp.fatherName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedApp.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedApp.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : selectedApp.status === 'Under Review'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                  <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                    Section {selectedApp.section}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Applied Class / Course:</span>
                <span className="font-semibold text-slate-900">{selectedApp.appliedClass}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Section Batch:</span>
                <span className="font-bold text-purple-700">Section {selectedApp.section}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Date of Birth / Age:</span>
                <span className="text-slate-800 font-medium">{selectedApp.dob || '12 Mar 2008'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Gender:</span>
                <span className="text-slate-800 font-medium">{selectedApp.gender || 'Male'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Student Contact:</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.studentContact}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Parent / Guardian Contact:</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.parentContact || selectedApp.studentContact}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Email:</span>
                <span className="font-mono text-slate-800">{selectedApp.email || 'None Provided'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Previous School / College:</span>
                <span className="text-slate-800 font-medium">{selectedApp.previousSchool || 'Matric Science'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Previous Marks / Result:</span>
                <span className="font-bold text-emerald-700">{selectedApp.previousMarks || '1020 / 1100'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Admission Information & Remarks:</span>
                <span className="text-slate-700 italic">{selectedApp.admissionInfo || 'Direct application'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Uploaded Documents:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedApp.documents || ['Matric Result Card', 'B-Form']).map((doc, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-semibold flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-sky-600" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Submission Date:</span>
                <span className="text-slate-700">{selectedApp.submissionDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Processed By:</span>
                <span className="text-slate-700">{selectedApp.processedBy || 'Awaiting Action'}</span>
              </div>
            </div>

            {/* If Rejected: Show reason */}
            {selectedApp.status === 'Rejected' && selectedApp.rejectionReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                <span className="font-bold block">Rejection Reason:</span>
                <p className="text-[11px]">{selectedApp.rejectionReason}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                {selectedApp.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      markApplicationUnderReview(selectedApp.id);
                      setSelectedApp(prev => prev ? { ...prev, status: 'Under Review' } : null);
                    }}
                    className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition"
                  >
                    Mark Under Review
                  </button>
                )}

                <button
                  type="button"
                  disabled={selectedApp.status === 'Rejected'}
                  onClick={() => {
                    setRejectingApp(selectedApp);
                    setRejectionReasonInput('Your admission application has not been approved.');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  disabled={selectedApp.status === 'Approved'}
                  onClick={() => handleApprove(selectedApp.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Prompt Modal */}
      {rejectingApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-bold text-slate-900 text-sm">Reject Application: {rejectingApp.id}</h4>
            </div>
            <p className="text-xs text-slate-600">
              Student: <strong>{rejectingApp.studentName}</strong> ({rejectingApp.appliedClass})
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rejection Reason (Optional):
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. Merit criteria not met, invalid documentation..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingApp(null)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
