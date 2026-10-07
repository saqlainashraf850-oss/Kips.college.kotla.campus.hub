import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  LayoutDashboard,
  Phone,
  MessageSquare,
  Layers,
  Users,
  GraduationCap,
  Bell,
  UserCheck,
  Image as ImageIcon,
  Palette,
  Shield,
  Database,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Download,
  Upload,
  RefreshCw,
  X,
  ExternalLink,
  MapPin,
  Clock,
  Mail,
  Smartphone,
  Eye,
  Check,
  ShieldCheck,
  Send,
  UploadCloud,
  BarChart2,
  Activity,
  FileText,
  Award,
  Sparkles
} from 'lucide-react';
import { NotificationsModal } from './admin/NotificationsModal';
import { AdmissionApplicationsTab } from './admin/AdmissionApplicationsTab';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { TeacherContentTab } from './admin/TeacherContentTab';
import { TeacherAnalyticsTab } from './admin/TeacherAnalyticsTab';
import { AuditLogsTab } from './admin/AuditLogsTab';
import { ActiveSessionsTab } from './admin/ActiveSessionsTab';

export const AdminPortal: React.FC = () => {
  const {
    db,
    logout,
    updateContact,
    updatePrincipal,
    updateBranding,
    updateAdminAuth,
    addSection,
    deleteSection,
    approveStudent,
    rejectStudent,
    updatePrincipalMobile,
    deleteStudent,
    addTeacher,
    deleteTeacher,
    addAnnouncement,
    deleteAnnouncement,
    addGalleryItem,
    deleteGalleryItem,
    updateInquiryStatus,
    deleteInquiry,
    addLocation,
    updateLocation,
    deleteLocation,
    exportBackup,
    importBackup,
    resetDatabase,
    applications,
    unreadAdminNotificationsCount,
    currentAdmin
  } = usePortal();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'applications' | 'approvals' | 'content' | 'teacher-analytics' | 'audit' | 'sessions' | 'contact' | 'locations' | 'inquiries' | 'sections' | 'students' | 'teachers' | 'notices' | 'principal' | 'gallery' | 'branding' | 'settings' | 'backup'
  >('approvals');

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // --- APPROVAL MANAGEMENT STATE ---
  const [approvalSubTab, setApprovalSubTab] = useState<'pending' | 'approved' | 'rejected' | 'all' | 'notifications'>('pending');
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<any | null>(null);
  const [studentToReject, setStudentToReject] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [approvalSearchQuery, setApprovalSearchQuery] = useState('');

  // --- PRINCIPAL APPROVAL MOBILE CONFIGURATION STATE ---
  const [prApprovalMobileInput, setPrApprovalMobileInput] = useState(
    db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543'
  );
  const [prMobileNotice, setPrMobileNotice] = useState<string | null>(null);
  const [prMobileError, setPrMobileError] = useState<string | null>(null);

  // --- LOCATION FORM STATE ---
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [locTitle, setLocTitle] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locLandmark, setLocLandmark] = useState('');
  const [locMapUrl, setLocMapUrl] = useState('');
  const [locPhone, setLocPhone] = useState('');
  const [locIsPrimary, setLocIsPrimary] = useState(false);

  // --- CONTACT FORM STATE ---
  const [contactAddress, setContactAddress] = useState(db.contact.address);
  const [contactPhone, setContactPhone] = useState(db.contact.phone);
  const [contactWhatsapp, setContactWhatsapp] = useState(db.contact.whatsapp);
  const [contactEmail, setContactEmail] = useState(db.contact.email);
  const [contactAdmissionEmail, setContactAdmissionEmail] = useState(db.contact.admissionEmail);
  const [contactHours, setContactHours] = useState(db.contact.hours);
  const [contactEmergency, setContactEmergency] = useState(db.contact.emergencyHelpline);
  const [contactMapUrl, setContactMapUrl] = useState(db.contact.locationMapUrl || '');
  const [contactSavedNotice, setContactSavedNotice] = useState(false);

  // --- PRINCIPAL FORM STATE ---
  const [prName, setPrName] = useState(db.principal.name);
  const [prDesig, setPrDesig] = useState(db.principal.designation);
  const [prQual, setPrQual] = useState(db.principal.qualifications);
  const [prPhone, setPrPhone] = useState(db.principal.phone);
  const [prEmail, setPrEmail] = useState(db.principal.email);
  const [prMsg, setPrMsg] = useState(db.principal.message);
  const [prPhotoUrl, setPrPhotoUrl] = useState(db.principal.photo);
  const [prSavedNotice, setPrSavedNotice] = useState(false);

  // --- BRANDING STATE ---
  const [brandTitle, setBrandTitle] = useState(db.branding.title);
  const [brandLogoUrl, setBrandLogoUrl] = useState(db.branding.logoUrl);

  // --- SECURITY STATE ---
  const [newAdminUser, setNewAdminUser] = useState(db.auth.adminUser);
  const [newAdminPass, setNewAdminPass] = useState(db.auth.adminPass);

  // --- DELETION & NOTICE STATE ---
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null);
  const [adminActionNotice, setAdminActionNotice] = useState<string | null>(null);

  const showAdminToast = (msg: string) => {
    setAdminActionNotice(msg);
    setTimeout(() => setAdminActionNotice(null), 3500);
  };

  // --- MODALS STATE ---
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [secName, setSecName] = useState('');
  const [secRoom, setSecRoom] = useState('');
  const [secCapacity, setSecCapacity] = useState(60);

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [teaName, setTeaName] = useState('');
  const [teaEmail, setTeaEmail] = useState('');
  const [teaPass, setTeaPass] = useState('1234');
  const [teaSubject, setTeaSubject] = useState('');
  const [teaIncharge, setTeaIncharge] = useState('None');
  const [teaQual, setTeaQual] = useState('');
  const [teaExp, setTeaExp] = useState('');
  const [teaPhotoUrl, setTeaPhotoUrl] = useState('');

  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [notTitle, setNotTitle] = useState('');
  const [notPriority, setNotPriority] = useState<'Urgent' | 'Important' | 'General'>('Important');
  const [notDesc, setNotDesc] = useState('');
  const [notPhotoUrl, setNotPhotoUrl] = useState('');

  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<'Campus' | 'Labs' | 'Maths' | 'Events'>('Maths');
  const [galPhotoUrl, setGalPhotoUrl] = useState('');

  // Filter for students table
  const [studentSectionFilter, setStudentSectionFilter] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');

  // 1. SAVE CONTACT INFO (Requested Feature)
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact({
      address: contactAddress.trim(),
      phone: contactPhone.trim(),
      whatsapp: contactWhatsapp.trim(),
      email: contactEmail.trim(),
      admissionEmail: contactAdmissionEmail.trim(),
      hours: contactHours.trim(),
      emergencyHelpline: contactEmergency.trim(),
      locationMapUrl: contactMapUrl.trim()
    });
    setContactSavedNotice(true);
    setTimeout(() => setContactSavedNotice(false), 5000);
  };

  // 2. SAVE PRINCIPAL INFO
  const handleSavePrincipal = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrincipal({
      name: prName.trim(),
      designation: prDesig.trim(),
      qualifications: prQual.trim(),
      phone: prPhone.trim(),
      email: prEmail.trim(),
      message: prMsg.trim(),
      photo: prPhotoUrl || db.principal.photo
    });
    setPrSavedNotice(true);
    setTimeout(() => setPrSavedNotice(false), 5000);
  };

  // 3. CREATE SECTION
  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = secName.trim().toUpperCase();
    if (!clean || !secRoom.trim()) {
      showAdminToast("Please provide Section Name and Room.");
      return;
    }
    const ok = addSection({
      name: clean,
      room: secRoom.trim(),
      incharge: 'Unassigned',
      capacity: Number(secCapacity) || 60
    });
    if (!ok) {
      showAdminToast(`Section "${clean}" already exists.`);
      return;
    }
    setShowAddSectionModal(false);
    setSecName('');
    setSecRoom('');
    showAdminToast(`Section ${clean} created successfully!`);
  };

  // 4. PRINCIPAL APPROVAL ACTIONS
  const handleApproveStudent = (studentId: string, studentName: string) => {
    const res = approveStudent(studentId);
    if (res.success) {
      setAdminActionNotice(`Student "${studentName}" approved! Account activated and student can now log in.`);
      setTimeout(() => setAdminActionNotice(null), 4000);
      if (selectedStudentForDetails?.id === studentId) {
        setSelectedStudentForDetails((prev: any) => prev ? { ...prev, status: 'approved' } : null);
      }
    }
  };

  const handleOpenRejectModal = (student: any) => {
    setStudentToReject(student);
    setRejectionReasonInput('Your account has not been approved by the Principal.');
  };

  const handleConfirmReject = () => {
    if (!studentToReject) return;
    const res = rejectStudent(studentToReject.id, rejectionReasonInput.trim());
    if (res.success) {
      setAdminActionNotice(`Student "${studentToReject.name}" registration request rejected.`);
      setTimeout(() => setAdminActionNotice(null), 4000);
      if (selectedStudentForDetails?.id === studentToReject.id) {
        setSelectedStudentForDetails((prev: any) => prev ? { ...prev, status: 'rejected', rejectionReason: rejectionReasonInput.trim() } : null);
      }
      setStudentToReject(null);
    }
  };

  const handleSavePrincipalMobile = (e: React.FormEvent) => {
    e.preventDefault();
    setPrMobileNotice(null);
    setPrMobileError(null);
    const res = updatePrincipalMobile(prApprovalMobileInput);
    if (res.success) {
      setPrMobileNotice(res.message);
      setTimeout(() => setPrMobileNotice(null), 5000);
    } else {
      setPrMobileError(res.message);
    }
  };

  // 5. CREATE TEACHER (MATHS / SCIENCE)
  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teaName.trim() || !teaEmail.trim() || !teaPass.trim() || !teaSubject.trim()) {
      showAdminToast("Name, Gmail, Password and Subject/Standard are required.");
      return;
    }

    const res = addTeacher({
      name: teaName.trim(),
      email: teaEmail.trim(),
      pass: teaPass.trim(),
      subject: teaSubject.trim(),
      inchargeSection: teaIncharge,
      qualification: teaQual.trim() || 'M.Sc Subject Specialist',
      experience: teaExp.trim() || 'Senior Faculty',
      photo: teaPhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    });

    if (!res.success) {
      showAdminToast(res.message || "Failed to register teacher.");
      return;
    }

    setShowAddTeacherModal(false);
    setTeaName('');
    setTeaEmail('');
    setTeaSubject('');
    setTeaQual('');
    setTeaExp('');
    setTeaPhotoUrl('');
    showAdminToast(`Teacher registered successfully! Login Email: ${teaEmail}`);
  };

  // 6. CREATE NOTICE WITH PICTURE
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notTitle.trim() || !notDesc.trim()) {
      showAdminToast("Title and details are required.");
      return;
    }

    addAnnouncement({
      title: notTitle.trim(),
      priority: notPriority,
      desc: notDesc.trim(),
      photo: notPhotoUrl || undefined
    });

    setShowAddNoticeModal(false);
    setNotTitle('');
    setNotDesc('');
    setNotPhotoUrl('');
    showAdminToast("Notice published to website!");
  };

  // 7. CREATE GALLERY PHOTO
  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !galPhotoUrl) {
      showAdminToast("Photo title and image are required.");
      return;
    }

    addGalleryItem({
      title: galTitle.trim(),
      category: galCategory,
      url: galPhotoUrl
    });

    setShowAddGalleryModal(false);
    setGalTitle('');
    setGalPhotoUrl('');
    showAdminToast("Photo added to college gallery!");
  };

  // 7B. LOCATION HANDLERS (Requested Feature)
  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locTitle.trim() || !locAddress.trim()) {
      showAdminToast("Location title and physical address are required.");
      return;
    }
    addLocation({
      title: locTitle.trim(),
      address: locAddress.trim(),
      landmark: locLandmark.trim() || undefined,
      mapUrl: locMapUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(locAddress.trim())}`,
      phone: locPhone.trim() || undefined,
      isPrimary: locIsPrimary
    });
    setShowAddLocationModal(false);
    setLocTitle('');
    setLocAddress('');
    setLocLandmark('');
    setLocMapUrl('');
    setLocPhone('');
    setLocIsPrimary(false);
    showAdminToast(`Campus location "${locTitle.trim()}" added successfully!`);
  };

  const handleStartEditLocation = (loc: any) => {
    setEditingLocationId(loc.id);
    setLocTitle(loc.title || '');
    setLocAddress(loc.address || '');
    setLocLandmark(loc.landmark || '');
    setLocMapUrl(loc.mapUrl || '');
    setLocPhone(loc.phone || '');
    setLocIsPrimary(!!loc.isPrimary);
    setShowEditLocationModal(true);
  };

  const handleSaveEditLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocationId) return;
    updateLocation(editingLocationId, {
      title: locTitle.trim(),
      address: locAddress.trim(),
      landmark: locLandmark.trim() || undefined,
      mapUrl: locMapUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(locAddress.trim())}`,
      phone: locPhone.trim() || undefined,
      isPrimary: locIsPrimary
    });
    setShowEditLocationModal(false);
    setEditingLocationId(null);
    showAdminToast(`Location updated successfully!`);
  };

  const handleDeleteLocation = (id: string, title: string) => {
    deleteLocation(id);
    showAdminToast(`Location "${title}" deleted.`);
  };

  // 8. UPDATE BRANDING
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(brandTitle.trim(), brandLogoUrl);
    showAdminToast("Branding and College Logo updated site-wide!");
  };

  // 9. UPDATE ADMIN PASSCODE
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.trim() || !newAdminPass.trim()) {
      showAdminToast("Admin username and password cannot be blank.");
      return;
    }
    updateAdminAuth(newAdminUser.trim(), newAdminPass.trim());
    showAdminToast("Admin credentials updated successfully!");
  };

  // 10. RESTORE BACKUP
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importBackup(content);
      if (success) {
        showAdminToast("Database successfully restored from backup!");
      } else {
        showAdminToast("Failed to restore backup. Invalid JSON file format.");
      }
    };
    reader.readAsText(file);
  };

  // Helper file reader for base64 images
  const handlePhotoUploadHelper = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setter(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const pendingStudents = db.students.filter(s => s.status === 'pending');
  const approvedStudents = db.students.filter(s => s.status === 'approved');
  const rejectedStudents = db.students.filter(s => s.status === 'rejected');

  const filteredApprovalStudents = db.students.filter(s => {
    if (approvalSubTab === 'pending' && s.status !== 'pending') return false;
    if (approvalSubTab === 'approved' && s.status !== 'approved') return false;
    if (approvalSubTab === 'rejected' && s.status !== 'rejected') return false;

    if (!approvalSearchQuery.trim()) return true;
    const q = approvalSearchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.roll.toLowerCase().includes(q) ||
      (s.mobile && s.mobile.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      s.class.toLowerCase().includes(q) ||
      s.section.toLowerCase().includes(q)
    );
  });

  const filteredStudents = db.students.filter(s => {
    const matchSec = studentSectionFilter === 'All' || s.section === studentSectionFilter;
    const matchQ = !studentSearch.trim() ||
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.cardId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.roll.toLowerCase().includes(studentSearch.toLowerCase());
    return matchSec && matchQ;
  });

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-5">
      {/* Top Admin Control Bar with Bell Notifications */}
      <div className="glass-panel bg-white/95 p-4 rounded-2xl border border-sky-200/80 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-cyan-500 text-white rounded-xl shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black text-slate-900">
                {db.branding.title} — Admin Portal
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                {currentAdmin?.role || 'Super Admin'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Administrator: <strong className="text-slate-800">{currentAdmin?.name || 'Prof. Muhammad Tariq (Principal)'}</strong>
            </p>
          </div>
        </div>

        {/* Right action group: 🔔 Notifications Button & Quick Shortcuts */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Shortcuts */}
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'applications'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Applications ({applications.filter(a => a.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'content'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Teacher Uploads</span>
          </button>

          {/* REQUIREMENT 2: 🔔 Notifications with unread badge "🔔 3" */}
          <button
            type="button"
            onClick={() => setShowNotificationsModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center space-x-2 relative group"
            title="View Real-Time Student Registration & Campus Notifications"
          >
            <Bell className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>🔔 Notifications</span>
            {unreadAdminNotificationsCount > 0 ? (
              <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full shadow-sm animate-bounce">
                🔔 {unreadAdminNotificationsCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-amber-700/60 text-white text-[10px] rounded-full font-bold">
                0
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 glass-sidebar p-5 rounded-3xl flex flex-col justify-between flex-shrink-0 shadow-lg">
        <div className="space-y-4">
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
              <p className="text-[10px] font-bold text-sky-600">Admin Control Center</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold max-h-[65vh] overflow-y-auto no-scrollbar">
            {/* Dashboard Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'overview' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            {/* Admission Applications */}
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeTab === 'applications' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className={`w-4 h-4 ${activeTab === 'applications' ? 'text-white' : 'text-sky-600'}`} />
                <span className="font-bold">Admission Applications</span>
              </div>
              {applications.filter(a => a.status === 'Pending').length > 0 ? (
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full font-black animate-pulse">
                  {applications.filter(a => a.status === 'Pending').length}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold">
                  {applications.length}
                </span>
              )}
            </button>

            {/* Principal Approvals */}
            <button
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeTab === 'approvals' ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'approvals' ? 'text-white' : 'text-emerald-600'}`} />
                <span className="font-bold">Principal Approvals</span>
              </div>
              {pendingStudents.length > 0 ? (
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full font-black animate-pulse">
                  {pendingStudents.length}
                </span>
              ) : (
                <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold ${activeTab === 'approvals' ? 'bg-sky-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  {approvedStudents.length} Active
                </span>
              )}
            </button>

            {/* Teacher Uploads & Content Management */}
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeTab === 'content' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <UploadCloud className={`w-4 h-4 ${activeTab === 'content' ? 'text-white' : 'text-cyan-600'}`} />
                <span className="font-bold">Teacher Uploads</span>
              </div>
              <span className="px-1.5 py-0.2 bg-cyan-100 text-cyan-800 text-[9px] rounded font-black">
                {db.teacherContents?.length || 0}
              </span>
            </button>

            {/* Teacher Performance Analytics */}
            <button
              onClick={() => setActiveTab('teacher-analytics')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'teacher-analytics' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <BarChart2 className={`w-4 h-4 ${activeTab === 'teacher-analytics' ? 'text-white' : 'text-indigo-600'}`} />
              <span>Teacher Analytics</span>
            </button>

            {/* Audit Logs */}
            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'audit' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Activity className={`w-4 h-4 ${activeTab === 'audit' ? 'text-white' : 'text-slate-600'}`} />
              <span>Activity Audit Logs</span>
            </button>

            {/* Active Sessions */}
            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'sessions' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Shield className={`w-4 h-4 ${activeTab === 'sessions' ? 'text-white' : 'text-purple-600'}`} />
              <span>Active Sessions</span>
            </button>

            {/* Requested Feature Highlighted: Contact */}
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeTab === 'contact' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">Contact Info & Timings</span>
              </div>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] rounded font-black">
                Edit
              </span>
            </button>

            {/* Requested Feature: Locations Management */}
            <button
              onClick={() => setActiveTab('locations')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeTab === 'locations' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-rose-500 animate-icon-blink" />
                <span className="font-bold">Campus Locations & Map</span>
              </div>
              <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[9px] rounded font-black">
                {(db.locations || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                activeTab === 'inquiries' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <span>Admission Inquiries</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                {db.inquiries?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'sections' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Sections (CB1, CB2)</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'students' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>Students (DP & Card ID)</span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'teachers' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Maths Faculty & Teachers</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'notices' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Bell className="w-4 h-4 text-rose-500" />
              <span>Announcements (with Pic)</span>
            </button>

            <button
              onClick={() => setActiveTab('principal')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'principal' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Principal Profile & DP</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'gallery' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-teal-500" />
              <span>Photo Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'branding' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Logo & Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'settings' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4 text-slate-600" />
              <span>Admin Passcode</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition ${
                activeTab === 'backup' ? 'bg-sky-600 text-white shadow' : 'hover:bg-sky-50 text-slate-700'
              }`}
            >
              <Database className="w-4 h-4 text-blue-500" />
              <span>Backup & Restore</span>
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition text-xs font-bold pt-3 border-t border-slate-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Panel</span>
        </button>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 space-y-6">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <AdminOverviewTab onNavigateToTab={(tab: any) => setActiveTab(tab)} />
        )}

        {/* TAB: ADMISSION APPLICATIONS (Requirement 8) */}
        {activeTab === 'applications' && (
          <AdmissionApplicationsTab />
        )}

        {/* TAB: TEACHER UPLOADS & CONTENT MANAGEMENT (Requirement 10) */}
        {activeTab === 'content' && (
          <TeacherContentTab />
        )}

        {/* TAB: TEACHER PERFORMANCE ANALYTICS (Requirement 11 & 12) */}
        {activeTab === 'teacher-analytics' && (
          <TeacherAnalyticsTab />
        )}

        {/* TAB: AUDIT LOGS (Requirement 4, 5, 14) */}
        {activeTab === 'audit' && (
          <AuditLogsTab />
        )}

        {/* TAB: ACTIVE SESSIONS & SECURITY (Requirement 14) */}
        {activeTab === 'sessions' && (
          <ActiveSessionsTab />
        )}

        {/* TAB: PRINCIPAL APPROVAL MANAGEMENT (CORE REQUESTED SYSTEM) */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Principal Authorization Gateway</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Student Login & Portal Access Approvals
                  </h2>
                  <p className="text-xs text-slate-600 max-w-2xl">
                    Every student account requires manual Principal authorization before dashboard access is permitted. Real-time approval requests are automatically dispatched to the Principal's configured mobile number.
                  </p>
                </div>

                {/* Configured Principal Mobile Pill */}
                <div className="p-3.5 bg-white rounded-2xl border border-sky-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between space-x-3 text-xs">
                    <span className="font-bold text-slate-500 flex items-center space-x-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                      <span>Principal Mobile (Notifications):</span>
                    </span>
                    <button
                      onClick={() => setActiveTab('principal')}
                      className="text-sky-600 hover:text-sky-800 font-bold text-[11px] underline"
                    >
                      Configure
                    </button>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Gateway Routing</span>
                  </div>
                </div>
              </div>

              {/* Status summary counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setApprovalSubTab('pending')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    approvalSubTab === 'pending'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-amber-400 text-slate-700'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${approvalSubTab === 'pending' ? 'text-amber-100' : 'text-slate-400'}`}>
                    Pending Approval
                  </span>
                  <span className="text-2xl font-black block mt-0.5">{pendingStudents.length}</span>
                  <span className={`text-[10px] font-semibold ${approvalSubTab === 'pending' ? 'text-white' : 'text-amber-600'}`}>
                    Requires Review
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setApprovalSubTab('approved')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    approvalSubTab === 'approved'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-700'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${approvalSubTab === 'approved' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Approved / Active
                  </span>
                  <span className="text-2xl font-black block mt-0.5">{approvedStudents.length}</span>
                  <span className={`text-[10px] font-semibold ${approvalSubTab === 'approved' ? 'text-white' : 'text-emerald-600'}`}>
                    Full Portal Access
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setApprovalSubTab('rejected')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    approvalSubTab === 'rejected'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-rose-400 text-slate-700'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${approvalSubTab === 'rejected' ? 'text-rose-100' : 'text-slate-400'}`}>
                    Rejected Requests
                  </span>
                  <span className="text-2xl font-black block mt-0.5">{rejectedStudents.length}</span>
                  <span className={`text-[10px] font-semibold ${approvalSubTab === 'rejected' ? 'text-white' : 'text-rose-600'}`}>
                    Access Blocked
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setApprovalSubTab('notifications')}
                  className={`p-3 rounded-2xl border text-left transition ${
                    approvalSubTab === 'notifications'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-700'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${approvalSubTab === 'notifications' ? 'text-indigo-100' : 'text-slate-400'}`}>
                    Mobile Notifications Log
                  </span>
                  <span className="text-2xl font-black block mt-0.5">{db.notificationLogs?.length || 0}</span>
                  <span className={`text-[10px] font-semibold ${approvalSubTab === 'notifications' ? 'text-white' : 'text-indigo-600'}`}>
                    SMS / WhatsApp Audit
                  </span>
                </button>
              </div>
            </div>

            {/* Notification / Toast Banner */}
            {adminActionNotice && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 shadow-sm animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{adminActionNotice}</span>
              </div>
            )}

            {/* Sub-tab Navigation & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setApprovalSubTab('pending')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                    approvalSubTab === 'pending'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Pending Requests</span>
                  {pendingStudents.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[10px] font-black">
                      {pendingStudents.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalSubTab('approved')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    approvalSubTab === 'approved'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Approved ({approvedStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalSubTab('rejected')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    approvalSubTab === 'rejected'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Rejected ({rejectedStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalSubTab('all')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    approvalSubTab === 'all'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Requests ({db.students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalSubTab('notifications')}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap flex items-center space-x-1 ${
                    approvalSubTab === 'notifications'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SMS/Mobile Logs</span>
                </button>
              </div>

              {/* Search Bar */}
              {approvalSubTab !== 'notifications' && (
                <div className="relative sm:w-72">
                  <input
                    type="text"
                    value={approvalSearchQuery}
                    onChange={e => setApprovalSearchQuery(e.target.value)}
                    placeholder="Search by Name, Roll, Mobile..."
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500"
                  />
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              )}
            </div>

            {/* TAB CONTENT: REQUESTS LIST */}
            {approvalSubTab !== 'notifications' && (
              <div className="space-y-3.5">
                {filteredApprovalStudents.length === 0 ? (
                  <div className="glass-panel p-12 text-center rounded-3xl border border-dashed border-slate-300 space-y-2">
                    <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-700">No requests found</h4>
                    <p className="text-xs text-slate-400">
                      {approvalSubTab === 'pending'
                        ? 'There are currently no pending student approval requests. All registered students have been reviewed.'
                        : 'No student records match the selected filter or search term.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {filteredApprovalStudents.map(student => (
                      <div
                        key={student.id}
                        className={`glass-panel p-5 rounded-2xl border transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white ${
                          student.status === 'pending'
                            ? 'border-amber-200 hover:border-amber-400 bg-amber-50/20'
                            : student.status === 'approved'
                            ? 'border-slate-200 hover:border-emerald-300'
                            : 'border-rose-200 hover:border-rose-300 bg-rose-50/20'
                        }`}
                      >
                        {/* Student Details Left */}
                        <div className="flex items-start space-x-4">
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-black text-slate-900">{student.name}</h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  student.status === 'pending'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : student.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {student.status === 'pending'
                                  ? '⏳ Pending Approval'
                                  : student.status === 'approved'
                                  ? '✅ Approved / Active'
                                  : '❌ Rejected'}
                              </span>
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded">
                                Section {student.section}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-0.5 text-xs text-slate-500 font-medium">
                              <div>
                                <span className="text-slate-400 font-bold">Roll:</span> <strong className="text-slate-800 font-mono">{student.roll}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold">Class:</span> <span className="text-slate-800">{student.class}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold">Father:</span> <span className="text-slate-800">{student.father}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold">Mobile:</span> <span className="text-slate-800 font-mono font-bold">{student.mobile}</span>
                              </div>
                              <div className="truncate">
                                <span className="text-slate-400 font-bold">Email:</span> <span className="text-slate-800 font-mono">{student.email || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold">Card ID:</span> <span className="text-purple-700 font-mono font-bold">{student.cardId}</span>
                              </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>Requested: <strong>{student.requestedAt}</strong></span>
                              </span>
                              {student.approvedAt && (
                                <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                                  <Check className="w-3 h-3" />
                                  <span>Approved: <strong>{student.approvedAt}</strong></span>
                                </span>
                              )}
                              {student.rejectedAt && (
                                <span className="flex items-center space-x-1 text-rose-700 font-medium">
                                  <X className="w-3 h-3" />
                                  <span>Rejected: <strong>{student.rejectedAt}</strong></span>
                                </span>
                              )}
                            </div>

                            {student.rejectionReason && (
                              <p className="text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 mt-1">
                                Reason: {student.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons Right (Approve | Reject | View Details) */}
                        <div className="flex flex-wrap md:flex-col items-center sm:items-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                          {student.status === 'pending' && (
                            <div className="flex items-center space-x-2 w-full md:w-auto">
                              <button
                                type="button"
                                onClick={() => handleApproveStudent(student.id, student.name)}
                                className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition active:scale-95"
                                title="Approve Student Account"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve Access</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenRejectModal(student)}
                                className="flex-1 md:flex-initial px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition active:scale-95"
                                title="Reject Student Account"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}

                          {student.status === 'approved' && (
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleOpenRejectModal(student)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-xl text-[11px] font-bold border border-slate-200 transition"
                              >
                                Revoke Approval
                              </button>
                            </div>
                          )}

                          {student.status === 'rejected' && (
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleApproveStudent(student.id, student.name)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-bold border border-emerald-200 transition"
                              >
                                Re-Approve Access
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedStudentForDetails(student)}
                            className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold border border-sky-200 flex items-center space-x-1.5 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SMS / WHATSAPP DISPATCH LOG */}
            {approvalSubTab === 'notifications' && (
              <div className="glass-panel p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4 bg-white">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                      <Send className="w-4 h-4 text-indigo-600" />
                      <span>Principal Mobile Notifications Dispatch Audit Log</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time delivery verification for student registration notifications sent to Principal mobile: <strong className="text-slate-800">{db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543'}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold">
                    {db.notificationLogs?.length || 0} Total Messages
                  </span>
                </div>

                {(!db.notificationLogs || db.notificationLogs.length === 0) ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No notifications dispatched yet.</p>
                ) : (
                  <div className="space-y-3">
                    {db.notificationLogs.map(log => (
                      <div
                        key={log.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-900">
                              {log.channel}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                              Status: {log.status}
                            </span>
                            <span className="font-bold text-slate-700">To Principal Mobile: {log.principalMobile}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {log.message}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500">
                            Student ID: <strong>{log.studentId}</strong> • Name: <strong>{log.studentName}</strong> ({log.roll})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const std = db.students.find(s => s.id === log.studentId || s.approvalToken === log.actionToken);
                              if (std) setSelectedStudentForDetails(std);
                            }}
                            className="text-sky-600 hover:text-sky-800 font-bold text-xs underline flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Associated Student</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: CONTACT INFO & TIMINGS (THE SPECIFIC REQUESTED FEATURE!) */}
        {activeTab === 'contact' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-sky-100 shadow-sm max-w-3xl">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <Phone className="w-4 h-4" />
                <span>Admin Management</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Change Contact Details & Office Timings
              </h2>
              <p className="text-xs text-slate-500">
                Updates here immediately take effect on the main website top header, footer, and the Contact page.
              </p>
            </div>

            {contactSavedNotice && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 shadow-sm animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Contact information successfully updated and published to the website!</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  College Physical Address *
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    required
                    value={contactAddress}
                    onChange={e => setContactAddress(e.target.value)}
                    placeholder="Main Road Kotla Arab Ali Khan, District Gujrat, Punjab..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Primary Phone Number(s) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      placeholder="+92 300 1234567, +92 53 7580000"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    WhatsApp Helpline Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={contactWhatsapp}
                      onChange={e => setContactWhatsapp(e.target.value)}
                      placeholder="+92 301 7654321"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                    <MessageSquare className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Official College Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="kotla@kips.edu.pk"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Admissions Desk Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={contactAdmissionEmail}
                      onChange={e => setContactAdmissionEmail(e.target.value)}
                      placeholder="admissions.kotla@kips.edu.pk"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Office Timings (Weekdays & Fridays) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={contactHours}
                      onChange={e => setContactHours(e.target.value)}
                      placeholder="Mon – Sat: 7:45 AM – 3:30 PM (Friday: 7:45 AM – 12:30 PM)"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Emergency Helpline Number
                  </label>
                  <input
                    type="text"
                    value={contactEmergency}
                    onChange={e => setContactEmergency(e.target.value)}
                    placeholder="+92 53 7580000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Google Maps Location Link (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={contactMapUrl}
                    onChange={e => setContactMapUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/30 flex items-center space-x-2 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Update Public Contact Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: LOCATIONS MANAGEMENT (Requested Feature) */}
        {activeTab === 'locations' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-sky-100 shadow-sm max-w-4xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rose-500 animate-icon-blink" />
                  <span>Campus Locations & Map Directions</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, update, or remove physical campuses, blocks, and directions shown on the public site
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLocTitle('');
                  setLocAddress('');
                  setLocLandmark('');
                  setLocMapUrl('');
                  setLocPhone('');
                  setLocIsPrimary(false);
                  setShowAddLocationModal(true);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Campus Location</span>
              </button>
            </div>

            {/* Notification Banner */}
            {adminActionNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{adminActionNotice}</span>
              </div>
            )}

            {/* List of Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(db.locations || []).map(loc => (
                <div
                  key={loc.id}
                  className={`p-5 rounded-2xl border transition shadow-sm space-y-3.5 bg-white relative ${
                    loc.isPrimary ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-900 text-sm">{loc.title}</span>
                        {loc.isPrimary && (
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                            Primary Campus
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium flex items-start space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{loc.address}</span>
                      </p>
                    </div>
                  </div>

                  {loc.landmark && (
                    <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 text-[11px] text-sky-900">
                      <span className="font-bold">Landmark / Directions:</span> {loc.landmark}
                    </div>
                  )}

                  {loc.phone && (
                    <div className="text-xs text-slate-500 font-semibold flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{loc.phone}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEditLocation(loc)}
                        className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg border border-sky-200 transition"
                      >
                        Edit Location
                      </button>

                      {!loc.isPrimary && (
                        <button
                          type="button"
                          onClick={() => {
                            updateLocation(loc.id, { isPrimary: true });
                            setAdminActionNotice(`"${loc.title}" set as Primary Campus.`);
                            setTimeout(() => setAdminActionNotice(null), 3500);
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition"
                        >
                          Make Primary
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {loc.mapUrl && (
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition"
                          title="Open Google Maps link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(loc.id, loc.title)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!db.locations || db.locations.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                <p>No extra campus locations configured. Click "+ Add Campus Location" above.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Student & Admission Inquiries</h2>
                <p className="text-xs text-slate-500">
                  Queries submitted through the public college website inquiry form
                </p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                {db.inquiries?.length || 0} Total Received
              </span>
            </div>

            {(!db.inquiries || db.inquiries.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {db.inquiries.map(inq => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                        <span className="text-xs text-sky-600 font-semibold">• {inq.program}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inq.status === 'New'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inq.status === 'Replied'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-[11px] text-slate-400">{inq.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                      "{inq.message}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="flex items-center space-x-3">
                        <a
                          href={`tel:${inq.phone}`}
                          className="font-bold text-sky-600 hover:underline flex items-center space-x-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{inq.phone}</span>
                        </a>
                        {inq.email && (
                          <a
                            href={`mailto:${inq.email}`}
                            className="text-slate-600 hover:underline flex items-center space-x-1"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{inq.email}</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'Replied')}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                        >
                          Mark Replied
                        </button>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SECTIONS */}
        {activeTab === 'sections' && (
          <div className="glass-panel p-6 rounded-2xl space-y-5 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Academic Sections (CB1, CB2)</h2>
                <p className="text-xs text-slate-500">
                  Manage class section batches, assigned rooms, and in-charge faculty
                </p>
              </div>

              <button
                onClick={() => setShowAddSectionModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {db.sections.map(sec => {
                const count = db.students.filter(s => s.section === sec.name).length;
                return (
                  <div
                    key={sec.id}
                    className="p-5 rounded-2xl bg-white border border-sky-200 shadow-sm space-y-3 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-100 text-sky-800">
                          Section {sec.name}
                        </span>
                        <button
                          onClick={() => {
                            deleteSection(sec.id);
                            setAdminActionNotice(`Section ${sec.name} deleted.`);
                            setTimeout(() => setAdminActionNotice(null), 3500);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-black text-sm text-slate-900 mt-2">{sec.room}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        In-Charge: <strong className="text-slate-800">{sec.incharge}</strong>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Capacity: {sec.capacity}</span>
                      <span className="font-extrabold text-sky-600">
                        {count} Enrolled
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: STUDENTS DIRECTORY (VIEW ONLY - MANUAL CREATION REMOVED) */}
        {activeTab === 'students' && (
          <div className="glass-panel p-6 rounded-2xl space-y-5 border border-sky-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Student Directory (Cards & Approvals)</h2>
                <p className="text-xs text-slate-500">
                  Registered students directory. Direct student generation is removed — all students register through the portal and require Principal approval.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={studentSectionFilter}
                  onChange={e => setStudentSectionFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="All">All Sections</option>
                  {db.sections.map(s => (
                    <option key={s.id} value={s.name}>Section {s.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => { setActiveTab('approvals'); setApprovalSubTab('pending'); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Review Approvals ({pendingStudents.length} Pending)</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
              placeholder="Search by Name, Roll Number, Card ID, Mobile or Gmail..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
            />

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-sky-950 font-bold uppercase border-b border-sky-100">
                  <tr>
                    <th className="p-3">Student & DP</th>
                    <th className="p-3">Father</th>
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Gmail / Card ID</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Approval Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold bg-white">
                  {filteredStudents.map(std => (
                    <tr key={std.id} className="hover:bg-sky-50/40 transition">
                      <td className="p-3 flex items-center space-x-2.5">
                        <img
                          src={std.photo}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{std.name}</span>
                          <span className="text-[10px] text-slate-400">Class: {std.class}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{std.father}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{std.mobile || 'N/A'}</td>
                      <td className="p-3 font-mono text-slate-700">
                        <span className="block">{std.email}</span>
                        <span className="text-[10px] text-purple-700 font-bold">{std.cardId}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                          {std.section}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{std.roll}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            std.status === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : std.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {std.status === 'pending'
                            ? '⏳ Pending'
                            : std.status === 'approved'
                            ? '✅ Active'
                            : '❌ Rejected'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForDetails(std)}
                          className="text-sky-600 hover:text-sky-800 p-1"
                          title="View student dossier"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteStudent(std.id);
                            setAdminActionNotice(`Student "${std.name}" deleted.`);
                            setTimeout(() => setAdminActionNotice(null), 3500);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove student"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: TEACHERS & MATHS FACULTY */}
        {activeTab === 'teachers' && (
          <div className="glass-panel p-6 rounded-2xl space-y-5 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Faculty & Teachers (Maths & Sciences)</h2>
                <p className="text-xs text-slate-500">
                  Register teachers with DP, Subject/Standard, Login Gmail and Section in-charge roles
                </p>
              </div>

              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Register Teacher</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-50 text-sky-950 font-bold uppercase border-b border-sky-100">
                  <tr>
                    <th className="p-3">Teacher & DP</th>
                    <th className="p-3">Login Gmail</th>
                    <th className="p-3">Subject / Specialization</th>
                    <th className="p-3">In-Charge Section</th>
                    <th className="p-3">Qualification</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold bg-white">
                  {db.teachers.map(tea => (
                    <tr key={tea.id} className="hover:bg-sky-50/40 transition">
                      <td className="p-3 flex items-center space-x-2.5">
                        <img
                          src={tea.photo}
                          alt={tea.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{tea.name}</span>
                          <span className="text-[10px] text-slate-400">Pass: {tea.pass}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-700">{tea.email}</td>
                      <td className="p-3 font-bold text-sky-700">{tea.subject}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                          {tea.inchargeSection || 'None'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{tea.qualification || 'Specialist'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            deleteTeacher(tea.id);
                            setAdminActionNotice(`Teacher "${tea.name}" deleted.`);
                            setTimeout(() => setAdminActionNotice(null), 3500);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove teacher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: NOTICES WITH PICTURE */}
        {activeTab === 'notices' && (
          <div className="glass-panel p-6 rounded-2xl space-y-5 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Campus Announcements & Notices</h2>
                <p className="text-xs text-slate-500">
                  Publish notifications with custom photo banners and circulars
                </p>
              </div>

              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {db.announcements.map(ann => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    {ann.photo ? (
                      <img
                        src={ann.photo}
                        alt={ann.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <Bell className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-sky-100 text-sky-800">
                          {ann.priority}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">{ann.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{ann.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      deleteAnnouncement(ann.id);
                      setAdminActionNotice(`Announcement "${ann.title}" deleted.`);
                      setTimeout(() => setAdminActionNotice(null), 3500);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PRINCIPAL PROFILE */}
        {activeTab === 'principal' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-sky-100 shadow-sm max-w-2xl">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900">Principal Profile & Message</h2>
              <p className="text-xs text-slate-500">
                Update Principal details, qualifications, and official address to scholars
              </p>
            </div>

            {prSavedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Principal profile updated!</span>
              </div>
            )}

            <form onSubmit={handleSavePrincipal} className="space-y-4 text-xs font-medium">
              <div className="flex items-center space-x-4">
                <img
                  src={prPhotoUrl}
                  alt="Principal"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-300 shadow"
                />
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Upload New Principal DP Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handlePhotoUploadHelper(e, setPrPhotoUrl)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={prName}
                  onChange={e => setPrName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={prDesig}
                    onChange={e => setPrDesig(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={prQual}
                    onChange={e => setPrQual(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Office Phone</label>
                  <input
                    type="text"
                    value={prPhone}
                    onChange={e => setPrPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={prEmail}
                    onChange={e => setPrEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Principal Message</label>
                <textarea
                  rows={4}
                  required
                  value={prMsg}
                  onChange={e => setPrMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Principal Profile</span>
              </button>
            </form>

            {/* SECURE PRINCIPAL MOBILE NUMBER CONFIGURATION (REQUESTED FEATURE) */}
            <div className="glass-panel p-6 rounded-2xl space-y-4 border-2 border-emerald-300 bg-emerald-50/20 shadow-sm mt-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Approval Notification Routing</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Principal Mobile Number for Approval Notifications
              </h3>
              <p className="text-xs text-slate-600">
                Configure the Principal's mobile phone number for real-time notifications. When a student registers, their complete information is automatically dispatched to this number for authorization.
              </p>

              {prMobileNotice && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{prMobileNotice}</span>
                </div>
              )}

              {prMobileError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{prMobileError}</span>
                </div>
              )}

              <form onSubmit={handleSavePrincipalMobile} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Principal Mobile Number (Required) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={prApprovalMobileInput}
                      onChange={e => {
                        setPrApprovalMobileInput(e.target.value);
                        setPrMobileError(null);
                      }}
                      placeholder="+92 300 9876543 or 03001234567"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Format: Country code supported (e.g. +92 300 1234567). Must contain at least 10 digits. Not exposed publicly.
                  </p>
                </div>

                <div className="pt-1 flex items-center space-x-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Principal Mobile Number</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-semibold">🔒 Protected Admin Setting</span>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="glass-panel p-6 rounded-2xl space-y-5 border border-sky-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Campus Photo Gallery</h2>
                <p className="text-xs text-slate-500">
                  Manage college photos for Campus, Labs, Mathematics sessions & Events
                </p>
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            {/* Notification Banner */}
            {adminActionNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{adminActionNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {db.gallery.map(img => (
                <div
                  key={img.id}
                  className="glass-panel p-2.5 rounded-2xl relative group border border-slate-200 hover:border-sky-300 transition shadow-xs flex flex-col justify-between bg-white"
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl h-32 w-full bg-slate-100">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="h-full w-full object-cover img-zoom-focus"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteGalleryItem(img.id);
                          showAdminToast(`Photo "${img.title}" deleted successfully!`);
                        }}
                        title="Delete this photo"
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition hover:scale-110 active:scale-95 z-10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 px-1">
                      <h5 className="font-bold text-xs truncate text-slate-900" title={img.title}>
                        {img.title}
                      </h5>
                      <span className="text-[10px] text-sky-600 uppercase font-extrabold block">
                        {img.category}
                      </span>
                    </div>
                  </div>

                  {/* Explicit direct Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deleteGalleryItem(img.id);
                      showAdminToast(`Photo "${img.title}" deleted from college gallery.`);
                    }}
                    className="w-full mt-2.5 py-1.5 px-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-[11px] font-bold border border-red-200 hover:border-red-600 transition flex items-center justify-center space-x-1.5 shadow-2xs"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Photo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: BRANDING */}
        {activeTab === 'branding' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-sky-100 shadow-sm max-w-lg">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900">College Logo & Brand Title</h2>
              <p className="text-xs text-slate-500">
                Customize institution name and crest across the public website and printed ID cards
              </p>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-4 text-xs font-medium">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center overflow-hidden border-2 border-sky-300">
                  {brandLogoUrl ? (
                    <img src={brandLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Upload Logo Crest Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handlePhotoUploadHelper(e, setBrandLogoUrl)}
                    className="text-xs"
                  />
                  {brandLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setBrandLogoUrl('')}
                      className="text-red-500 text-[10px] hover:underline mt-1 block"
                    >
                      Remove Custom Logo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  College Title / Header Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandTitle}
                  onChange={e => setBrandTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB: SETTINGS / SECURITY */}
        {activeTab === 'settings' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-sky-100 shadow-sm max-w-md">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900">Change Admin Passcode</h2>
              <p className="text-xs text-slate-500">
                Update the master administrator credentials for Kotla portal
              </p>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Username *</label>
                <input
                  type="text"
                  required
                  value={newAdminUser}
                  onChange={e => setNewAdminUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">New Admin Password *</label>
                <input
                  type="password"
                  required
                  value={newAdminPass}
                  onChange={e => setNewAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Passcode</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-sky-100 shadow-sm max-w-md">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900">Portal Database Backup</h2>
              <p className="text-xs text-slate-500">
                Export all students, teachers, contact info, notes, and circulars to a JSON file
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={exportBackup}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Database Backup (JSON)</span>
              </button>

              <label className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs border border-slate-300 cursor-pointer flex items-center justify-center space-x-2 transition shadow-sm">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Restore Backup File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  resetDatabase();
                  setAdminActionNotice("Database reset to default master state.");
                  setTimeout(() => setAdminActionNotice(null), 3500);
                }}
                className="w-full py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-xs transition border border-red-200 mt-4"
              >
                Reset to Default Master State
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODALS SECTION                                           */}
        {/* ======================================================== */}

        {/* MODAL: ADD SECTION */}
        {showAddSectionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel bg-white/95 max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-black text-slate-900 text-sm">Create Academic Section</h3>
                <button onClick={() => setShowAddSectionModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSection} className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Section Name (e.g. CB3) *</label>
                  <input
                    type="text"
                    required
                    value={secName}
                    onChange={e => setSecName(e.target.value)}
                    placeholder="CB3"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Classroom *</label>
                  <input
                    type="text"
                    required
                    value={secRoom}
                    onChange={e => setSecRoom(e.target.value)}
                    placeholder="Room 103 (Main Science Wing)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Capacity</label>
                  <input
                    type="number"
                    value={secCapacity}
                    onChange={e => setSecCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow mt-2"
                >
                  Create Section
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: VIEW STUDENT DETAILS DOSSIER */}
        {selectedStudentForDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel bg-white max-w-lg w-full rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-slate-900 text-sm">Student Access Dossier & Verification</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDetails(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Header */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                <img
                  src={selectedStudentForDetails.photo}
                  alt={selectedStudentForDetails.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-base font-black text-slate-900 truncate">{selectedStudentForDetails.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">Father: {selectedStudentForDetails.father}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        selectedStudentForDetails.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : selectedStudentForDetails.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {selectedStudentForDetails.status === 'pending'
                        ? 'Pending Principal Approval'
                        : selectedStudentForDetails.status === 'approved'
                        ? 'Approved / Active'
                        : 'Access Rejected'}
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                      Section {selectedStudentForDetails.section}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Roll Number:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedStudentForDetails.roll}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Digital Card ID:</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">{selectedStudentForDetails.cardId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Academic Class:</span>
                  <span className="font-semibold text-slate-800">{selectedStudentForDetails.class}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Mobile:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedStudentForDetails.mobile}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Email:</span>
                  <span className="font-mono text-slate-800">{selectedStudentForDetails.email || 'None Provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Request Date & Time:</span>
                  <span className="text-slate-700 font-medium">{selectedStudentForDetails.requestedAt}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    {selectedStudentForDetails.approvedAt ? 'Approved Date & Time:' : selectedStudentForDetails.rejectedAt ? 'Rejected Date & Time:' : 'Review Status:'}
                  </span>
                  <span className="text-slate-700 font-medium">
                    {selectedStudentForDetails.approvedAt || selectedStudentForDetails.rejectedAt || 'Awaiting Principal Action'}
                  </span>
                </div>
              </div>

              {/* Principal Mobile Notification Dispatch Note */}
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 flex items-start space-x-2.5">
                <Smartphone className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[11px]">
                  <p className="font-bold">Principal Mobile Notification Dispatched:</p>
                  <p className="text-slate-600">
                    Target mobile: <code className="font-bold">{db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543'}</code>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDetails(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold"
                >
                  Close
                </button>

                {selectedStudentForDetails.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleApproveStudent(selectedStudentForDetails.id, selectedStudentForDetails.name)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Student Access</span>
                  </button>
                )}

                {selectedStudentForDetails.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenRejectModal(selectedStudentForDetails);
                      setSelectedStudentForDetails(null);
                    }}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Request</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REJECT STUDENT CONFIRMATION */}
        {studentToReject && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-rose-200">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2 text-rose-700">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="font-black text-slate-900 text-sm">Reject Student Access Request</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setStudentToReject(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 space-y-1">
                <p className="font-bold">You are rejecting access for:</p>
                <p>• <strong>{studentToReject.name}</strong> (Roll: {studentToReject.roll}, Section: {studentToReject.section})</p>
                <p>• Mobile: {studentToReject.mobile}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Rejection Reason (Message displayed to student upon login) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReasonInput}
                  onChange={e => setRejectionReasonInput(e.target.value)}
                  placeholder="Your account has not been approved by the Principal."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setStudentToReject(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center space-x-1.5 transition active:scale-95"
                >
                  <X className="w-4 h-4" />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD TEACHER (MATHS / SCIENCE) */}
        {showAddTeacherModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel bg-white/95 max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-black text-slate-900 text-sm">Register Faculty / Teacher</h3>
                <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    value={teaName}
                    onChange={e => setTeaName(e.target.value)}
                    placeholder="Prof. Muhammad Haris"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Gmail (Login) *</label>
                    <input
                      type="email"
                      required
                      value={teaEmail}
                      onChange={e => setTeaEmail(e.target.value)}
                      placeholder="teacher@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={teaPass}
                      onChange={e => setTeaPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Subject / Specialization *</label>
                    <input
                      type="text"
                      required
                      value={teaSubject}
                      onChange={e => setTeaSubject(e.target.value)}
                      placeholder="Mathematics / Calculus / CS"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">In-Charge of Section</label>
                    <select
                      value={teaIncharge}
                      onChange={e => setTeaIncharge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="None">None</option>
                      {db.sections.map(s => (
                        <option key={s.id} value={s.name}>Section {s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Qualifications</label>
                    <input
                      type="text"
                      value={teaQual}
                      onChange={e => setTeaQual(e.target.value)}
                      placeholder="M.Sc Mathematics / M.Phil"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Experience</label>
                    <input
                      type="text"
                      value={teaExp}
                      onChange={e => setTeaExp(e.target.value)}
                      placeholder="8+ Years Teaching"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Upload Teacher Photo (DP) from Device
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handlePhotoUploadHelper(e, setTeaPhotoUrl)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  {teaPhotoUrl && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img src={teaPhotoUrl} alt="Preview" className="w-10 h-10 rounded-xl object-cover border" />
                      <span className="text-[11px] text-emerald-600 font-bold">DP Loaded</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow mt-2"
                >
                  Save & Register Faculty Member
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD NOTICE WITH PICTURE */}
        {showAddNoticeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel bg-white/95 max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-black text-slate-900 text-sm">Publish Notice with Picture</h3>
                <button onClick={() => setShowAddNoticeModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Notice Headline *</label>
                  <input
                    type="text"
                    required
                    value={notTitle}
                    onChange={e => setNotTitle(e.target.value)}
                    placeholder="e.g. Mathematics Grand Mock Exam / Timetable"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={notPriority}
                    onChange={e => setNotPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Upload Banner / Circular Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handlePhotoUploadHelper(e, setNotPhotoUrl)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  {notPhotoUrl && (
                    <img src={notPhotoUrl} alt="Preview" className="h-20 rounded-xl mt-2 border object-cover" />
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Notice Details *</label>
                  <textarea
                    rows={3}
                    required
                    value={notDesc}
                    onChange={e => setNotDesc(e.target.value)}
                    placeholder="Type notice description here..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow mt-2"
                >
                  Publish Notice
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD GALLERY PHOTO */}
        {showAddGalleryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel bg-white/95 max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-black text-slate-900 text-sm">Add Photo to Gallery</h3>
                <button onClick={() => setShowAddGalleryModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGallery} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={galTitle}
                    onChange={e => setGalTitle(e.target.value)}
                    placeholder="Mathematics Seminar or Campus Ground"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={galCategory}
                    onChange={e => setGalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Campus">Campus</option>
                    <option value="Labs">Labs</option>
                    <option value="Maths">Maths & Seminars</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Photo File *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={e => handlePhotoUploadHelper(e, setGalPhotoUrl)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  {galPhotoUrl && (
                    <img src={galPhotoUrl} alt="Preview" className="h-20 rounded-xl mt-2 border object-cover" />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow mt-2"
                >
                  Upload to Gallery
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD LOCATION (Requested Feature) */}
        {showAddLocationModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel bg-white/95 max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rose-500 animate-icon-blink" />
                  <h3 className="font-black text-slate-900 text-sm">Add Campus Location & Address</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLocation} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location Title / Campus Name *</label>
                  <input
                    type="text"
                    required
                    value={locTitle}
                    onChange={e => setLocTitle(e.target.value)}
                    placeholder="e.g. Main Academic Campus & Administration"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Physical Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={locAddress}
                    onChange={e => setLocAddress(e.target.value)}
                    placeholder="e.g. KIPS College, Bhimber Road, Kotla Arab Ali Khan, Tehsil Kharian, Gujrat, Punjab"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Landmark or Directions Note</label>
                  <input
                    type="text"
                    value={locLandmark}
                    onChange={e => setLocLandmark(e.target.value)}
                    placeholder="e.g. Near Kotla Bus Stop, Opposite National Bank"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={locPhone}
                      onChange={e => setLocPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locIsPrimary}
                        onChange={e => setLocIsPrimary(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-700 text-xs">Primary Campus</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Google Maps Link or Embed URL</label>
                  <input
                    type="url"
                    value={locMapUrl}
                    onChange={e => setLocMapUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow transition"
                  >
                    Save & Add Campus Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT LOCATION (Requested Feature) */}
        {showEditLocationModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel bg-white/95 max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <h3 className="font-black text-slate-900 text-sm">Edit Campus Location</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEditLocationModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditLocation} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location Title / Campus Name *</label>
                  <input
                    type="text"
                    required
                    value={locTitle}
                    onChange={e => setLocTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Physical Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={locAddress}
                    onChange={e => setLocAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Landmark or Directions Note</label>
                  <input
                    type="text"
                    value={locLandmark}
                    onChange={e => setLocLandmark(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={locPhone}
                      onChange={e => setLocPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locIsPrimary}
                        onChange={e => setLocIsPrimary(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-700 text-xs">Primary Campus</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Google Maps Link</label>
                  <input
                    type="url"
                    value={locMapUrl}
                    onChange={e => setLocMapUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* REQUIREMENT 2 & 3: ALL AUTHORIZED ADMINS RECEIVE NOTIFICATIONS MODAL */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onViewApplication={() => {
          setActiveTab('applications');
        }}
      />
    </div>
  );
};
