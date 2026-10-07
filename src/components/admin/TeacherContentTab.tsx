import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  UploadCloud,
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  Play,
  FileText,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  X,
  Layers,
  Search,
  Filter,
  BarChart2,
  Calendar,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { TeacherContentItem } from '../../types';

export const TeacherContentTab: React.FC = () => {
  const {
    db,
    teacherContents,
    contentViews,
    deleteTeacherContent,
    updateTeacherContent
  } = usePortal();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Preview & Modal State
  const [previewItem, setPreviewItem] = useState<TeacherContentItem | null>(null);
  const [editItem, setEditItem] = useState<TeacherContentItem | null>(null);
  const [editTargetSection, setEditTargetSection] = useState('CB1');
  const [editTargetClass, setEditTargetClass] = useState('1st Year');
  const [analyticsItem, setAnalyticsItem] = useState<TeacherContentItem | null>(null);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [studentListSubTab, setStudentListSubTab] = useState<'viewed' | 'not_viewed'>('viewed');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredContents = teacherContents.filter(c => {
    if (sectionFilter !== 'All' && !c.targetSection.includes(sectionFilter) && c.targetSection !== 'All') return false;
    if (typeFilter !== 'All' && c.fileType.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.teacherName.toLowerCase().includes(q) ||
      c.targetSection.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also remove access from the student portal.`)) return;
    await deleteTeacherContent(id);
    showToast(`Content "${title}" deleted from portal.`);
  };

  const handleToggleHide = async (item: TeacherContentItem) => {
    const isHidden = !item.isHidden;
    await updateTeacherContent(item.id, { isHidden });
    showToast(isHidden ? `Content "${item.title}" hidden from students.` : `Content "${item.title}" is now visible to students.`);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    await updateTeacherContent(editItem.id, {
      targetSection: editTargetSection,
      targetClass: editTargetClass
    });
    setEditItem(null);
    showToast(`Target section for "${editItem.title}" updated to ${editTargetSection}.`);
  };

  // Content Analytics Calculation
  const getAnalyticsData = (content: TeacherContentItem) => {
    const views = contentViews.filter(v => v.contentId === content.id);
    let targetStudents = db.students.filter(s => s.status === 'approved');
    if (content.targetSection && content.targetSection !== 'All') {
      targetStudents = targetStudents.filter(s => content.targetSection.includes(s.section));
    }

    const viewedStudentIds = new Set(views.map(v => v.studentId));
    const notViewedStudents = targetStudents.filter(s => !viewedStudentIds.has(s.id));

    return {
      totalViews: content.totalViews || views.reduce((a, b) => a + b.viewCount, 0),
      uniqueStudents: content.uniqueViewers || viewedStudentIds.size,
      totalTargetStudents: targetStudents.length,
      notViewedCount: notViewedStudents.length,
      viewedList: views,
      notViewedList: notViewedStudents
    };
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-sky-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-sky-600 text-white rounded-xl shadow-md shadow-sky-600/30">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Teacher Uploads / Content Management
            </h2>
            <p className="text-xs text-slate-500">
              Oversee teacher study materials, manage target sections, and analyze student engagement
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
          Total Uploads: {teacherContents.length}
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        <div className="lg:col-span-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Title, Teacher Name, Section..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div>
          <select
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 shadow-sm"
          >
            <option value="All">All Sections</option>
            <option value="CB1">Section CB1</option>
            <option value="CB2">Section CB2</option>
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 shadow-sm"
          >
            <option value="All">All Media Types</option>
            <option value="PDF">PDF Notes</option>
            <option value="Video">Video Lectures</option>
            <option value="Image">Whiteboard Images</option>
            <option value="Notes">Concept Notes</option>
            <option value="Assignment">Assignments</option>
          </select>
        </div>
      </div>

      {/* Content Table / Cards */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-sky-50 text-sky-950 font-bold uppercase border-b border-sky-100">
            <tr>
              <th className="p-3.5">Content Title & Type</th>
              <th className="p-3.5">Teacher Name</th>
              <th className="p-3.5">Target Audience</th>
              <th className="p-3.5">Uploaded Date</th>
              <th className="p-3.5">Engagement Analytics</th>
              <th className="p-3.5 text-right">Admin Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredContents.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No uploaded study materials found matching the filters.
                </td>
              </tr>
            ) : (
              filteredContents.map(item => (
                <tr key={item.id} className={`hover:bg-sky-50/40 transition ${item.isHidden ? 'opacity-60 bg-slate-50' : ''}`}>
                  {/* Title & Type */}
                  <td className="p-3.5">
                    <div className="flex items-start space-x-2.5">
                      <div className="p-2 rounded-xl bg-sky-100 text-sky-700 flex-shrink-0 mt-0.5">
                        {item.fileType === 'PDF' ? (
                          <FileText className="w-4 h-4 text-red-600" />
                        ) : item.fileType === 'Video' ? (
                          <Play className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-teal-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-slate-900 block">{item.title}</span>
                          {item.isHidden && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                              Hidden
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{item.description}</span>
                      </div>
                    </div>
                  </td>

                  {/* Teacher */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">{item.teacherName}</span>
                    <span className="text-[10px] text-slate-400">ID: {item.teacherId}</span>
                  </td>

                  {/* Target Audience */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-bold text-[11px] block w-fit">
                      Section: {item.targetSection}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Class: {item.targetClass}</span>
                  </td>

                  {/* Upload Date */}
                  <td className="p-3.5 whitespace-nowrap text-[11px] text-slate-600">
                    {item.uploadDate}
                  </td>

                  {/* Views */}
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="font-black text-sky-800 text-sm block">
                        {item.totalViews} Views
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block">
                        Unique Students: <strong>{item.uniqueViewers}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Controls */}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* VIEW ANALYTICS BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          setAnalyticsItem(item);
                          setShowStudentListModal(false);
                        }}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg font-bold flex items-center space-x-1 transition text-[11px] border border-sky-200"
                        title="View Detailed Student Engagement Analytics"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Analytics</span>
                      </button>

                      {/* PREVIEW BUTTON */}
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition"
                        title="Preview Content"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* EDIT TARGET SECTION */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditItem(item);
                          setEditTargetSection(item.targetSection);
                          setEditTargetClass(item.targetClass);
                        }}
                        className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                        title="Change Target Section / Class"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* HIDE / UNHIDE */}
                      <button
                        type="button"
                        onClick={() => handleToggleHide(item)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        title={item.isHidden ? 'Unhide for students' : 'Hide from students'}
                      >
                        {item.isHidden ? <Unlock className="w-4 h-4 text-amber-600" /> : <Lock className="w-4 h-4" />}
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete Content"
                      >
                        <Trash2 className="w-4 h-4" />
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
      {/* CONTENT VIEW ANALYTICS MODAL & VIEW STUDENT LIST                */}
      {/* ============================================================== */}
      {analyticsItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2.5">
                <BarChart2 className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Content View Analytics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Title: <strong className="text-slate-800">{analyticsItem.title}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Teacher and Upload Details Card */}
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col sm:flex-row justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Uploaded By:</span>
                <p className="font-black text-slate-900 text-sm">{analyticsItem.teacherName}</p>
                <p className="text-slate-500 text-[11px]">Section: <strong>{analyticsItem.targetSection}</strong></p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Uploaded Date:</span>
                <p className="font-semibold text-slate-800">{analyticsItem.uploadDate}</p>
                <p className="text-slate-500 text-[11px]">Type: {analyticsItem.fileType}</p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            {(() => {
              const data = getAnalyticsData(analyticsItem);
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Views</span>
                      <span className="text-2xl font-black text-sky-600">{data.totalViews}</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Unique Students</span>
                      <span className="text-2xl font-black text-emerald-600">{data.uniqueStudents}</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Target Students</span>
                      <span className="text-2xl font-black text-slate-800">{data.totalTargetStudents}</span>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Not Viewed Yet</span>
                      <span className="text-2xl font-black text-rose-600">{data.notViewedCount}</span>
                    </div>
                  </div>

                  {/* "VIEW STUDENT LIST" BUTTON */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">Student Attendance Breakdown: </span>
                      <span className="text-slate-500">
                        {data.uniqueStudents} Viewed / {data.notViewedCount} Not Viewed
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowStudentListModal(!showStudentListModal)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center space-x-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{showStudentListModal ? 'HIDE STUDENT LIST' : 'VIEW STUDENT LIST'}</span>
                    </button>
                  </div>

                  {/* Detailed Student List Table */}
                  {showStudentListModal && (
                    <div className="space-y-3 pt-2 animate-fade-in border-t border-slate-200">
                      <div className="flex items-center space-x-2 border-b pb-2">
                        <button
                          type="button"
                          onClick={() => setStudentListSubTab('viewed')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            studentListSubTab === 'viewed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Viewed ({data.viewedList.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setStudentListSubTab('not_viewed')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            studentListSubTab === 'not_viewed'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Students Who Have Not Viewed ({data.notViewedList.length})
                        </button>
                      </div>

                      {studentListSubTab === 'viewed' ? (
                        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[10px]">
                              <tr>
                                <th className="p-2.5">Student Name</th>
                                <th className="p-2.5">Section</th>
                                <th className="p-2.5">First Viewed</th>
                                <th className="p-2.5">Last Viewed</th>
                                <th className="p-2.5 text-right">Count</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {data.viewedList.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-4 text-center text-slate-400">
                                    No student views recorded yet.
                                  </td>
                                </tr>
                              ) : (
                                data.viewedList.map(v => (
                                  <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-bold text-slate-900">{v.studentName}</td>
                                    <td className="p-2.5">{v.section}</td>
                                    <td className="p-2.5 text-[11px] text-slate-500">{v.firstViewedAt}</td>
                                    <td className="p-2.5 text-[11px] text-slate-500">{v.lastViewedAt}</td>
                                    <td className="p-2.5 text-right font-black text-sky-600">{v.viewCount}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[10px]">
                              <tr>
                                <th className="p-2.5">Roll No</th>
                                <th className="p-2.5">Student Name</th>
                                <th className="p-2.5">Class</th>
                                <th className="p-2.5">Section</th>
                                <th className="p-2.5 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {data.notViewedList.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-4 text-center text-emerald-600 font-bold">
                                    🎉 All students in this section have viewed this content!
                                  </td>
                                </tr>
                              ) : (
                                data.notViewedList.map(s => (
                                  <tr key={s.id} className="hover:bg-slate-50">
                                    <td className="p-2.5 font-mono font-bold text-slate-800">{s.roll}</td>
                                    <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                                    <td className="p-2.5">{s.class}</td>
                                    <td className="p-2.5">{s.section}</td>
                                    <td className="p-2.5 text-right font-bold text-rose-600">Not Viewed</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setAnalyticsItem(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT TARGET SECTION MODAL                                      */}
      {/* ============================================================== */}
      {editItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-sky-200">
            <h4 className="font-black text-slate-900 text-sm">Edit Target Audience</h4>
            <p className="text-xs text-slate-500">
              Content: <strong>{editItem.title}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                <select
                  value={editTargetClass}
                  onChange={e => setEditTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="All">All Classes</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Section(s)</label>
                <select
                  value={editTargetSection}
                  onChange={e => setEditTargetSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="All">All Students</option>
                  <option value="CB1">Section CB1</option>
                  <option value="CB2">Section CB2</option>
                  <option value="CB1 + CB2">CB1 + CB2 (Multiple Sections)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PREVIEW MEDIA MODAL                                             */}
      {/* ============================================================== */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel bg-white max-w-xl w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-sky-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm">{previewItem.title}</h4>
                <p className="text-xs text-slate-500">By {previewItem.teacherName}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewItem.fileType === 'Image' && previewItem.fileUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96">
                <img src={previewItem.fileUrl} alt={previewItem.title} className="w-full h-full object-contain" />
              </div>
            )}

            {previewItem.fileType === 'Video' && (
              <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-2">
                <Play className="w-8 h-8 text-indigo-600 mx-auto" />
                <p className="text-xs text-slate-600">Video Link / YouTube URL</p>
                {previewItem.fileUrl && (
                  <a
                    href={previewItem.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-indigo-600 font-bold underline"
                  >
                    <span>Open Video Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {previewItem.fileType === 'PDF' && (
              <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-2">
                <FileText className="w-8 h-8 text-red-600 mx-auto" />
                <p className="text-xs text-slate-600">PDF Document Resource</p>
                {previewItem.fileUrl && (
                  <a
                    href={previewItem.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-red-600 font-bold underline"
                  >
                    <span>View / Download PDF Document</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">{previewItem.description}</p>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
