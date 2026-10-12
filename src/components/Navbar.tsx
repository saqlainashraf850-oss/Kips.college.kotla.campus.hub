import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  GraduationCap,
  Phone,
  Mail,
  Menu,
  X,
  ArrowLeft,
  Sparkles,
  Search,
  Moon,
  Sun,
  BookOpen,
  MapPin,
  Calendar,
  FileCheck2,
  Users,
  Building2,
  Award,
  Image as ImageIcon,
  ShieldAlert,
  Send,
  UploadCloud,
  ChevronRight,
  Bell,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const {
    db,
    activeView,
    setActiveView,
    setActiveLoginRole,
    currentStudent,
    currentTeacher,
    activityNotifications,
    dismissActivityNotification,
    clearActivityNotifications,
    todayLoggedStudents,
    todayNotLoggedStudents,
    isActivityCenterOpen,
    setIsActivityCenterOpen
  } = usePortal();

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'login' | 'no_login' | 'viewed' | 'sensitive'>('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer or activity center is open
  useEffect(() => {
    if (menuDrawerOpen || isActivityCenterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuDrawerOpen, isActivityCenterOpen]);

  const handleOpenLogin = (role: 'student' | 'teacher' | 'admin') => {
    if (role === 'student' && currentStudent) {
      setActiveView('student');
    } else if (role === 'teacher' && currentTeacher) {
      setActiveView('teacher');
    } else {
      setActiveLoginRole(role);
      setActiveView('login');
    }
    setMenuDrawerOpen(false);
  };

  const filteredNotifications = activityNotifications.filter(n => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'login') return n.type === 'login';
    if (activityFilter === 'no_login') return n.type === 'no_login';
    if (activityFilter === 'viewed') return n.type === 'viewed_material' || n.type === 'unviewed_material';
    if (activityFilter === 'sensitive') return n.isSensitive || n.type === 'sensitive_action';
    return true;
  });

  const handleApplyNow = () => {
    setActiveView('public');
    setMenuDrawerOpen(false);
    const el = document.getElementById('admissions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveView('public');
    setMenuDrawerOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Urgent Alert & Contact Strip (Deep Sky Blue) */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-900 text-white text-xs py-2 px-4 shadow-sm border-b border-sky-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="bg-sky-500 uppercase font-black px-2 py-0.5 rounded text-[10px] tracking-wider animate-pulse whitespace-nowrap shadow-sm text-white">
              ADMISSIONS OPEN 2026-27
            </span>
            <span className="truncate font-semibold text-xs text-sky-100">
              KIPS College Kotla Arab Ali Khan Campus • Bhimber Road, Tehsil Kharian, Gujrat
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-5 text-[11px] text-sky-100 font-medium">
            <a href={`tel:${db.contact.phone.split(',')[0]}`} className="flex items-center space-x-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-cyan-300 animate-icon-blink" />
              <span>{db.contact.phone.split(',')[0]}</span>
            </a>
            <a href={`mailto:${db.contact.email}`} className="flex items-center space-x-1.5 hover:text-white transition">
              <Mail className="w-3.5 h-3.5 text-cyan-300" />
              <span>{db.contact.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Sky Blue and Glassmorphic Transparency */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-sky-200/80 shadow-md shadow-sky-500/5'
            : 'bg-white/85 backdrop-blur-md border-b border-sky-100/90 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LEFT SIDE: Menu Button on LEFT Side + Brand Logo & Name */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Menu Button on LEFT Side */}
              <button
                type="button"
                onClick={() => setMenuDrawerOpen(true)}
                className="flex items-center space-x-2 px-3 sm:px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/90 transition shadow-xs hover:shadow-md hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-sky-400"
                aria-label="Open Navigation Menu"
                title="Open Campus Menu with All Features"
              >
                <Menu className="w-5 h-5 text-sky-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-extrabold text-xs tracking-wide hidden sm:inline">Menu</span>
              </button>

              {/* Brand Logo & Name */}
              <button
                onClick={() => setActiveView('public')}
                className="flex items-center space-x-2.5 sm:space-x-3 text-left group"
              >
                <div
                  className={`rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-black shadow-md shadow-sky-500/25 overflow-hidden transition-all duration-300 ${
                    isScrolled ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-11 h-11 sm:w-12 sm:h-12 group-hover:scale-105'
                  }`}
                >
                  {db.branding.logoUrl ? (
                    <img
                      src={db.branding.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover img-zoom-focus"
                    />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none block">
                    {db.branding.title}
                  </span>
                  <p className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest mt-0.5">
                    Kotla Arab Ali Khan Campus
                  </p>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            {activeView === 'public' && (
              <div className="hidden xl:flex items-center space-x-5 text-[13px] font-semibold text-slate-700">
                <a href="#hero" className="hover:text-sky-600 transition">Home</a>
                <a href="#about" className="hover:text-sky-600 transition">About</a>
                <a href="#programs" className="hover:text-sky-600 transition">Programs</a>
                <a href="#admissions" className="hover:text-sky-600 transition">Admissions</a>
                <a href="#principal" className="hover:text-sky-600 transition">Principal</a>
                <a href="#faculty" className="hover:text-sky-600 transition">Faculty</a>
                <a href="#results-portal" className="hover:text-sky-600 transition">Results</a>
                <a href="#gallery" className="hover:text-sky-600 transition">Gallery</a>
                <a href="#location" className="hover:text-sky-600 transition">Location</a>
                <a href="#contact" className="hover:text-sky-600 transition">Contact</a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              {activeView !== 'public' ? (
                <button
                  onClick={() => setActiveView('public')}
                  className="px-4 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition flex items-center space-x-1.5 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Main Website</span>
                </button>
              ) : (
                <>
                  {/* Search Icon */}
                  {onOpenSearch && (
                    <button
                      onClick={onOpenSearch}
                      title="Search Programs, Faculty & Events"
                      className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}

                  {/* Dark Mode Icon Toggle */}
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    title="Toggle Theme"
                    className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition hidden sm:inline-flex"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                  </button>

                  {/* Student Portal Button */}
                  <button
                    onClick={() => handleOpenLogin('student')}
                    className="px-3 sm:px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50/80 hover:bg-sky-100 rounded-xl border border-sky-200 transition flex items-center space-x-1.5 shadow-xs"
                    title="Student Portal Login"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden xs:inline">Student Portal</span>
                  </button>

                  {/* Apply Now Button (Vibrant Sky Blue Gradient Button) */}
                  <button
                    onClick={handleApplyNow}
                    className="px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 rounded-xl shadow-md shadow-sky-600/25 transition flex items-center space-x-1.5 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-icon-blink-fast" />
                    <span>Apply Now</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* LEFT-SIDE SLIDE-OUT DRAWER WITH ALL FEATURES */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMenuDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          />

          {/* Drawer Container (Sliding from Left) */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-2xl z-10 flex flex-col border-r border-sky-200 overflow-y-auto no-scrollbar">
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-950 text-white flex items-center justify-between border-b border-sky-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black shadow-md overflow-hidden border border-sky-300/40">
                  {db.branding.logoUrl ? (
                    <img src={db.branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight leading-tight">{db.branding.title}</h3>
                  <p className="text-[10px] font-bold text-cyan-300">Kotla Arab Ali Khan Campus</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuDrawerOpen(false)}
                className="p-2 text-sky-200 hover:text-white hover:bg-white/10 rounded-xl transition"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Portals Access */}
            <div className="p-4 bg-sky-50/70 border-b border-sky-100 space-y-2">
              <p className="text-[10px] font-black uppercase text-sky-700 tracking-wider">
                Digital Portals & Access
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenLogin('student')}
                  className="p-2.5 rounded-xl bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50 transition text-center flex flex-col items-center justify-center shadow-xs group"
                >
                  <GraduationCap className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Student</span>
                  <span className="text-[9px] text-sky-600 font-semibold">Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenLogin('teacher')}
                  className="p-2.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition text-center flex flex-col items-center justify-center shadow-xs group"
                >
                  <UploadCloud className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Teacher</span>
                  <span className="text-[9px] text-indigo-600 font-semibold">Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenLogin('admin')}
                  className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition text-center flex flex-col items-center justify-center shadow-xs group"
                >
                  <ShieldAlert className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold leading-tight">Admin</span>
                  <span className="text-[9px] text-amber-300 font-semibold">Panel</span>
                </button>
              </div>
            </div>

            {/* Navigation Links with Icons and Blinking Badges */}
            <div className="flex-1 p-4 space-y-1 text-xs font-semibold text-slate-700">
              <p className="text-[10px] font-black uppercase text-slate-400 px-3 pt-2 pb-1 tracking-wider">
                Campus Exploration
              </p>

              <button
                type="button"
                onClick={() => handleNavigateSection('hero')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Home & Hero Showcase</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('about')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">About College & Vision</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('programs')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold block">Academic Programs</span>
                    <span className="text-[10px] text-slate-400 font-normal">FSc Pre-Med, Pre-Eng, ICS & I.Com</span>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-black">CB1 / CB2</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('admissions')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-sky-50/60 hover:bg-sky-100/80 hover:text-sky-800 transition group text-left border border-sky-100"
              >
                <div className="flex items-center space-x-3">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold block">Admissions 2026-27</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Merit Lists & Online Apply</span>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black animate-pulse">Open</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('principal')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Principal's Desk & Message</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('faculty')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold block">Mathematics & Faculty</span>
                    <span className="text-[10px] text-slate-400 font-normal">Senior subject specialists</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('results-portal')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Online Result Verification</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('gallery')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <ImageIcon className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Campus Photo Gallery</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black">{db.gallery.length}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('location')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-rose-500 animate-icon-blink group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold block">Campus Locations & Map</span>
                    <span className="text-[10px] text-slate-400 font-normal">Bhimber Road Kotla Arab Ali Khan</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('events')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Notices & Campus Events</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigateSection('contact')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition group text-left"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-emerald-600 animate-icon-blink group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Contact Office & Timings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Drawer Footer: Direct Contact Strip */}
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Office Timings:</span>
                <span className="font-bold text-sky-300">{db.contact.hours || '8:00 AM - 4:00 PM'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${db.contact.phone.split(',')[0]}`}
                  className="py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-center text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Campus</span>
                </a>

                <a
                  href={`https://wa.me/${db.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-center text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* DEPARTMENT NOTIFICATIONS & STUDENT ACTIVITY TRACKING MODAL */}
      {isActivityCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          {/* Backdrop */}
          <div
            onClick={() => setIsActivityCenterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] border border-sky-200 overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-900 via-sky-800 to-cyan-900 text-white flex items-center justify-between border-b border-sky-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/30 text-cyan-300 flex items-center justify-center border border-sky-300/30">
                  <Bell className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight flex items-center space-x-2">
                    <span>ڈیپارٹمنٹ نوٹیفیکیشنز & سٹوڈنٹ ٹریکنگ سینٹر</span>
                    <span className="text-[10px] bg-sky-500/40 text-sky-200 px-2 py-0.5 rounded-full font-bold">Live Portal</span>
                  </h3>
                  <p className="text-[11px] text-sky-200 font-medium">
                    طلبہ کے روزانہ لاگ ان، غیر حاضر طلبہ، تعلیمی مواد اور حساس ڈیپارٹمنٹ ایکٹیوٹی
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {activityNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearActivityNotifications}
                    className="p-1.5 sm:px-2.5 sm:py-1 bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    title="Clear All Notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsActivityCenterOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white transition"
                  aria-label="Close Activity Center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-sky-50/80 border-b border-sky-100 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs flex items-center space-x-2.5">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">آج لاگ ان کیا</span>
                  <strong className="text-emerald-700 text-sm font-black">{todayLoggedStudents.length} طلبہ</strong>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs flex items-center space-x-2.5">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">آج لاگ ان نہیں کیا</span>
                  <strong className="text-amber-700 text-sm font-black">{todayNotLoggedStudents.length} طلبہ</strong>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-xs flex items-center space-x-2.5">
                <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">حساس ڈیپارٹمنٹ الرٹس</span>
                  <strong className="text-rose-700 text-sm font-black">
                    {activityNotifications.filter(n => n.isSensitive).length} الرٹس
                  </strong>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-sky-200 shadow-xs flex items-center space-x-2.5">
                <div className="p-1.5 bg-sky-100 text-sky-800 rounded-lg">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">مواد ٹریکنگ</span>
                  <strong className="text-sky-700 text-sm font-black">
                    {activityNotifications.filter(n => n.type === 'viewed_material' || n.type === 'unviewed_material').length} ایونٹس
                  </strong>
                </div>
              </div>
            </div>

            {/* Filter Navigation Tabs */}
            <div className="flex items-center space-x-1 p-2 bg-slate-100/80 border-b border-slate-200 overflow-x-auto no-scrollbar text-xs font-bold">
              <button
                type="button"
                onClick={() => setActivityFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activityFilter === 'all'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>تمام نوٹیفیکیشنز</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-black">
                  {activityNotifications.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivityFilter('login')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activityFilter === 'login'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>آج لاگ ان کیا</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-black">
                  {todayLoggedStudents.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivityFilter('no_login')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activityFilter === 'no_login'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>لاگ ان نہیں کیا (غیر حاضر)</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-black">
                  {todayNotLoggedStudents.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivityFilter('viewed')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activityFilter === 'viewed'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>مواد دیکھا / نہیں دیکھا</span>
              </button>

              <button
                type="button"
                onClick={() => setActivityFilter('sensitive')}
                className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center space-x-1.5 ${
                  activityFilter === 'sensitive'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>حساس ڈیپارٹمنٹ الرٹس</span>
              </button>
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Special View: When "Not Logged In" filter is active, also display roster of students who haven't logged in today */}
              {activityFilter === 'no_login' && todayNotLoggedStudents.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center space-x-1.5">
                      <UserX className="w-4 h-4 text-amber-600" />
                      <span>ان طلبہ نے آج لاگ ان نہیں کیا (Currently Inactive Today):</span>
                    </span>
                    <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-black">
                      {todayNotLoggedStudents.length} طلبہ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {todayNotLoggedStudents.map(std => (
                      <div
                        key={std.id}
                        className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center space-x-3 text-xs shadow-2xs"
                      >
                        <img
                          src={std.photo}
                          alt={std.name}
                          className="w-10 h-10 rounded-xl object-cover border border-amber-200"
                        />
                        <div className="overflow-hidden flex-1 leading-tight">
                          <h5 className="font-extrabold text-slate-900 truncate">{std.name}</h5>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Roll: <strong>{std.roll}</strong> • Sec: {std.section}
                          </p>
                          <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                            {std.lastLoginDate ? `آخری لاگ ان: ${std.lastLoginDate}` : 'آج تک لاگ ان نہیں کیا'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special View: When "Logged In" filter is active, display students who logged in today */}
              {activityFilter === 'login' && todayLoggedStudents.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-300 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>ان طلبہ نے آج کامیابی سے پورٹل پر لاگ ان کیا ہے:</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full font-black">
                      {todayLoggedStudents.length} طلبہ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {todayLoggedStudents.map(std => (
                      <div
                        key={std.id}
                        className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-center space-x-3 text-xs shadow-2xs"
                      >
                        <img
                          src={std.photo}
                          alt={std.name}
                          className="w-10 h-10 rounded-xl object-cover border border-emerald-200"
                        />
                        <div className="overflow-hidden flex-1 leading-tight">
                          <h5 className="font-extrabold text-slate-900 truncate">{std.name}</h5>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Roll: <strong>{std.roll}</strong> • {std.class} ({std.section})
                          </p>
                          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            آج کا وقت: {std.lastLoginTime || '08:30 AM'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredNotifications.length === 0 ? (
                <div className="p-10 text-center space-y-2 text-slate-400">
                  <Bell className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">اس کیٹیگری میں فی الحال کوئی نوٹیفیکیشن موجود نہیں ہے۔</p>
                </div>
              ) : (
                filteredNotifications.map(item => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition space-y-1.5 relative group ${
                      item.isSensitive || item.severity === 'alert'
                        ? 'bg-rose-50/70 border-rose-300'
                        : item.severity === 'success' || item.type === 'login'
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : item.severity === 'warning' || item.type === 'no_login'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-white border-sky-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {item.isSensitive ? (
                          <span className="p-1 bg-rose-500 text-white rounded-lg">
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </span>
                        ) : item.type === 'login' ? (
                          <span className="p-1 bg-emerald-500 text-white rounded-lg">
                            <UserCheck className="w-3.5 h-3.5" />
                          </span>
                        ) : item.type === 'no_login' ? (
                          <span className="p-1 bg-amber-500 text-white rounded-lg">
                            <UserX className="w-3.5 h-3.5" />
                          </span>
                        ) : item.type === 'viewed_material' ? (
                          <span className="p-1 bg-sky-500 text-white rounded-lg">
                            <Eye className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="p-1 bg-indigo-500 text-white rounded-lg">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </span>
                        )}

                        <div>
                          <h4 className="font-black text-xs text-slate-900 leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {item.isSensitive && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-300">
                            حساس ڈیپارٹمنٹ تبدیلی
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => dismissActivityNotification(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition opacity-60 group-hover:opacity-100"
                          title="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium pl-6">
                      {item.description}
                    </p>

                    {item.studentRoll && (
                      <div className="pl-6 flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                        <span>Roll: <strong>{item.studentRoll}</strong></span>
                        {item.materialTitle && <span>مواد: <strong>{item.materialTitle}</strong></span>}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">
                KIPS College Kotla • Digital Department Security & Activity Tracking
              </span>
              <button
                type="button"
                onClick={() => setIsActivityCenterOpen(false)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
              >
                Close Center
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
