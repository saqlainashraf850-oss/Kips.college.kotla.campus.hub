import React from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  UploadCloud,
  Eye,
  Bell,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface AdminOverviewTabProps {
  onNavigateToTab?: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateToTab }) => {
  const {
    db,
    applications,
    teacherContents,
    auditLogs,
    adminNotifications,
    unreadAdminNotificationsCount
  } = usePortal();

  const totalStudents = db.students.length;
  const totalTeachers = db.teachers.length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const approvedStudents = applications.filter(a => a.status === 'Approved').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
  const totalUploads = teacherContents.length;
  const totalViews = teacherContents.reduce((acc, c) => acc + (c.totalViews || 0), 0);
  const unreadNotifs = unreadAdminNotificationsCount;
  const todayApps = 2;
  const todayUploads = 2;

  const statCards = [
    {
      title: 'Total Students',
      value: totalStudents,
      subtitle: `${db.sections.length} active sections (CB1, CB2)`,
      icon: Users,
      color: 'from-sky-500 to-sky-600',
      badge: 'Active Batch',
      tab: 'students'
    },
    {
      title: 'Total Teachers',
      value: totalTeachers,
      subtitle: 'Head of Mathematics & Science',
      icon: GraduationCap,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Faculty',
      tab: 'teachers'
    },
    {
      title: 'Pending Applications',
      value: pendingApps,
      subtitle: 'Requires Admin Authorization',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      badge: 'Action Needed',
      highlight: pendingApps > 0,
      tab: 'approvals'
    },
    {
      title: 'Approved Students',
      value: approvedStudents,
      subtitle: 'Full portal access enabled',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Authorized',
      tab: 'approvals'
    },
    {
      title: 'Rejected Applications',
      value: rejectedApps,
      subtitle: 'Access blocked by policy',
      icon: XCircle,
      color: 'from-rose-500 to-rose-600',
      badge: 'Blocked',
      tab: 'approvals'
    },
    {
      title: 'Total Teacher Uploads',
      value: totalUploads,
      subtitle: 'Notes, Videos, Whiteboard shots',
      icon: UploadCloud,
      color: 'from-cyan-500 to-cyan-600',
      badge: 'Materials',
      tab: 'content'
    },
    {
      title: 'Total Content Views',
      value: totalViews,
      subtitle: 'Tracked student engagements',
      icon: Eye,
      color: 'from-teal-500 to-teal-600',
      badge: 'Analytics',
      tab: 'content'
    },
    {
      title: 'Unread Notifications',
      value: unreadNotifs,
      subtitle: 'Registration & upload requests',
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
      badge: 'Live',
      highlight: unreadNotifs > 0,
      tab: 'notifications'
    },
    {
      title: "Today's Applications",
      value: todayApps,
      subtitle: 'Received today',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      badge: 'New',
      tab: 'approvals'
    },
    {
      title: "Today's Uploads",
      value: todayUploads,
      subtitle: 'Uploaded today by faculty',
      icon: Sparkles,
      color: 'from-violet-500 to-violet-600',
      badge: 'Recent',
      tab: 'content'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-600/10 via-white to-cyan-600/10 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Management & Analytics Dashboard</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {db.branding.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Live digital portal operations: student admission approvals, teacher study material uploads, real-time student view tracking, and audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab?.('approvals')}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/30 transition flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Review Applications ({pendingApps})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Modern Statistics Cards */}
      <div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span>Real-Time College Metrics & Statistics</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateToTab?.(card.tab)}
                className={`p-4 rounded-2xl bg-white border transition shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group ${
                  card.highlight
                    ? 'border-amber-300 ring-2 ring-amber-100 hover:border-amber-400'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-700 transition">
                      {card.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 block leading-tight">
                    {card.title}
                  </span>
                  <span className="text-2xl font-black text-slate-900 block mt-0.5">
                    {card.value}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="truncate">{card.subtitle}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Campus Activity & System Audit Feed
              </h3>
              <p className="text-xs text-slate-500">
                Live stream of student registrations, approvals, teacher uploads, content views, and logins
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab?.('audit_logs')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 underline"
          >
            View Full Audit Logs
          </button>
        </div>

        <div className="divide-y divide-slate-100 font-medium">
          {auditLogs.slice(0, 8).map(log => {
            const isApproved = log.action.includes('Approved');
            const isRejected = log.action.includes('Rejected');
            const isUpload = log.action.includes('Upload');
            const isRegistration = log.action.includes('Registration');

            return (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-700'
                        : isRejected
                        ? 'bg-rose-100 text-rose-700'
                        : isUpload
                        ? 'bg-sky-100 text-sky-700'
                        : isRegistration
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRejected ? (
                      <XCircle className="w-4 h-4" />
                    ) : isUpload ? (
                      <UploadCloud className="w-4 h-4" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900">{log.action}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-600">
                        {log.role}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      <strong className="text-slate-800">{log.user}</strong> — {log.relatedRecord}
                      {log.details ? ` (${log.details})` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 whitespace-nowrap text-right font-mono">
                  <span>{log.date}</span>
                  <span className="block text-[10px] text-slate-400">{log.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
