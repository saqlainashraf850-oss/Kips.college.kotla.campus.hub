import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  GraduationCap,
  Printer,
  Globe,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  Layers,
  UserCheck,
  Folder,
  Download,
  Play,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  X,
  Sparkles,
  Barcode
} from 'lucide-react';
import { MaterialItem } from '../types';

export const StudentPortal: React.FC = () => {
  const { db, currentStudent, logout, setActiveView } = usePortal();
  const [selectedMedia, setSelectedMedia] = useState<MaterialItem | null>(null);

  if (!currentStudent) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-red-600 font-bold">No student session active.</p>
        <button
          onClick={() => setActiveView('login')}
          className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const studentSection = db.sections.find(s => s.name === currentStudent.section);
  const sectionMaterials = db.materials.filter(
    m => m.section === 'All' || m.section === currentStudent.section
  );

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 glass-sidebar p-5 rounded-3xl flex flex-col justify-between flex-shrink-0 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-sky-100">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center overflow-hidden">
              {db.branding.logoUrl ? (
                <img src={db.branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 leading-tight">
                {db.branding.title}
              </h3>
              <p className="text-[10px] font-bold text-sky-600">Student Portal</p>
            </div>
          </div>

          {/* Student Profile Card in Sidebar */}
          <div className="flex items-center space-x-3 bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200">
            <img
              src={currentStudent.photo}
              alt={currentStudent.name}
              className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm"
            />
            <div className="overflow-hidden">
              <h4 className="font-black text-xs text-slate-900 truncate">{currentStudent.name}</h4>
              <p className="text-[10px] font-bold text-sky-700">Section {currentStudent.section}</p>
              <p className="text-[9px] font-mono text-slate-400 truncate">{currentStudent.cardId}</p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-sky-600 text-white shadow">
              <LayoutDashboard className="w-4 h-4" />
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-sky-50 text-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>Print Student ID Card</span>
            </button>

            <button
              onClick={() => setActiveView('public')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-sky-50 text-slate-700 transition"
            >
              <Globe className="w-4 h-4 text-sky-600" />
              <span>College Website</span>
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition text-xs font-bold pt-3 border-t border-slate-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">
        {/* Welcome Header */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-sky-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Session 2026–2027</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Welcome back, {currentStudent.name}!
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Class: {currentStudent.class} • Roll No: {currentStudent.roll} • Card ID: {currentStudent.cardId}
            </p>
          </div>

          <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center space-x-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Enrolled & Card Active</span>
          </span>
        </div>

        {/* 4 Overview Quick Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-sky-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Attendance</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{currentStudent.attendance}%</h3>
              <p className="text-[10px] text-emerald-600 font-bold">Good Standing</p>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-sky-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Class Section</p>
              <h3 className="text-2xl font-black text-sky-600 mt-0.5">{currentStudent.section}</h3>
              <p className="text-[10px] text-slate-500 font-medium">{studentSection?.room || 'Assigned Room'}</p>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-sky-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Section In-Charge</p>
              <h3 className="text-xs font-black text-slate-800 mt-1 line-clamp-2">
                {studentSection?.incharge || 'Assigned Faculty'}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-sky-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Study Materials</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{sectionMaterials.length}</h3>
              <p className="text-[10px] text-slate-500">PDFs, Videos, Images</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Folder className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Study Materials & Video Lectures for This Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-sky-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-base text-slate-900">
                Study Materials, Formulas & Video Lectures for Section {currentStudent.section}
              </h3>
              <p className="text-xs text-slate-500">
                Resources curated by your Mathematics and Science subject teachers
              </p>
            </div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              {sectionMaterials.length} Available Items
            </span>
          </div>

          {sectionMaterials.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No materials uploaded yet for this section. Your teacher will upload notes soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionMaterials.map(mat => (
                <div
                  key={mat.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          mat.type === 'PDF'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : mat.type === 'Video'
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {mat.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{mat.date}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{mat.title}</h4>
                    {mat.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{mat.description}</p>
                    )}
                    <p className="text-[11px] text-sky-600 font-semibold">Teacher: {mat.uploader}</p>

                    {/* Image Preview */}
                    {mat.type === 'Image' && mat.fileUrl && (
                      <div
                        onClick={() => setSelectedMedia(mat)}
                        className="h-32 rounded-xl overflow-hidden cursor-pointer relative group border border-slate-200"
                      >
                        <img
                          src={mat.fileUrl}
                          alt={mat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold">
                          Click to Enlarge
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-t border-slate-100">
                    {mat.type === 'Video' && mat.videoUrl && (
                      <a
                        href={mat.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Watch Video Lecture</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}

                    {mat.type === 'PDF' && (
                      mat.fileUrl ? (
                        <a
                          href={mat.fileUrl}
                          download={`${mat.title}.pdf`}
                          className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF Notes</span>
                        </a>
                      ) : (
                        <div className="p-2 bg-slate-50 text-slate-600 rounded-xl text-center text-[11px] font-semibold flex items-center justify-center space-x-1">
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span>Standard Reference Notes Attached</span>
                        </div>
                      )
                    )}

                    {mat.type === 'Image' && !mat.fileUrl && (
                      <div className="p-2 bg-slate-50 text-slate-500 rounded-xl text-center text-[11px]">
                        Whiteboard snapshot reference
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Preview Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-black text-sm text-slate-900">{selectedMedia.title}</h4>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {selectedMedia.fileUrl && (
                <img
                  src={selectedMedia.fileUrl}
                  alt={selectedMedia.title}
                  className="w-full max-h-[70vh] object-contain rounded-xl bg-slate-50"
                />
              )}
            </div>
          </div>
        )}

        {/* PRINTABLE OFFICIAL STUDENT ID CARD */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Official Digital Student Card
            </h3>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print This Card</span>
            </button>
          </div>

          <div
            id="printable-student-card"
            className="max-w-md mx-auto glass-panel-sky p-6 rounded-3xl border-2 border-sky-300 shadow-xl bg-white"
          >
            {/* Top Card Banner */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-sky-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center overflow-hidden">
                  {db.branding.logoUrl ? (
                    <img src={db.branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-black text-xs text-sky-900 tracking-tight leading-none">
                    {db.branding.title}
                  </h4>
                  <p className="text-[9px] font-extrabold text-sky-600 uppercase tracking-widest mt-0.5">
                    Kotla Arab Ali Khan, Gujrat
                  </p>
                </div>
              </div>

              <span className="bg-sky-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">
                Student ID
              </span>
            </div>

            {/* Photo & Student Details */}
            <div className="flex items-center space-x-4 mt-4">
              <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 flex-shrink-0">
                <img
                  src={currentStudent.photo}
                  alt={currentStudent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs space-y-1.5 flex-1">
                <p>
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Name:</span>{' '}
                  <strong className="text-slate-900 text-sm block leading-none">{currentStudent.name}</strong>
                </p>
                <p>
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Father:</span>{' '}
                  <strong className="text-slate-700">{currentStudent.father}</strong>
                </p>
                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <p>
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Roll No:</span>{' '}
                    <strong className="text-sky-600 font-mono">{currentStudent.roll}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Section:</span>{' '}
                    <strong className="text-purple-700 font-bold">{currentStudent.section}</strong>
                  </p>
                </div>
                <p>
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Class:</span>{' '}
                  <span className="text-slate-700 font-semibold">{currentStudent.class}</span>
                </p>
              </div>
            </div>

            {/* Barcode & Card Code Strip */}
            <div className="mt-4 pt-3 border-t border-sky-200 bg-sky-50/70 p-3 rounded-2xl space-y-1 text-center">
              <div className="font-mono text-xs font-black tracking-widest text-slate-800">
                {currentStudent.cardId}
              </div>
              {/* Simulated barcode graphic */}
              <div className="h-6 w-full flex items-center justify-center space-x-1 opacity-80 py-1">
                <div className="w-1 h-full bg-slate-900"></div>
                <div className="w-2 h-full bg-slate-900"></div>
                <div className="w-0.5 h-full bg-slate-900"></div>
                <div className="w-1.5 h-full bg-slate-900"></div>
                <div className="w-3 h-full bg-slate-900"></div>
                <div className="w-0.5 h-full bg-slate-900"></div>
                <div className="w-2 h-full bg-slate-900"></div>
                <div className="w-1 h-full bg-slate-900"></div>
                <div className="w-2.5 h-full bg-slate-900"></div>
                <div className="w-1 h-full bg-slate-900"></div>
                <div className="w-3 h-full bg-slate-900"></div>
              </div>
              <p className="text-[9px] text-slate-500 font-bold">
                Scan this card barcode at college gate and portal login
              </p>
            </div>

            <div className="mt-2 text-[9px] text-slate-400 text-center font-bold">
              Valid for Academic Session 2026–2027 • Principal Signature Verified
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
