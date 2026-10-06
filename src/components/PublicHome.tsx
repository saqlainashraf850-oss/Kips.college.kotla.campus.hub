import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Quote,
  Phone,
  Mail,
  ArrowRight,
  BookOpen,
  Search,
  Monitor,
  Calculator,
  Stethoscope,
  Microscope,
  CheckCircle2,
  Calendar,
  X,
  Send,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Award,
  Users,
  Compass,
  GraduationCap,
  ShieldCheck,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Play,
  Download,
  CreditCard,
  Bell,
  Bus,
  UserCheck,
  Star,
  FileText,
  HelpCircle,
  ChevronDown,
  ArrowUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GalleryItem } from '../types';
import { Hero3DLogo } from './Hero3DLogo';
import { AnimatedCounter } from './AnimatedCounter';
import { TiltCard } from './TiltCard';

export const PublicHome: React.FC = () => {
  const { db, setActiveView, setActiveLoginRole, addInquiry } = usePortal();

  // Gallery filter & lightbox
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Result search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Faculty Filter & Search
  const [facultyFilter, setFacultyFilter] = useState<string>('All');
  const [facultySearch, setFacultySearch] = useState<string>('');

  // Notice Board Filter
  const [noticeFilter, setNoticeFilter] = useState<string>('All');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Inquiry Form
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryProgram, setInquiryProgram] = useState('FSc Pre-Engineering');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleResultSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setHasSearched(true);
    const found = db.students.find(
      s => s.roll.toLowerCase() === q ||
           s.cardId.toLowerCase() === q ||
           s.email.toLowerCase() === q ||
           s.name.toLowerCase().includes(q)
    );
    setSearchResult(found || null);

    if (found) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.7 }
        });
      } catch (err) {
        // Fallback
      }
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      alert("Please fill your Name and Phone Number.");
      return;
    }

    addInquiry({
      name: inquiryName.trim(),
      phone: inquiryPhone.trim(),
      email: inquiryEmail.trim(),
      program: inquiryProgram,
      message: inquiryMessage.trim() || "Inquiry regarding admissions and batch allocation."
    });

    setInquirySubmitted(true);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryEmail('');
    setInquiryMessage('');
    setTimeout(() => setInquirySubmitted(false), 6000);
  };

  const filteredGallery = galleryFilter === 'All'
    ? db.gallery
    : db.gallery.filter(item => item.category === galleryFilter);

  const galleryCategories = ['All', 'Campus', 'Labs', 'Events', 'Sports'];

  const handlePrevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
  };

  const handleNextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Access Items (Matches the Screenshot)
  const quickAccessItems = [
    { title: "Admissions", icon: Sparkles, action: () => scrollToSection('admissions'), color: "bg-sky-50 text-sky-600" },
    { title: "Programs", icon: BookOpen, action: () => scrollToSection('programs'), color: "bg-cyan-50 text-cyan-600" },
    { title: "Results", icon: Award, action: () => scrollToSection('results-portal'), color: "bg-purple-50 text-purple-600" },
    { title: "Notice Board", icon: Bell, action: () => scrollToSection('notices'), color: "bg-amber-50 text-amber-600" },
    { title: "Fee Information", icon: CreditCard, action: () => scrollToSection('admissions'), color: "bg-emerald-50 text-emerald-600" },
    { title: "Contact", icon: Phone, action: () => scrollToSection('contact'), color: "bg-blue-50 text-blue-600" },
    { title: "Transport", icon: Bus, action: () => scrollToSection('transport'), color: "bg-indigo-50 text-indigo-600" },
    { title: "Student Portal", icon: GraduationCap, action: () => { setActiveLoginRole('student'); setActiveView('login'); }, color: "bg-sky-50 text-sky-700" }
  ];

  // Programs Data
  const programsList = [
    {
      title: "FSc Pre-Medical",
      duration: "Duration: 2 Years",
      eligibility: "Eligibility: Matric (Science)",
      subjects: "Subjects: Biology, Chemistry, Physics, English, Urdu",
      badge: "Medical Batch",
      color: "border-sky-400"
    },
    {
      title: "FSc Pre-Engineering",
      duration: "Duration: 2 Years",
      eligibility: "Eligibility: Matric (Science)",
      subjects: "Subjects: Mathematics, Physics, Chemistry, English, Urdu",
      badge: "Engineering (CB1)",
      color: "border-cyan-400"
    },
    {
      title: "ICS",
      duration: "Duration: 2 Years",
      eligibility: "Eligibility: Matric",
      subjects: "Subjects: Computer, Mathematics, Physics, English, Urdu",
      badge: "Computer Science",
      color: "border-blue-400"
    },
    {
      title: "ICOM",
      duration: "Duration: 2 Years",
      eligibility: "Eligibility: Matric",
      subjects: "Subjects: Commerce, Mathematics, Accounting, English, Urdu",
      badge: "Commerce Stream",
      color: "border-indigo-400"
    }
  ];

  // Filtered Faculty
  const filteredFaculty = db.teachers.filter(teacher => {
    const matchesFilter = facultyFilter === 'All' ||
      (facultyFilter === 'Science' && (teacher.subject.toLowerCase().includes('math') || teacher.subject.toLowerCase().includes('physic') || teacher.subject.toLowerCase().includes('chem') || teacher.subject.toLowerCase().includes('bio'))) ||
      (facultyFilter === 'Computer' && teacher.subject.toLowerCase().includes('comput')) ||
      (facultyFilter === 'Commerce' && (teacher.subject.toLowerCase().includes('comm') || teacher.subject.toLowerCase().includes('stat'))) ||
      (facultyFilter === 'Languages' && (teacher.subject.toLowerCase().includes('eng') || teacher.subject.toLowerCase().includes('urdu')));

    const matchesSearch = !facultySearch.trim() ||
      teacher.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(facultySearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Filtered Notices
  const filteredNotices = db.announcements.filter(n => {
    if (noticeFilter === 'All') return true;
    return n.priority.toLowerCase() === noticeFilter.toLowerCase();
  });

  return (
    <div className="space-y-20 pb-20 relative overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (LUMINOUS SKY BLUE WITH CAMPUS VISUAL)   */}
      {/* ======================================================== */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white min-h-[580px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 border border-sky-300/40">
          
          {/* Subtle Ambient Shapes & Light Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Main Hero Grid */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, Slogan & 4 Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Admissions Open Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/20 text-white text-xs font-black px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span className="tracking-wider uppercase">ADMISSIONS OPEN 2026-27</span>
              </div>

              {/* Title (Matches Screenshot) */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
                  KIPS COLLEGE KOTLA
                </h1>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-100 tracking-tight">
                  Arab Ali Khan Campus
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-cyan-100/90 pt-1 tracking-wider uppercase">
                  Excellence in Education | Character Building | Bright Future
                </p>
              </div>

              <p className="text-sky-50 text-sm leading-relaxed max-w-xl font-normal">
                KIPS College Kotla Arab Ali Khan is dedicated to equipping scholars with conceptual education, comprehensive Mathematics & Science coaching, and modern computer laboratories on Bhimber Road.
              </p>

              {/* 4 Action Buttons (Matches Screenshot!) */}
              <div className="flex flex-wrap gap-3 pt-2">
                {/* 1. Apply Now */}
                <button
                  onClick={() => scrollToSection('admissions')}
                  className="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm bg-white text-sky-700 hover:bg-sky-50 shadow-lg shadow-sky-900/20 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 2. Explore Campus */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Explore Campus</span>
                </button>

                {/* 3. Contact Us */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Us</span>
                </button>

                {/* 4. Download Prospectus */}
                <a
                  href="#admissions"
                  onClick={() => alert("Official College Prospectus 2026-27 is downloading...")}
                  className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Prospectus</span>
                </a>
              </div>

            </div>

            {/* Right Column: Campus Photo with "Build Your Future With Us" + 3D Logo */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 group light-sweep">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
                  alt="KIPS College Building"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-700"
                />

                {/* Script Accent Badge (Matches Screenshot!) */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-amber-300 font-serif italic text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-300/40 shadow-xl">
                  Build Your Future With Us
                </div>

                {/* Building Signage Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 flex items-center justify-between text-white">
                  <div>
                    <h4 className="font-black text-sm text-white uppercase tracking-wider">KIPS COLLEGE KOTLA</h4>
                    <p className="text-[10px] text-cyan-200">Main Campus Complex • Bhimber Road</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase bg-sky-500 text-white shadow-sm">
                    Est. 2000
                  </span>
                </div>
              </div>

              {/* 3D Rotating Crest Below */}
              <div className="mt-4 transform scale-90">
                <Hero3DLogo campusName={db.branding.title} customLogoUrl={db.branding.logoUrl} />
              </div>

            </div>

          </div>

          {/* Bottom Center: Scroll to Explore Indicator */}
          <div className="relative z-10 pt-6 flex justify-center items-center">
            <button
              onClick={() => scrollToSection('quick-access')}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-white/90 hover:text-white transition animate-bounce bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Scroll to Explore</span>
            </button>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. QUICK ACCESS BAR (8 CLEAN CARDS IN A ROW)             */}
      {/* ======================================================== */}
      <section id="quick-access" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-4">
          <h3 className="text-lg font-black text-slate-900">Quick Access</h3>
          <p className="text-xs text-slate-500">Find what you need, quickly</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {quickAccessItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 hover:border-sky-300 hover:shadow-lg transition text-center space-y-2 group flex flex-col items-center justify-between"
              >
                <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-800 group-hover:text-sky-600 transition block">
                  {item.title}
                </span>
                <span className="text-[10px] text-sky-500 font-bold opacity-0 group-hover:opacity-100 transition">
                  →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ABOUT KIPS COLLEGE & ACHIEVEMENTS (SIDE-BY-SIDE)      */}
      {/* ======================================================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: About Our College */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-5 text-left">
            <div>
              <span className="text-xs font-black uppercase text-sky-600 tracking-wider">About Our College</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">About KIPS College</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              KIPS College Kotla Arab Ali Khan is committed to providing quality education, character building and creating bright futures for our students. We offer a supportive environment with modern facilities and experienced faculty.
            </p>

            {/* 3 Micro Pillars: Mission, Vision, Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="font-black text-sky-700 block">Our Mission</span>
                <p className="text-[11px] text-slate-600">To provide quality education and build strong character.</p>
              </div>
              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="font-black text-sky-700 block">Our Vision</span>
                <p className="text-[11px] text-slate-600">To be a leading educational institution in the region.</p>
              </div>
              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1">
                <span className="font-black text-sky-700 block">Our Values</span>
                <p className="text-[11px] text-slate-600">Integrity, Excellence, Respect, Innovation.</p>
              </div>
            </div>

            {/* Video Card: Our Campus Life (Matches Screenshot!) */}
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="relative rounded-2xl overflow-hidden h-40 bg-slate-900 cursor-pointer group shadow-md"
            >
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Students studying"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs font-bold">Our Campus Life</p>
                <p className="text-[10px] text-sky-200">Watch Video Tour</p>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('programs')}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center space-x-1.5"
            >
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Achievements & Excellence with 6 Stats */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-5 text-left">
            <div>
              <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Our Impact</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Achievements & Excellence</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {/* 1. Students */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-1">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  <AnimatedCounter end={1250} suffix="+" />
                </h3>
                <p className="text-[11px] font-bold text-slate-500">Students</p>
              </div>

              {/* 2. Faculty */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  <AnimatedCounter end={80} suffix="+" />
                </h3>
                <p className="text-[11px] font-bold text-slate-500">Faculty</p>
              </div>

              {/* 3. Board Distinctions */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  <AnimatedCounter end={12} suffix="" />
                </h3>
                <p className="text-[11px] font-bold text-slate-500">Board Distinctions</p>
              </div>

              {/* 4. Academic Batches */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-1">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  <AnimatedCounter end={15} suffix="+" />
                </h3>
                <p className="text-[11px] font-bold text-slate-500">Academic Batches</p>
              </div>

              {/* 5. Scholarships */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  <AnimatedCounter end={50} suffix="+" />
                </h3>
                <p className="text-[11px] font-bold text-slate-500">Scholarships</p>
              </div>

              {/* 6. Years of Excellence */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  <AnimatedCounter end={25} suffix="+" />
                </h3>
                <p className="text-[11px] font-bold text-slate-500">Years of Excellence</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. OUR PROGRAMS (4 COMPLETE STREAMS WITH APPLY BUTTON)   */}
      {/* ======================================================== */}
      <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 text-left">
          <div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Academic Programs</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Our Programs</h2>
            <p className="text-xs text-slate-500">Choose from a range of comprehensive programs designed for your success.</p>
          </div>
          <button
            onClick={() => scrollToSection('admissions')}
            className="px-4 py-2 bg-white border border-sky-200 text-sky-700 rounded-xl font-bold text-xs shadow-sm hover:bg-sky-50 transition"
          >
            View All Programs
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {programsList.map((prog, i) => (
            <TiltCard
              key={i}
              className={`p-6 rounded-3xl bg-white/95 backdrop-blur-md border-t-4 ${prog.color} shadow-sm border border-slate-100 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-sky-50 text-sky-700">
                  {prog.badge}
                </span>
                <h3 className="font-black text-lg text-slate-900">{prog.title}</h3>
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700">{prog.duration}</p>
                  <p>{prog.eligibility}</p>
                  <p className="pt-1 text-[11px] text-slate-600 line-clamp-2">{prog.subjects}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => scrollToSection('admissions')}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Apply Now
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. ADMISSIONS & ADMISSION INQUIRY (MATCHES SCREENSHOT)   */}
      {/* ======================================================== */}
      <section id="admissions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left: Admissions Information Checklist */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Join Our College</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Admissions</h2>
              <p className="text-xs text-slate-500">Start your journey towards a brighter future</p>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Online Application Submissions</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Admission Process & Merit Verification</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Eligibility Criteria (Matric 60%+)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Required Documents (Matric Card & Photos)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Important Dates & Batch Schedule</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Scholarships for High Achievers (75%+)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => alert("Please fill the Admission Inquiry form on the right to start!")}
                className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Apply Online
              </button>
              <button
                onClick={() => alert("Downloading KIPS College Prospectus PDF...")}
                className="px-5 py-3 bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 rounded-xl text-xs font-bold shadow-sm"
              >
                Download Prospectus
              </button>
            </div>
          </div>

          {/* Right: Admission Inquiry Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-md space-y-4">
            <div>
              <h3 className="font-black text-lg text-slate-900">Admission Inquiry</h3>
              <p className="text-xs text-slate-500">Fill this form to receive syllabus, fee details & counseling.</p>
            </div>

            {inquirySubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Application submitted successfully! Our campus coordinator will call you.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={e => setInquiryEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={e => setInquiryPhone(e.target.value)}
                      placeholder="Enter your phone"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Program</label>
                  <select
                    value={inquiryProgram}
                    onChange={e => setInquiryProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                    <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                    <option value="ICS">ICS</option>
                    <option value="ICOM">ICOM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Questions / Message</label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    placeholder="Ask about admission criteria or scholarships..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow text-xs transition"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. MEET OUR FACULTY (FILTER PILLS & TEACHER CARDS)       */}
      {/* ======================================================== */}
      <section id="faculty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Our Faculty</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Meet Our Faculty</h2>
            <p className="text-xs text-slate-500">Learn from experienced and dedicated professionals.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={facultySearch}
              onChange={e => setFacultySearch(e.target.value)}
              placeholder="Search faculty..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter Pills (Matches Screenshot) */}
        <div className="flex items-center space-x-2 text-xs font-bold overflow-x-auto pb-2 mb-6">
          {['All', 'Science', 'Commerce', 'Computer', 'Languages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFacultyFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full transition ${
                facultyFilter === cat
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((t) => (
            <TiltCard
              key={t.id}
              className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-sky-200 shadow-sm bg-slate-100 group-hover:border-sky-400 transition">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover img-zoom-focus group-hover:scale-110 transition duration-500" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="font-black text-sm text-slate-900">{t.name}</h4>
                  <p className="text-xs font-bold text-sky-600">{t.subject}</p>
                  <p className="text-[11px] text-slate-500">{t.qualification || 'Senior Subject Specialist'}</p>
                  <p className="text-[10px] text-slate-400">{t.experience || '8+ Years Teaching'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => alert(`Faculty Contact: ${t.name}\nEmail: ${t.email}\nSubject: ${t.subject}\nSection In-charge: ${t.inchargeSection || 'None'}`)}
                  className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs transition"
                >
                  View Profile
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. NOTICE BOARD / LATEST UPDATES (MATCHES SCREENSHOT)    */}
      {/* ======================================================== */}
      <section id="notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Latest Updates</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Notice Board</h2>
            <p className="text-xs text-slate-500">Stay informed with the latest announcements.</p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold">
            {['All', 'Important', 'Academic', 'Events', 'General'].map(tab => (
              <button
                key={tab}
                onClick={() => setNoticeFilter(tab)}
                className={`px-3 py-1.5 rounded-full transition ${
                  noticeFilter === tab
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNotices.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {n.photo && (
                  <div className="h-40 rounded-2xl overflow-hidden bg-slate-100 border">
                    <img src={n.photo} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                    n.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-700'
                  }`}>
                    {n.priority}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">{n.date}</span>
                </div>
                <h4 className="font-black text-sm text-slate-900 leading-snug">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{n.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-600 font-bold">
                <span>Official Bulletin</span>
                <span>Read Circular →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. EXPLORE OUR CAMPUS LIFE / GALLERY (WITH LIGHTBOX)     */}
      {/* ======================================================== */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-black uppercase text-sky-600 tracking-wider">Our Gallery</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Explore Our Campus Life</h2>
            <p className="text-xs text-slate-500">Glimpses of daily life, laboratories, and events at KIPS College Kotla.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 text-xs font-bold overflow-x-auto pb-1">
            {galleryCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full transition ${
                  galleryFilter === cat
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredGallery.map((img, idx) => (
            <div
              key={img.id}
              tabIndex={0}
              role="button"
              aria-label={`View ${img.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxIndex(idx);
                }
              }}
              onClick={() => setLightboxIndex(idx)}
              className="h-48 rounded-2xl overflow-hidden relative group cursor-pointer border border-sky-100 shadow-sm light-sweep focus:outline-none focus:ring-4 focus:ring-sky-400 focus:scale-[1.03] transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover img-zoom-focus group-hover:scale-110 group-focus:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3.5 flex flex-col justify-end text-white">
                <span className="text-[9px] font-black uppercase text-sky-300">{img.category}</span>
                <h5 className="font-bold text-xs truncate">{img.title}</h5>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal (Matches Screenshot Modal Exactly!) */}
        {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-sky-400/20">
              
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Arrows */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextLightbox}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="h-[65vh] w-full bg-black flex items-center justify-center">
                <img
                  src={filteredGallery[lightboxIndex].url}
                  alt={filteredGallery[lightboxIndex].title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Details & Index Counter */}
              <div className="p-5 flex items-center justify-between border-t border-white/10 bg-slate-950">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500 text-white uppercase">
                    {filteredGallery[lightboxIndex].category}
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1">
                    {filteredGallery[lightboxIndex].title}
                  </h4>
                  {filteredGallery[lightboxIndex].description && (
                    <p className="text-xs text-slate-400 mt-0.5">{filteredGallery[lightboxIndex].description}</p>
                  )}
                </div>

                <div className="text-xs font-mono text-sky-300 font-bold">
                  {lightboxIndex + 1} / {filteredGallery.length}
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 9A. CAMPUS LOCATIONS & INTERACTIVE MAP (Requested)       */}
      {/* ======================================================== */}
      <section id="location" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center space-x-1.5 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-rose-500 animate-icon-blink" />
            <span>Campus Location & Directions</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Visit KIPS College Kotla Arab Ali Khan Campus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Conveniently situated on Bhimber Road, connecting Tehsil Kharian and District Gujrat with state-of-the-art facilities.
          </p>
        </div>

        {/* Locations Grid & Interactive Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Campus Location Cards */}
          <div className="lg:col-span-5 space-y-4">
            {(db.locations && db.locations.length > 0 ? db.locations : [
              {
                id: 'loc-default',
                title: 'Main Academic Campus & Admin Block',
                address: db.contact.address,
                landmark: 'Near Kotla Bus Stand, Main Bhimber Road',
                mapUrl: db.contact.locationMapUrl || 'https://maps.google.com/?q=KIPS+College+Kotla+Arab+Ali+Khan+Bhimber+Road',
                phone: db.contact.phone,
                isPrimary: true
              }
            ]).map((loc, idx) => (
              <div
                key={loc.id || idx}
                className={`p-6 rounded-3xl transition shadow-sm space-y-3 bg-white/95 backdrop-blur-md border ${
                  loc.isPrimary ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="relative flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                        <MapPin className="w-4 h-4 animate-icon-blink" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-rose-400 animate-map-ripple pointer-events-none" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-tight">{loc.title}</h4>
                      {loc.isPrimary && (
                        <span className="text-[10px] text-sky-600 font-extrabold uppercase">Primary Campus</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {loc.address}
                </p>

                {loc.landmark && (
                  <div className="p-2.5 bg-sky-50/80 rounded-xl text-[11px] text-sky-900 border border-sky-100 font-medium">
                    <span className="font-bold text-sky-950">Landmark:</span> {loc.landmark}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="font-bold text-slate-700">{loc.phone || db.contact.phone.split(',')[0]}</span>
                  <a
                    href={loc.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center space-x-1.5 transition text-xs shadow-xs"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Visual Interactive Map Simulation & Pin */}
          <div className="lg:col-span-7 h-full">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-200 shadow-lg space-y-5 relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-950 text-white">
              {/* Map Pin Visual Showcase with Ripples */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-sky-400/20 pb-4">
                <div className="flex items-center space-x-3.5">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/50">
                      <MapPin className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-rose-400 animate-map-ripple pointer-events-none" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white">Bhimber Road, Kotla Arab Ali Khan</h3>
                    <p className="text-xs text-sky-200">Tehsil Kharian, District Gujrat, Punjab, Pakistan</p>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(db.contact.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white text-sky-900 hover:bg-sky-50 rounded-xl text-xs font-bold shadow transition flex items-center space-x-1.5"
                >
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

              {/* Map Preview Graphic */}
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden relative border border-sky-400/30 bg-slate-900 shadow-inner flex items-center justify-center group">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                  alt="Kotla Map"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-sky-950/40 to-transparent" />

                {/* Animated Map Pin in Center */}
                <div className="absolute z-10 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white animate-pulse">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div className="absolute -inset-3 rounded-full bg-rose-500/50 animate-map-ripple pointer-events-none" />
                    <div className="absolute -inset-6 rounded-full bg-rose-400/30 animate-map-ripple pointer-events-none" style={{ animationDelay: '0.6s' }} />
                  </div>
                  <div className="mt-2 px-3 py-1 bg-white/95 text-slate-900 rounded-full font-black text-xs shadow-lg tracking-tight">
                    KIPS College Kotla Campus
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 text-[11px] text-sky-200 bg-slate-950/80 px-3 py-1 rounded-lg backdrop-blur-xs">
                  Bhimber Road • Opposite National Bank • Kotla
                </div>
              </div>

              {/* Campus Access Information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="text-sky-300 font-bold block text-[10px] uppercase">Campus Proximity</span>
                  <span className="font-extrabold text-white text-xs mt-0.5 block">2 Min from Kotla Chowk</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="text-sky-300 font-bold block text-[10px] uppercase">College Transport</span>
                  <span className="font-extrabold text-white text-xs mt-0.5 block">Covers All Nearby Towns</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-sky-300 font-bold block text-[10px] uppercase">Visiting Hours</span>
                  <span className="font-extrabold text-white text-xs mt-0.5 block">{db.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9B. TESTIMONIALS, FAQ, CONTACT & TRANSPORT SERVICES      */}
      {/* ======================================================== */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Testimonials & Quick FAQ */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Testimonials Card (Matches Screenshot!) */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Student & Parent Voices</span>
              <h3 className="font-black text-lg text-slate-900">Testimonials</h3>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "KIPS College provides a great learning environment with supportive teachers and modern facilities. The mathematics sessions helped me score high marks in entry test."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  AK
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Ahmed Khan</h5>
                  <p className="text-[10px] text-slate-400">FSc Pre-Engineering (Batch CB1)</p>
                </div>
              </div>
            </div>

            {/* Quick Answers / FAQ Accordion */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Got Questions?</span>
              <h3 className="font-black text-lg text-slate-900">Quick Answers</h3>

              <div className="space-y-2 text-xs">
                {[
                  { q: "What programs are offered?", a: "We offer FSc Pre-Medical, FSc Pre-Engineering, ICS (Computer Science), and ICOM (Commerce)." },
                  { q: "How can I apply?", a: "You can apply online via our Admission Inquiry form or visit the college office on Bhimber Road." },
                  { q: "What documents are required?", a: "Matriculation result card, provisional certificate, CNIC/B-form copy, and 4 passport-size photographs." },
                  { q: "Are scholarships available?", a: "Yes, merit-based scholarships up to 100% fee concession are awarded to top matriculation scorers." },
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-3 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-800 text-left"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 transition ${openFaq === idx ? 'rotate-180 text-sky-600' : 'text-slate-400'}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="p-3 bg-white text-slate-600 text-xs leading-relaxed border-t border-slate-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Contact Information & Transport Services */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Contact Information Card */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
              <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Get in Touch</span>
              <h3 className="font-black text-lg text-slate-900">Contact Information</h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <p className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span className="font-bold text-slate-800">{db.contact.phone}</span>
                </p>
                <p className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>{db.contact.email}</span>
                </p>
                <p className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <span>{db.contact.address}</span>
                </p>
                <p className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>{db.contact.hours}</span>
                </p>
              </div>
            </div>

            {/* Transport Services Card (Matches Screenshot!) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider">Safe & Reliable Transport</span>
                  <h3 className="font-black text-lg text-slate-900 mt-0.5">Transport Services</h3>
                </div>
                <div className="p-2.5 bg-white text-sky-600 rounded-2xl shadow-sm">
                  <Bus className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white/80 rounded-xl border border-sky-100">
                  <p className="font-bold text-sky-900">Available Routes:</p>
                  <p className="text-[11px] text-slate-600">Kotla, Gujrat, Kharian, Sarai Alamgir, Bhimber AJK, Jalalpur Jattan</p>
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-sky-100">
                  <p className="font-bold text-sky-900">Pickup / Drop Timings:</p>
                  <p className="text-[11px] text-slate-600">Morning 7:15 AM - 8:00 AM | Afternoon 1:30 PM - 2:15 PM</p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Transport Contact: {db.contact.emergencyHelpline}</span>
                <button
                  onClick={() => alert(`Transport Officer Contact: ${db.contact.emergencyHelpline}\nDedicated vans cover all nearby towns with verified drivers.`)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Details
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. RESULT VERIFICATION & CARD RECORDS                   */}
      {/* ======================================================== */}
      <section id="results-portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto text-center space-y-5 border border-sky-200 shadow-xl">
          <span className="px-3.5 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Online Examination & Card Records
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Student Result & Enrollment Verification
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Enter Roll Number (e.g. 001), Student Card ID (e.g. KIPS-CB1-00125) or Registered Gmail to view current session standings.
          </p>

          <form onSubmit={handleResultSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g. 001, KIPS-CB1-00125 or student@gmail.com"
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow flex items-center justify-center space-x-2 transition"
            >
              <Search className="w-4 h-4" />
              <span>Verify Records</span>
            </button>
          </form>

          {/* Result Card Preview */}
          {hasSearched && (
            <div className="mt-4 text-left">
              {searchResult ? (
                <div className="p-6 rounded-2xl bg-white border border-sky-200 shadow-md space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={searchResult.photo}
                        alt={searchResult.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <h4 className="font-black text-base text-slate-900">{searchResult.name}</h4>
                        <p className="text-xs text-slate-500">Father: {searchResult.father} • Roll No: {searchResult.roll}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Scholar</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Assigned Section</p>
                      <p className="font-extrabold text-sky-700 text-sm mt-0.5">{searchResult.section}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Student Card ID</p>
                      <p className="font-extrabold text-slate-800 text-xs font-mono mt-0.5">{searchResult.cardId}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Attendance Ratio</p>
                      <p className="font-extrabold text-emerald-600 text-sm mt-0.5">{searchResult.attendance}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">Academic Standing</p>
                      <p className="font-extrabold text-purple-700 text-xs mt-0.5">{searchResult.grade || "Grade A (Merit)"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  No registered student found for "{searchQuery}". Please verify the roll number, card ID, or registered email.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. FLOATING ACTION BUTTONS (WHATSAPP, CALL & SCROLL TOP) */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2.5">
        {/* WhatsApp Button (Matches Screenshot!) */}
        <a
          href={`https://wa.me/${db.contact.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          title="WhatsApp Campus Helpdesk"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl transition transform hover:scale-110 animate-pulse"
        >
          <MessageSquare className="w-6 h-6 fill-white" />
        </a>

        {/* Direct Call Button */}
        <a
          href={`tel:${db.contact.phone.split(',')[0]}`}
          title="Call College Office"
          className="w-12 h-12 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-xl transition transform hover:scale-110"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          title="Back to Top"
          className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-xl transition transform hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* Video Modal Preview */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-black text-sm text-white">Campus Life Tour • KIPS College Kotla</h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/2rJjtMMf0fE?autoplay=1"
                title="KIPS College Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-slate-300">
              Explore our state-of-the-art physics labs, chemistry workshops, mathematics problem-solving tracks, and interactive classrooms on Bhimber Road.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
