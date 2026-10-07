import React, { useState, useEffect, useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  GraduationCap,
  ScanBarcode,
  Camera,
  X,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  Loader2,
  KeyRound,
  FileText,
  Smartphone
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const LoginView: React.FC = () => {
  const {
    db,
    activeLoginRole,
    setActiveLoginRole,
    login,
    registerStudentRequest,
    setActiveView
  } = usePortal();

  // Login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginStatusType, setLoginStatusType] = useState<'pending' | 'rejected' | 'error' | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  // Student portal sub-mode: 'signin' or 'register'
  const [studentMode, setStudentMode] = useState<'signin' | 'register'>('signin');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regFather, setRegFather] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regClass, setRegClass] = useState('1st Year (F.Sc Pre-Medical)');
  const [regSection, setRegSection] = useState('CB1');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');

  // Registration UI state
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState<{
    name: string;
    roll: string;
    class: string;
    mobile: string;
    email?: string;
    timestamp: string;
    principalMobile: string;
  } | null>(null);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
    setLoginStatusType(null);
    stopCamera();
    if (activeLoginRole !== 'student') {
      setStudentMode('signin');
    }
  }, [activeLoginRole]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    setIsCameraActive(true);

    try {
      setTimeout(async () => {
        try {
          if (!qrScannerRef.current) {
            qrScannerRef.current = new Html5Qrcode('qr-reader-container');
          }
          await qrScannerRef.current.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              handleScannedCard(decodedText);
              stopCamera();
            },
            () => {}
          );
        } catch (err: any) {
          console.error("Camera start error", err);
          setCameraError("Camera permission was denied or camera is not available. Please enter the Card ID or Gmail manually.");
          setIsCameraActive(false);
        }
      }, 300);
    } catch (e: any) {
      setCameraError(e.message || "Failed to initialize camera.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current.clear();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
    setIsCameraActive(false);
  };

  const handleScannedCard = (code: string) => {
    const clean = code.trim();
    setIdentifier(clean);
    setActiveLoginRole('student');
    setStudentMode('signin');

    const matched = db.students.find(
      s => s.cardId.toLowerCase() === clean.toLowerCase() ||
           s.roll.toLowerCase() === clean.toLowerCase() ||
           s.email.toLowerCase() === clean.toLowerCase()
    );

    if (matched) {
      setPassword(matched.pass);
      setErrorMessage('');
      setLoginStatusType(null);
      const res = login('student', clean, matched.pass);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed.');
        setLoginStatusType((res.status as 'pending' | 'rejected') || 'error');
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoginStatusType(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Card ID, Roll Number, or Registered Email.');
      return;
    }

    const res = login(activeLoginRole, identifier, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed.');
      setLoginStatusType((res.status as 'pending' | 'rejected') || 'error');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    // Form Validations
    if (!regName.trim() || !regFather.trim() || !regRoll.trim() || !regMobile.trim() || !regPass.trim()) {
      setRegError('Please fill in all required fields (Name, Father Name, Roll No, Mobile, Password).');
      return;
    }

    const cleanMobileDigits = regMobile.replace(/[^0-9]/g, '');
    if (cleanMobileDigits.length < 10) {
      setRegError('Please provide a valid mobile number with at least 10 digits (e.g. 03001234567 or +92 300 1234567).');
      return;
    }

    if (regPass.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }

    if (regPass !== regPassConfirm) {
      setRegError('Passwords do not match. Please re-enter both passwords carefully.');
      return;
    }

    setIsSubmittingReg(true);

    // Realistic network dispatch feel
    setTimeout(() => {
      const res = registerStudentRequest({
        name: regName,
        father: regFather,
        roll: regRoll,
        class: regClass,
        section: regSection,
        mobile: regMobile,
        email: regEmail || undefined,
        pass: regPass
      });

      setIsSubmittingReg(false);

      if (!res.success) {
        setRegError(res.message || 'Registration failed. Please check your information.');
      } else {
        const principalMobile = db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543';
        setRegSuccessData({
          name: regName.trim(),
          roll: regRoll.trim(),
          class: `${regClass} (${regSection})`,
          mobile: regMobile.trim(),
          email: regEmail.trim() || undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          principalMobile
        });

        // Pre-fill login for once approved
        setIdentifier(regRoll.trim());
        setPassword(regPass);
      }
    }, 600);
  };

  // Quick fill demo buttons
  const fillApprovedStudentDemo = () => {
    setActiveLoginRole('student');
    setStudentMode('signin');
    const s = db.students.find(std => std.status === 'approved') || db.students[0];
    if (s) {
      setIdentifier(s.cardId);
      setPassword(s.pass);
      setErrorMessage('');
      setLoginStatusType(null);
    }
  };

  const fillPendingStudentDemo = () => {
    setActiveLoginRole('student');
    setStudentMode('signin');
    const s = db.students.find(std => std.status === 'pending');
    if (s) {
      setIdentifier(s.roll);
      setPassword(s.pass);
      setErrorMessage('');
      setLoginStatusType(null);
    }
  };

  const fillRejectedStudentDemo = () => {
    setActiveLoginRole('student');
    setStudentMode('signin');
    const s = db.students.find(std => std.status === 'rejected');
    if (s) {
      setIdentifier(s.roll);
      setPassword(s.pass);
      setErrorMessage('');
      setLoginStatusType(null);
    }
  };

  const fillSampleNewRegistration = () => {
    setActiveLoginRole('student');
    setStudentMode('register');
    setRegName('Zubair Hassan');
    setRegFather('Hassan Mahmood');
    setRegRoll('008');
    setRegClass('1st Year (F.Sc Pre-Engineering)');
    setRegSection('CB1');
    setRegMobile('+92 305 4433221');
    setRegEmail('zubair.hassan@gmail.com');
    setRegPass('pass123');
    setRegPassConfirm('pass123');
    setRegError('');
    setRegSuccessData(null);
  };

  const fillTeacherDemo = () => {
    setActiveLoginRole('teacher');
    setStudentMode('signin');
    const t = db.teachers[0];
    if (t) {
      setIdentifier(t.email);
      setPassword(t.pass);
      setErrorMessage('');
      setLoginStatusType(null);
    }
  };

  const fillAdminDemo = () => {
    setActiveLoginRole('admin');
    setStudentMode('signin');
    setIdentifier(db.auth.adminUser);
    setPassword(db.auth.adminPass);
    setErrorMessage('');
    setLoginStatusType(null);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Login / Register Form */}
        <div className="md:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl relative shadow-2xl border border-sky-200">
          <div className="text-center space-y-1.5 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30 mb-2 overflow-hidden">
              {db.branding.logoUrl ? (
                <img src={db.branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {db.branding.title}
            </h2>
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest">
              Digital Portal Access Gateway
            </p>
          </div>

          {/* 3 Role Selection Tabs */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveLoginRole('student')}
              className={`flex-1 py-2.5 rounded-xl transition ${
                activeLoginRole === 'student'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveLoginRole('teacher')}
              className={`flex-1 py-2.5 rounded-xl transition ${
                activeLoginRole === 'teacher'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveLoginRole('admin')}
              className={`flex-1 py-2.5 rounded-xl transition ${
                activeLoginRole === 'admin'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Control
            </button>
          </div>

          {/* If Student Portal is active: Toggle between "Sign In" and "First Time Registration" */}
          {activeLoginRole === 'student' && (
            <div className="flex items-center space-x-2 p-1 bg-sky-50/80 rounded-xl mb-5 border border-sky-200">
              <button
                type="button"
                onClick={() => {
                  setStudentMode('signin');
                  setRegSuccessData(null);
                  setErrorMessage('');
                  setLoginStatusType(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  studentMode === 'signin'
                    ? 'bg-white text-sky-800 shadow-sm border border-sky-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                <span>Existing Student Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStudentMode('register');
                  setErrorMessage('');
                  setLoginStatusType(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  studentMode === 'register'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>First-Time Registration</span>
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW: FIRST-TIME STUDENT REGISTRATION FLOW (PRINCIPAL APPROVAL) */}
          {/* ============================================================== */}
          {activeLoginRole === 'student' && studentMode === 'register' ? (
            <div>
              {regSuccessData ? (
                /* Post-Submission Success & Pending State Screen */
                <div className="space-y-4 animate-fade-in">
                  <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-amber-500 text-white rounded-xl">
                        <Clock className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                          Account Status: Pending Approval
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-0.5">
                          Registration Submitted Successfully!
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      Your request has been registered and is currently <strong>Pending Principal Approval</strong>. In accordance with college security policy, students cannot directly access the dashboard until authorized.
                    </p>

                    {/* Dispatched Notification Card */}
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-emerald-800 font-bold text-[11px]">
                        <Send className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approval Notification Dispatched to Principal Mobile</span>
                      </div>
                      <div className="font-mono text-slate-800 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-snug">
                        • <strong>Principal Mobile:</strong> {regSuccessData.principalMobile}<br />
                        • <strong>Student Name:</strong> {regSuccessData.name}<br />
                        • <strong>Roll Number:</strong> {regSuccessData.roll}<br />
                        • <strong>Class/Course:</strong> {regSuccessData.class}<br />
                        • <strong>Student Mobile:</strong> {regSuccessData.mobile}<br />
                        • <strong>Time:</strong> {regSuccessData.timestamp}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px] space-y-1">
                      <p className="font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>What happens next?</span>
                      </p>
                      <p>
                        Once the Principal reviews and authorizes your request, your status will change to <strong>Approved / Active</strong>, allowing full access to your personalized student dashboard, cards, timetable, and study materials.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentMode('signin');
                        setRegSuccessData(null);
                      }}
                      className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Proceed to Sign In Screen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRegSuccessData(null);
                        setRegRoll('');
                      }}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
                    >
                      New Request
                    </button>
                  </div>
                </div>
              ) : (
                /* Registration Input Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs font-medium">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Principal Approval Required</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-snug">
                      Submit your enrollment information below. An authorization request will be automatically dispatched to Principal Prof. Muhammad Tariq's mobile number.
                    </p>
                  </div>

                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Student Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Father / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regFather}
                        onChange={e => setRegFather(e.target.value)}
                        placeholder="e.g. Tariq Mahmood"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Roll No / Student ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={regRoll}
                        onChange={e => setRegRoll(e.target.value)}
                        placeholder="e.g. 008"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-mono font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Class / Course *
                      </label>
                      <select
                        value={regClass}
                        onChange={e => setRegClass(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                      >
                        <option value="1st Year (F.Sc Pre-Medical)">1st Year (F.Sc Pre-Medical)</option>
                        <option value="1st Year (F.Sc Pre-Engineering)">1st Year (F.Sc Pre-Engineering)</option>
                        <option value="1st Year (ICS Maths/CS)">1st Year (ICS Maths/CS)</option>
                        <option value="1st Year (ICS Maths/Stats)">1st Year (ICS Maths/Stats)</option>
                        <option value="2nd Year (F.Sc Pre-Medical)">2nd Year (F.Sc Pre-Medical)</option>
                        <option value="2nd Year (F.Sc Pre-Engineering)">2nd Year (F.Sc Pre-Engineering)</option>
                        <option value="2nd Year (ICS Maths/CS)">2nd Year (ICS Maths/CS)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Section Batch *
                      </label>
                      <select
                        value={regSection}
                        onChange={e => setRegSection(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                      >
                        {db.sections.map(s => (
                          <option key={s.id} value={s.name}>Section {s.name} - Room {s.room}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Student Mobile Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={regMobile}
                          onChange={e => setRegMobile(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="e.g. student@gmail.com"
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Create Account Password *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={regPass}
                          onChange={e => setRegPass(e.target.value)}
                          placeholder="Min 4 characters"
                          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={regPassConfirm}
                          onChange={e => setRegPassConfirm(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReg}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-75"
                  >
                    {isSubmittingReg ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Request to Principal Mobile...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Registration for Principal Approval</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setStudentMode('signin')}
                      className="text-slate-500 hover:text-sky-700 text-xs font-semibold underline"
                    >
                      Already requested approval? Back to Student Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* VIEW: STANDARD SIGN IN FORM (WITH STATUS ENFORCEMENT)           */
            /* ============================================================== */
            <div>
              {/* Camera Scanner View */}
              {isCameraActive && (
                <div className="mb-5 rounded-2xl overflow-hidden bg-black border-2 border-sky-500 relative p-2">
                  <div className="flex items-center justify-between text-white text-xs px-2 py-1 mb-1">
                    <span className="font-bold flex items-center space-x-1">
                      <Camera className="w-4 h-4 text-sky-400" />
                      <span>Align Student Card Barcode / QR</span>
                    </span>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div id="qr-reader-container" className="w-full h-56 rounded-xl overflow-hidden"></div>
                </div>
              )}

              {cameraError && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
                  {cameraError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {activeLoginRole === 'student'
                      ? 'Student Roll Number, Card ID, or Gmail'
                      : activeLoginRole === 'teacher'
                      ? 'Teacher Registered Gmail'
                      : 'Admin Username'}
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => {
                        setIdentifier(e.target.value);
                        setErrorMessage('');
                        setLoginStatusType(null);
                      }}
                      placeholder={
                        activeLoginRole === 'student'
                          ? 'e.g. 001, KIPS-CB1-00125, or ahmed@gmail.com'
                          : activeLoginRole === 'teacher'
                          ? 'e.g. hamza@gmail.com'
                          : 'Enter admin username (e.g. Kips.edu)'
                      }
                      className="w-full pl-3.5 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white font-medium"
                    />

                    {activeLoginRole === 'student' && (
                      <button
                        type="button"
                        onClick={isCameraActive ? stopCamera : startCamera}
                        title="Scan Student Card via Camera"
                        className="absolute right-2.5 top-2.5 p-1.5 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition"
                      >
                        <ScanBarcode className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {activeLoginRole === 'student' ? 'Student Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        setErrorMessage('');
                        setLoginStatusType(null);
                      }}
                      placeholder="Enter your password"
                      className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {/* DISTINCT STATUS ERROR BANNERS (PENDING / REJECTED / INVALID) */}
                {errorMessage && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      loginStatusType === 'pending'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : loginStatusType === 'rejected'
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-red-50 border-red-200 text-red-600 font-bold'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-bold">
                      {loginStatusType === 'pending' ? (
                        <>
                          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
                          <span>Status: Pending Principal Authorization</span>
                        </>
                      ) : loginStatusType === 'rejected' ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>Status: Account Not Approved by Principal</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Authentication Failed</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] font-medium">{errorMessage}</p>
                    {loginStatusType === 'pending' && (
                      <p className="text-[10px] text-amber-800/80 pt-0.5">
                        Approval requests are handled directly by Principal Prof. Muhammad Tariq. Once approved, you will be able to log in immediately.
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-sky-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>
                    Sign In to{' '}
                    {activeLoginRole === 'student'
                      ? 'Student Portal'
                      : activeLoginRole === 'teacher'
                      ? 'Teacher Portal'
                      : 'Admin Control'}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Quick Demo Pre-fills */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Test Credentials & Approval Flows:
            </span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={fillApprovedStudentDemo}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300"
                title="Log in with active, approved student"
              >
                ✅ Approved Student (Ahmed 001)
              </button>
              <button
                type="button"
                onClick={fillPendingStudentDemo}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-300"
                title="Test pending student login block"
              >
                ⏳ Pending Student (Hamza 005)
              </button>
              <button
                type="button"
                onClick={fillRejectedStudentDemo}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg border border-rose-300"
                title="Test rejected student login message"
              >
                ❌ Rejected Student (Bilal 006)
              </button>
              <button
                type="button"
                onClick={fillSampleNewRegistration}
                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-lg border border-sky-300"
                title="Fill sample student registration"
              >
                📝 Sample New Registration
              </button>
              <button
                type="button"
                onClick={fillTeacherDemo}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200"
              >
                Teacher (hamza@gmail.com)
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-300"
              >
                Admin (Kips.edu)
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => setActiveView('public')}
              className="text-sky-600 font-bold hover:underline flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
            <span className="text-[11px]">KIPS Kotla Unified Security Gateway</span>
          </div>
        </div>

        {/* Right Side: Information & Card Guide */}
        <div className="md:col-span-5 glass-panel-sky p-8 rounded-3xl text-slate-800 space-y-6 shadow-xl border border-sky-200">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase font-extrabold tracking-wider text-sky-600">
              <Sparkles className="w-4 h-4" />
              <span>Smart Campus Access</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">Principal Approval System</h3>
            <p className="text-xs text-slate-600">
              High-security student onboarding and verification managed by Principal Prof. Muhammad Tariq.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-200 flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">1. Student Registration</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Students register with their Name, Roll Number, Class, and Mobile Number.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-200 flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl flex-shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">2. Principal Mobile Notification</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  System sends an instant notification containing student details to the Principal's configured mobile number.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-200 flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">3. Authorization & Portal Entry</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Upon approval, student status activates immediately for normal sign-in to cards, timetable, and study materials.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-sky-100/70 rounded-2xl text-[11px] text-sky-950 space-y-1.5 border border-sky-200 font-medium">
            <p className="font-bold text-sky-900">Default Access Credentials:</p>
            <p>• Admin: <code className="font-bold bg-white px-1.5 py-0.5 rounded">Kips.edu</code> | Pass: <code className="font-bold bg-white px-1.5 py-0.5 rounded">0852</code></p>
            <p>• Teacher: <code className="font-bold bg-white px-1.5 py-0.5 rounded">hamza@gmail.com</code> | Pass: <code className="font-bold bg-white px-1.5 py-0.5 rounded">1234</code></p>
            <p>• Student: <code className="font-bold bg-white px-1.5 py-0.5 rounded">001</code> | Pass: <code className="font-bold bg-white px-1.5 py-0.5 rounded">1234</code></p>
            <p className="text-[10px] text-slate-600 pt-1">
              Principal Configured Mobile: <strong className="font-mono text-slate-900">{db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

