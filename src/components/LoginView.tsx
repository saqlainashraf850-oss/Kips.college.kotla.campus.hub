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
  Sparkles
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export const LoginView: React.FC = () => {
  const {
    db,
    activeLoginRole,
    setActiveLoginRole,
    login,
    setActiveView
  } = usePortal();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    setIdentifier('');
    setPassword('');
    setErrorMessage('');
    stopCamera();
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
      // Small timeout to allow the reader element to mount
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
            () => {
              // Ignore scan frame misses
            }
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

    // Check if code matches any student cardId or roll
    const matched = db.students.find(
      s => s.cardId.toLowerCase() === clean.toLowerCase() ||
           s.roll.toLowerCase() === clean.toLowerCase() ||
           s.email.toLowerCase() === clean.toLowerCase()
    );

    if (matched) {
      setPassword(matched.pass);
      setErrorMessage('');
      // Auto-submit login for seamless card scan experience
      login('student', clean, matched.pass);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Card ID, Roll Number, or Registered Email.');
      return;
    }

    const res = login(activeLoginRole, identifier, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed.');
    }
  };

  // Quick fill demo buttons
  const fillStudentDemo = () => {
    setActiveLoginRole('student');
    const s = db.students[0];
    if (s) {
      setIdentifier(s.cardId);
      setPassword(s.pass);
    }
  };

  const fillTeacherDemo = () => {
    setActiveLoginRole('teacher');
    const t = db.teachers[0];
    if (t) {
      setIdentifier(t.email);
      setPassword(t.pass);
    }
  };

  const fillAdminDemo = () => {
    setActiveLoginRole('admin');
    setIdentifier(db.auth.adminUser);
    setPassword(db.auth.adminPass);
  };

  return (
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Login Form */}
        <div className="md:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl relative shadow-2xl border border-sky-200">
          <div className="text-center space-y-1.5 mb-6">
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
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
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
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {activeLoginRole === 'student'
                  ? 'Student Gmail or Card ID (e.g. KIPS-CB1-00125)'
                  : activeLoginRole === 'teacher'
                  ? 'Teacher Registered Gmail'
                  : 'Admin Username'}
              </label>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder={
                    activeLoginRole === 'student'
                      ? 'e.g. ahmed@gmail.com or KIPS-CB1-00125'
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
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-sky-600/30 transition flex items-center justify-center space-x-2"
            >
              <span>Sign In to {activeLoginRole === 'student' ? 'Student Portal' : activeLoginRole === 'teacher' ? 'Teacher Portal' : 'Admin Control'}</span>
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Test Credentials:
            </span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={fillStudentDemo}
                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold rounded-lg border border-sky-200"
              >
                Test Student (CB1 Card)
              </button>
              <button
                type="button"
                onClick={fillTeacherDemo}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200"
              >
                Test Teacher (Maths)
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-300"
              >
                Test Admin (Kips.edu)
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
            <span className="text-[11px]">KIPS Kotla Unified Security</span>
          </div>
        </div>

        {/* Right Side: Information & Card Guide */}
        <div className="md:col-span-5 glass-panel-sky p-8 rounded-3xl text-slate-800 space-y-6 shadow-xl border border-sky-200">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase font-extrabold tracking-wider text-sky-600">
              <Sparkles className="w-4 h-4" />
              <span>Smart Campus Access</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">Card & Email Portals</h3>
            <p className="text-xs text-slate-600">
              Students can login using their high-precision digital card barcode or registered Gmail.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-200 flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl">
                <ScanBarcode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Card Scanner Camera</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Align your physical Student ID Card barcode to auto-fill credentials in seconds.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-200 flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Teacher Workspace</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Faculty members upload notes, whiteboard photos, and video tutorials directly for CB1 and CB2.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-sky-200 flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Administrative Control</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Change contact info, register students with DP, post circulars, and manage batches.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-sky-100/70 rounded-2xl text-[11px] text-sky-950 space-y-1.5 border border-sky-200 font-medium">
            <p className="font-bold text-sky-900">Default Access Credentials:</p>
            <p>• Admin: <code className="font-bold bg-white px-1.5 py-0.5 rounded">Kips.edu</code> | Pass: <code className="font-bold bg-white px-1.5 py-0.5 rounded">0852</code></p>
            <p>• Teacher: <code className="font-bold bg-white px-1.5 py-0.5 rounded">hamza@gmail.com</code> | Pass: <code className="font-bold bg-white px-1.5 py-0.5 rounded">1234</code></p>
            <p>• Student: <code className="font-bold bg-white px-1.5 py-0.5 rounded">KIPS-CB1-00125</code> | Pass: <code className="font-bold bg-white px-1.5 py-0.5 rounded">1234</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};
