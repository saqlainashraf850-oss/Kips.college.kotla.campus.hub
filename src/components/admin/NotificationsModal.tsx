import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { StudentApplication } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewApplication: (app: StudentApplication) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onViewApplication
}) => {
  const {
    adminNotifications,
    applications,
    currentAdmin,
    approveApplication,
    rejectApplication,
    markAdminNotificationRead,
    markAllAdminNotificationsRead
  } = usePortal();

  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen) return null;

  const currentAdminId = currentAdmin?.id || 'adm-1';
  const adminName = currentAdmin?.name || 'Prof. Muhammad Tariq (Principal)';

  const handleApprove = async (appId: string) => {
    setActionInProgressId(appId);
    setConflictMessage(null);
    setSuccessMessage(null);

    const res = await approveApplication(appId, adminName);
    setActionInProgressId(null);

    if (res.conflict) {
      // REQUIREMENT 6: DUPLICATE APPROVAL PROTECTION
      setConflictMessage(`This application has already been processed by another administrator. (Current Status: ${res.currentStatus || 'Processed'})`);
      setTimeout(() => setConflictMessage(null), 6000);
      return;
    }

    if (!res.success) {
      setConflictMessage(res.message);
      setTimeout(() => setConflictMessage(null), 4000);
      return;
    }

    setSuccessMessage(res.message);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleConfirmReject = async () => {
    if (!rejectingAppId) return;
    setActionInProgressId(rejectingAppId);
    setConflictMessage(null);
    setSuccessMessage(null);

    const res = await rejectApplication(rejectingAppId, rejectionReason || undefined, adminName);
    setActionInProgressId(null);
    setRejectingAppId(null);
    setRejectionReason('');

    if (res.conflict) {
      setConflictMessage(`This application has already been processed by another administrator. (Current Status: ${res.currentStatus || 'Processed'})`);
      setTimeout(() => setConflictMessage(null), 6000);
      return;
    }

    if (!res.success) {
      setConflictMessage(res.message);
      setTimeout(() => setConflictMessage(null), 4000);
      return;
    }

    setSuccessMessage(res.message);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenView = (appId?: string) => {
    if (!appId) return;
    const app = applications.find(a => a.id === appId);
    if (app) {
      onViewApplication(app);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl border border-sky-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <span>Admin Notifications</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-black">
                  {adminNotifications.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Logged in as <strong className="text-slate-800">{adminName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={markAllAdminNotificationsRead}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Mark All Read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banners */}
        {conflictMessage && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-bold flex items-center space-x-2 animate-fade-in flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{conflictMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fade-in flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {adminNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            adminNotifications.map(notif => {
              const isRead = notif.readBy.includes(currentAdminId);
              const relatedApp = notif.applicationId
                ? applications.find(a => a.id === notif.applicationId)
                : null;
              const appStatus = relatedApp?.status || (notif.actionTaken ? 'Processed' : 'Pending');

              return (
                <div
                  key={notif.id}
                  onClick={() => markAdminNotificationRead(notif.id)}
                  className={`p-4 rounded-2xl border transition space-y-3 ${
                    isRead
                      ? 'bg-white border-slate-200'
                      : 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase">
                          {notif.type === 'student_registration' ? 'Student Registration' : 'Campus Update'}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {notif.createdAt}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {notif.title}
                      </h4>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        appStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : appStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      Status: {appStatus}
                    </span>
                  </div>

                  {/* Requested Format Box */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                    <p className="flex items-center space-x-1.5 font-bold text-slate-900">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>Student: {notif.studentName || 'Applicant'}</span>
                    </p>
                    {notif.applicationId && (
                      <p className="text-[11px] text-slate-600">
                        • Application ID: <strong className="text-sky-700">{notif.applicationId}</strong>
                      </p>
                    )}
                    {notif.class && (
                      <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                        <Layers className="w-3 h-3 text-slate-400" />
                        <span>Class: {notif.class}</span>
                      </p>
                    )}
                    {notif.contact && (
                      <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Contact: {notif.contact}</span>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Submitted: {notif.submittedAt || notif.createdAt}</span>
                    </p>
                  </div>

                  {notif.type === 'student_registration' && (
                    <div className="pt-1 space-y-2">
                      <p className="text-xs font-bold text-slate-700">
                        Do you want to approve this student?
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* VIEW APPLICATION BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleOpenView(notif.applicationId)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>VIEW APPLICATION</span>
                        </button>

                        {/* APPROVE BUTTON */}
                        <button
                          type="button"
                          disabled={actionInProgressId === notif.applicationId || appStatus === 'Approved'}
                          onClick={() => notif.applicationId && handleApprove(notif.applicationId)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>APPROVE</span>
                        </button>

                        {/* REJECT BUTTON */}
                        <button
                          type="button"
                          disabled={actionInProgressId === notif.applicationId || appStatus === 'Rejected'}
                          onClick={() => {
                            if (notif.applicationId) {
                              setRejectingAppId(notif.applicationId);
                              setRejectionReason('Your application has not been approved by college administration.');
                            }
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>REJECT</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Rejection Prompt Modal */}
        {rejectingAppId && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 animate-fade-in flex-shrink-0">
            <h4 className="font-bold text-rose-900 text-xs">Confirm Rejection: {rejectingAppId}</h4>
            <input
              type="text"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Rejection reason (optional)"
              className="w-full px-3 py-1.5 rounded-xl border border-rose-300 text-xs bg-white"
            />
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setRejectingAppId(null)}
                className="px-3 py-1 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
