import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Laptop,
  Smartphone,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe
} from 'lucide-react';

export const ActiveSessionsTab: React.FC = () => {
  const { activeSessions, revokeOtherSessions } = usePortal();
  const [notice, setNotice] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevokeOthers = async () => {
    if (!confirm('Are you sure you want to log out all other active sessions across devices?')) return;
    setIsRevoking(true);
    const msg = await revokeOtherSessions();
    setIsRevoking(false);
    setNotice(msg);
    setTimeout(() => setNotice(null), 5000);
  };

  const validSessions = activeSessions.filter(s => s.isValid);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-sky-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Active Admin & User Sessions
            </h2>
            <p className="text-xs text-slate-500">
              Manage persistent devices, security tokens, and revoke unrecognized sessions
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isRevoking}
          onClick={handleRevokeOthers}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT OTHER DEVICES</span>
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validSessions.map((session, idx) => {
          const isCurrent = idx === 0;
          const isMobile = session.device.toLowerCase().includes('mobile') || session.device.toLowerCase().includes('galaxy');

          return (
            <div
              key={session.id}
              className={`p-5 rounded-2xl border transition shadow-sm space-y-3.5 bg-white relative ${
                isCurrent ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${isCurrent ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}>
                    {isMobile ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5 text-slate-700" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{session.device}</h4>
                      {isCurrent && (
                        <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{session.browser}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  IP: {session.ip}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">User:</span>
                  <span className="font-bold text-slate-800">{session.userName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Role:</span>
                  <span className="font-bold text-sky-700 uppercase text-[10px]">{session.role}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Login Date:</span>
                  <span className="text-slate-600 font-mono text-[11px]">{session.loginDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Active:</span>
                  <span className="text-emerald-700 font-semibold">{session.lastActive}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Session Status: Active</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  ID: {session.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
