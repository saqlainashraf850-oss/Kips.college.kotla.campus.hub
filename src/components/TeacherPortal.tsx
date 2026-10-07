import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  GraduationCap,
  UploadCloud,
  CheckSquare,
  Users,
  Globe,
  LogOut,
  Plus,
  Trash2,
  Play,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Camera,
  Smartphone,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const {
    db,
    currentTeacher,
    logout,
    setActiveView,
    addMaterial,
    deleteMaterial,
    addGalleryItem,
    markAttendance
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'upload' | 'attendance' | 'students'>('upload');
  const [selectedSection, setSelectedSection] = useState(
    currentTeacher?.inchargeSection && currentTeacher.inchargeSection !== 'None'
      ? currentTeacher.inchargeSection
      : db.sections[0]?.name || 'CB1'
  );

  // Upload Form Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matType, setMatType] = useState<'PDF' | 'Image' | 'Video'>('Image');
  const [matSection, setMatSection] = useState('CB1');
  const [matVideoUrl, setMatVideoUrl] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [alsoAddToGallery, setAlsoAddToGallery] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<'Campus' | 'Labs' | 'Maths' | 'Events' | 'Sports'>('Maths');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!currentTeacher) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-red-600 font-bold">No active teacher session.</p>
        <button
          onClick={() => setActiveView('login')}
          className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setFileDataUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenUploadModalWithType = (type: 'PDF' | 'Image' | 'Video') => {
    setMatType(type);
    setFileDataUrl('');
    setFileName('');
    setMatTitle('');
    setMatVideoUrl('');
    setMatDesc('');
    setUploadError(null);
    setAlsoAddToGallery(false);
    setShowUploadModal(true);
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    if (!matTitle.trim()) {
      setUploadError("Please enter a title for the material.");
      return;
    }

    if (matType === 'Video' && !matVideoUrl.trim()) {
      setUploadError("Please provide a valid Video URL or Google Drive link.");
      return;
    }

    if (matType !== 'Video' && !fileDataUrl) {
      setUploadError("Please select a file or photo from your device.");
      return;
    }

    // 1. Add to Academic Lecture Materials
    addMaterial({
      title: matTitle.trim(),
      type: matType,
      section: matSection,
      fileUrl: fileDataUrl || undefined,
      videoUrl: matType === 'Video' ? matVideoUrl.trim() : undefined,
      uploader: `${currentTeacher.name} (${currentTeacher.subject.split('(')[0].trim()})`,
      description: matDesc.trim() || undefined
    });

    // 2. Also publish to College Campus Photo Gallery if selected
    if (matType === 'Image' && alsoAddToGallery && fileDataUrl) {
      addGalleryItem({
        title: matTitle.trim(),
        category: galleryCategory,
        url: fileDataUrl,
        description: `Uploaded by ${currentTeacher.name} - ${matDesc.trim() || 'Classroom / Academic Session'}`
      });
    }

    setShowUploadModal(false);
    setMatTitle('');
    setMatVideoUrl('');
    setMatDesc('');
    setFileDataUrl('');
    setFileName('');
    setAlsoAddToGallery(false);
    setActionSuccessNotice("Resource successfully uploaded and published to students!");
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const filteredStudents = db.students.filter(
    s => selectedSection === 'All' || s.section === selectedSection
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
              <p className="text-[10px] font-bold text-sky-600">Teacher Workspace</p>
            </div>
          </div>

          {/* Teacher Profile Box */}
          <div className="flex items-center space-x-3 bg-sky-50/80 p-3.5 rounded-2xl border border-sky-200">
            <img
              src={currentTeacher.photo}
              alt={currentTeacher.name}
              className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm img-zoom-focus"
            />
            <div className="overflow-hidden">
              <h4 className="font-black text-xs text-slate-900 truncate">{currentTeacher.name}</h4>
              <p className="text-[10px] font-bold text-sky-700 truncate">{currentTeacher.subject}</p>
              <p className="text-[9px] text-slate-500">
                In-charge: Section {currentTeacher.inchargeSection || 'None'}
              </p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'upload'
                  ? 'bg-sky-600 text-white shadow'
                  : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Notes & Media</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'attendance'
                  ? 'bg-sky-600 text-white shadow'
                  : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Attendance Register</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'students'
                  ? 'bg-sky-600 text-white shadow'
                  : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Section Students</span>
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

      {/* Main Content Pane */}
      <main className="flex-1 space-y-6">
        {/* Success Banner */}
        {actionSuccessNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
        )}

        {/* TAB 1: UPLOAD NOTES & MEDIA */}
        {activeTab === 'upload' && (
          <div className="glass-panel p-6 rounded-2xl space-y-6 border border-sky-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Upload Notes, Media & Mobile Gallery Photos
                </h2>
                <p className="text-xs text-slate-500">
                  Upload directly from your phone gallery, attach PDF notes, or share video lectures
                </p>
              </div>

              <button
                onClick={() => handleOpenUploadModalWithType('Image')}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Resource</span>
              </button>
            </div>

            {/* Direct Upload Cards (Mobile Gallery, PDF, Video Link) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Option 1: Mobile Gallery / Camera */}
              <div
                onClick={() => handleOpenUploadModalWithType('Image')}
                className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 hover:border-sky-400 hover:shadow-md cursor-pointer transition space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">From Mobile Gallery</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Directly upload photos, whiteboard captures, or campus events
                  </p>
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-sky-700 group-hover:underline">
                  Pick from Phone &rarr;
                </span>
              </div>

              {/* Option 2: PDF Document Notes */}
              <div
                onClick={() => handleOpenUploadModalWithType('PDF')}
                className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 hover:border-rose-400 hover:shadow-md cursor-pointer transition space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Upload PDF / Document</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Past papers, chapter formula sheets, and solved exercises
                  </p>
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-rose-700 group-hover:underline">
                  Select Document &rarr;
                </span>
              </div>

              {/* Option 3: External Video / Web Link */}
              <div
                onClick={() => handleOpenUploadModalWithType('Video')}
                className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Video / Drive Link</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    YouTube recorded lectures, Drive folders, or web study links
                  </p>
                </div>
                <span className="inline-flex items-center text-[11px] font-bold text-indigo-700 group-hover:underline">
                  Attach Web Link &rarr;
                </span>
              </div>
            </div>

            {/* List of uploaded materials */}
            <div className="pt-2">
              <h3 className="font-extrabold text-slate-900 text-sm mb-3">
                Published Resources ({db.materials.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {db.materials.map(mat => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative flex flex-col justify-between hover:border-sky-300 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            mat.type === 'PDF'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : mat.type === 'Video'
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {mat.type}
                        </span>
                        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                          Section: {mat.section}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{mat.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{mat.description || 'Classroom notes'}</p>
                      <p className="text-[11px] text-slate-400 font-medium">By {mat.uploader} • {mat.date}</p>

                      {mat.type === 'Image' && mat.fileUrl && (
                        <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                          <img
                            src={mat.fileUrl}
                            alt={mat.title}
                            className="w-full h-full object-cover img-zoom-focus"
                          />
                        </div>
                      )}

                      {mat.type === 'Video' && mat.videoUrl && (
                        <a
                          href={mat.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span className="truncate">Open Video Lecture</span>
                        </a>
                      )}

                      {mat.type === 'PDF' && mat.fileUrl && (
                        <a
                          href={mat.fileUrl}
                          download={`${mat.title}.pdf`}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Download PDF Document</span>
                        </a>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">ID: {mat.id}</span>
                      <button
                        onClick={() => {
                          deleteMaterial(mat.id);
                          setActionSuccessNotice(`Material "${mat.title}" deleted.`);
                          setTimeout(() => setActionSuccessNotice(null), 3000);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE REGISTER */}
        {activeTab === 'attendance' && (
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-sky-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Daily Attendance Register</h2>
                <p className="text-xs text-slate-500">
                  Mark daily scholar presence for Section CB1, CB2, or custom batches
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600">Filter Section:</span>
                <select
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="All">All Sections</option>
                  {db.sections.map(s => (
                    <option key={s.id} value={s.name}>Section {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-sky-950 font-bold uppercase border-b border-sky-100">
                  <tr>
                    <th className="p-3">Scholar</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Attendance %</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Mark Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold bg-white">
                  {filteredStudents.map(std => (
                    <tr key={std.id} className="hover:bg-sky-50/50 transition">
                      <td className="p-3 flex items-center space-x-2.5">
                        <img
                          src={std.photo}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 img-zoom-focus"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{std.name}</span>
                          <span className="text-[10px] text-slate-400">Card: {std.cardId}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-sky-600">{std.section}</td>
                      <td className="p-3 font-mono">{std.roll}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">{std.attendance}%</span>
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${std.attendance}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            std.attendanceStatus === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : std.attendanceStatus === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {std.attendanceStatus || 'Present'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => markAttendance(std.id, 'Present')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold transition"
                        >
                          P
                        </button>
                        <button
                          onClick={() => markAttendance(std.id, 'Late')}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-lg text-[10px] font-bold transition"
                        >
                          L
                        </button>
                        <button
                          onClick={() => markAttendance(std.id, 'Absent')}
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold transition"
                        >
                          A
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ENROLLED STUDENTS ROSTER */}
        {activeTab === 'students' && (
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Enrolled Students Roster</h2>
                <p className="text-xs text-slate-500">
                  Full list of scholars enrolled in academic batches
                </p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                {db.students.length} Total Scholars
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-sky-950 font-bold uppercase border-b border-sky-100">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Gmail</th>
                    <th className="p-3 text-right">Card ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold bg-white">
                  {db.students.map(std => (
                    <tr key={std.id} className="hover:bg-sky-50/50 transition">
                      <td className="p-3 flex items-center space-x-2.5">
                        <img
                          src={std.photo}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 img-zoom-focus"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{std.name}</span>
                          <span className="text-[10px] text-slate-400">Father: {std.father}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-sky-600">{std.section}</td>
                      <td className="p-3 font-mono">{std.roll}</td>
                      <td className="p-3 text-slate-600">{std.email}</td>
                      <td className="p-3 text-right font-mono text-purple-700 font-bold">{std.cardId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Direct Upload Material / Mobile Photo Gallery */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel bg-white/95 max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-sky-200 max-h-[92vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2">
                  {matType === 'Image' ? (
                    <Smartphone className="w-5 h-5 text-sky-600" />
                  ) : matType === 'PDF' ? (
                    <FileText className="w-5 h-5 text-rose-600" />
                  ) : (
                    <LinkIcon className="w-5 h-5 text-indigo-600" />
                  )}
                  <h3 className="font-black text-slate-900 text-sm">
                    {matType === 'Image'
                      ? 'Upload from Mobile Gallery / Camera'
                      : matType === 'PDF'
                      ? 'Upload PDF / Notes Document'
                      : 'Attach Video / Web Link'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Resource Type Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMatType('Image')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    matType === 'Image' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photo/Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMatType('PDF')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    matType === 'PDF' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMatType('Video')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                    matType === 'Video' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Video/Link</span>
                </button>
              </div>

              <form onSubmit={handleMaterialSubmit} className="space-y-3.5 text-xs font-medium">
                {uploadError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={e => setMatTitle(e.target.value)}
                    placeholder={
                      matType === 'Image'
                        ? 'e.g. Chapter 3 Calculus Board Solution or Lab Setup'
                        : matType === 'PDF'
                        ? 'e.g. Physics Chapter 4 Complete Numerical Notes'
                        : 'e.g. ECAT Mathematics Crash Course Lecture 1'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Section</label>
                    <select
                      value={matSection}
                      onChange={e => setMatSection(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="All">All Sections (CB1, CB2)</option>
                      {db.sections.map(s => (
                        <option key={s.id} value={s.name}>Section {s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Subject</label>
                    <input
                      type="text"
                      disabled
                      value={currentTeacher.subject}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-bold truncate"
                    />
                  </div>
                </div>

                {matType === 'Video' ? (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Video Lecture URL (YouTube / Google Drive / Web Link) *
                    </label>
                    <input
                      type="url"
                      required
                      value={matVideoUrl}
                      onChange={e => setMatVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or Google Drive URL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-slate-700 font-bold mb-1">
                      {matType === 'Image'
                        ? '📱 Choose Photo from Mobile Phone Gallery / Camera *'
                        : '📑 Select PDF or Document File *'}
                    </label>

                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl bg-sky-50/40 hover:bg-sky-50 cursor-pointer transition">
                      {matType === 'Image' ? (
                        <Camera className="w-8 h-8 text-sky-600 mb-1" />
                      ) : (
                        <FileText className="w-8 h-8 text-rose-500 mb-1" />
                      )}
                      <span className="font-bold text-slate-800 text-xs">
                        {fileName ? fileName : matType === 'Image' ? 'Tap to open Mobile Gallery / Camera' : 'Tap to choose PDF / Document'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {matType === 'Image' ? 'Supports JPG, PNG, WEBP from your phone' : 'Supports .pdf, .docx'}
                      </span>
                      <input
                        type="file"
                        accept={matType === 'PDF' ? '.pdf,application/pdf,.doc,.docx' : 'image/*'}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Image Live Preview */}
                    {matType === 'Image' && fileDataUrl && (
                      <div className="relative rounded-2xl overflow-hidden border border-sky-200 bg-slate-50 mt-2">
                        <img
                          src={fileDataUrl}
                          alt="Mobile Preview"
                          className="w-full h-36 object-cover"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white rounded text-[10px] font-bold">
                          Live Mobile Preview
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Option to also publish to Campus Gallery */}
                {matType === 'Image' && (
                  <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alsoAddToGallery}
                        onChange={e => setAlsoAddToGallery(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-800 text-xs">
                        Also add this picture to the Public Campus Photo Gallery
                      </span>
                    </label>

                    {alsoAddToGallery && (
                      <div className="pl-6 pt-1">
                        <label className="block text-slate-600 text-[11px] font-bold mb-1">
                          Campus Gallery Category:
                        </label>
                        <select
                          value={galleryCategory}
                          onChange={e => setGalleryCategory(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                        >
                          <option value="Maths">Mathematics & Seminars</option>
                          <option value="Labs">Science & IT Labs</option>
                          <option value="Campus">Campus Grounds & Life</option>
                          <option value="Events">Annual Events & Functions</option>
                          <option value="Sports">Sports Activities</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brief Description / Topic Summary</label>
                  <textarea
                    rows={2}
                    value={matDesc}
                    onChange={e => setMatDesc(e.target.value)}
                    placeholder="e.g. Important questions for upcoming Board examination / Section revision"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow mt-2 transition flex items-center justify-center space-x-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish to Students & College</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
