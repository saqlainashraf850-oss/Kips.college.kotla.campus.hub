import React from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  GraduationCap,
  Eye,
  UploadCloud,
  FileText,
  Play,
  Image as ImageIcon,
  Users,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';

export const TeacherAnalyticsTab: React.FC = () => {
  const { db, teacherContents } = usePortal();

  const teachers = db.teachers;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-sky-100 shadow-sm">
      <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/30">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Teacher Performance & Content Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive breakdown of faculty study materials, student engagements, and view metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teachers.map(teacher => {
          const uploads = teacherContents.filter(
            c => c.teacherName.toLowerCase().includes(teacher.name.toLowerCase()) || c.teacherId === teacher.id
          );
          const totalViews = uploads.reduce((acc, c) => acc + (c.totalViews || 0), 0);
          const uniqueStudents = uploads.reduce(
            (acc, c) => acc + (Array.isArray(c.uniqueViewers) ? c.uniqueViewers.length : (typeof c.uniqueViewers === 'number' ? c.uniqueViewers : 0)),
            0
          );
          const pictures = uploads.filter(c => c.fileType === 'Image' || c.fileType === 'Picture').length;
          const videos = uploads.filter(c => c.fileType === 'Video').length;
          const notes = uploads.filter(c => c.fileType === 'Notes' || c.fileType === 'PDF' || c.fileType === 'Assignment').length;

          const sortedByViews = [...uploads].sort((a, b) => b.totalViews - a.totalViews);
          const mostViewed = sortedByViews[0] ? sortedByViews[0].title : 'No uploads yet';
          const latestUpload = uploads[0] ? uploads[0].uploadDate : 'None';

          return (
            <div
              key={teacher.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition shadow-sm space-y-4"
            >
              {/* Teacher Info */}
              <div className="flex items-center space-x-3.5">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h3 className="font-black text-slate-900 text-base truncate">{teacher.name}</h3>
                  <p className="text-xs font-semibold text-sky-600 truncate">{teacher.subject}</p>
                  <p className="text-[11px] text-slate-400">
                    Section In-Charge: <strong>{teacher.inchargeSection || 'None'}</strong>
                  </p>
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Uploads</span>
                  <span className="text-lg font-black text-sky-700">{uploads.length}</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Views</span>
                  <span className="text-lg font-black text-emerald-700">{totalViews}</span>
                </div>
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Unique Viewers</span>
                  <span className="text-lg font-black text-purple-700">{uniqueStudents}</span>
                </div>
              </div>

              {/* Upload Types Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-700 pt-1">
                <div className="flex items-center space-x-1.5 p-2 bg-slate-50 rounded-xl">
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>{pictures} Pictures</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-slate-50 rounded-xl">
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{videos} Videos</span>
                </div>
                <div className="flex items-center space-x-1.5 p-2 bg-slate-50 rounded-xl">
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  <span>{notes} Notes/PDF</span>
                </div>
              </div>

              {/* Performance Highlights */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Most Viewed Content:</span>
                  <span className="text-slate-800 font-bold text-right truncate max-w-[200px]" title={mostViewed}>
                    {mostViewed}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Latest Upload:</span>
                  <span className="font-semibold text-slate-700">{latestUpload}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
