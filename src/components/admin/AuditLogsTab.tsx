import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  UploadCloud,
  Eye,
  KeyRound,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export const AuditLogsTab: React.FC = () => {
  const { auditLogs } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    if (roleFilter !== 'All' && log.role !== roleFilter) return false;
    if (actionFilter !== 'All' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.relatedRecord.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-sky-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-slate-800 text-white rounded-xl shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Activity & System Audit Logs
            </h2>
            <p className="text-xs text-slate-500">
              Immutable timeline of administrative actions, admissions, logins, and uploads
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Total Recorded Actions: {auditLogs.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by User, Action, Record..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-sky-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700"
          >
            <option value="All">All User Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700"
          >
            <option value="All">All Actions</option>
            <option value="Registration">Registration</option>
            <option value="Approved">Approvals</option>
            <option value="Rejected">Rejections</option>
            <option value="Login">Logins</option>
            <option value="Upload">Uploads</option>
            <option value="Viewed">Content Views</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Action Executed</th>
              <th className="p-3.5">Target / Related Record</th>
              <th className="p-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No audit log entries match the search criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => {
                const isApproved = log.action.includes('Approved');
                const isRejected = log.action.includes('Rejected');
                const isUpload = log.action.includes('Upload');
                const isRegistration = log.action.includes('Registration');

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      <div>{log.date}</div>
                      <div className="text-[10px] text-slate-400">{log.time}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-slate-100 text-slate-700">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`font-bold inline-flex items-center space-x-1.5 ${
                          isApproved
                            ? 'text-emerald-700'
                            : isRejected
                            ? 'text-rose-700'
                            : isUpload
                            ? 'text-sky-700'
                            : isRegistration
                            ? 'text-amber-700'
                            : 'text-slate-800'
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        {isUpload && <UploadCloud className="w-3.5 h-3.5 text-sky-600" />}
                        <span>{log.action}</span>
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-700 max-w-xs truncate" title={log.relatedRecord}>
                      {log.relatedRecord}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px] max-w-sm truncate" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
