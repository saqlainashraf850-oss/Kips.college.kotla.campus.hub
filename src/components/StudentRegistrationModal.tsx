import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  Send,
  Lock,
  Mail,
  Building,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentApplication } from '../types';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { registerStudentRequest, db } = usePortal();

  // Form State
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('2008-04-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [studentContact, setStudentContact] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('1234');
  const [appliedClass, setAppliedClass] = useState('1st Year (FSc Pre-Engineering)');
  const [section, setSection] = useState('CB1');
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousMarks, setPreviousMarks] = useState('');
  const [admissionInfo, setAdmissionInfo] = useState('');
  const [documentNote, setDocumentNote] = useState('Matric Result Card, B-Form');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<StudentApplication | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!studentName.trim() || !fatherName.trim() || !studentContact.trim() || !parentContact.trim()) {
      setErrorMsg('Please complete all required fields (Name, Father Name, Student & Parent Contact).');
      return;
    }

    setIsSubmitting(true);

    const res = await registerStudentRequest({
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      dob,
      gender,
      studentContact: studentContact.trim(),
      parentContact: parentContact.trim(),
      email: email.trim() || `${studentName.toLowerCase().replace(/\s+/g, '')}@student.kips.pk`,
      pass: password || '1234',
      appliedClass,
      section,
      previousSchool: previousSchool.trim() || 'Government / Private High School',
      previousMarks: previousMarks.trim() || '980 / 1100 (Grade A+)',
      admissionInfo: admissionInfo.trim() || 'Direct Online Admission Request',
      documents: documentNote.split(',').map(d => d.trim()).filter(Boolean)
    });

    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    if (res.application) {
      setSubmittedApp(res.application);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  };

  const handleResetAndClose = () => {
    setSubmittedApp(null);
    setStudentName('');
    setFatherName('');
    setStudentContact('');
    setParentContact('');
    setEmail('');
    setPreviousSchool('');
    setPreviousMarks('');
    setAdmissionInfo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-sky-200 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-cyan-500 text-white rounded-xl shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Online Admission & Student Registration
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                KIPS College Kotla Arab Ali Khan Campus • Session 2026-27
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedApp ? (
          /* Submission Receipt / Confirmation Slip */
          <div className="space-y-5 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider inline-block">
                Status: Pending Principal Review
              </span>
              <h4 className="text-xl font-black text-slate-900">
                Application Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your admission request has been recorded in the college database. All authorized administrators have received your notification.
              </p>
            </div>

            {/* Official Admission Slip Card */}
            <div className="p-5 bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/80 rounded-2xl border border-sky-200 text-left font-mono text-xs space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Application ID</span>
                <span className="font-extrabold text-sky-700 text-sm">{submittedApp.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                <p>
                  <strong className="text-slate-500 font-sans">Student:</strong> {submittedApp.studentName}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Father:</strong> {submittedApp.fatherName}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Class:</strong> {submittedApp.appliedClass}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Section:</strong> {submittedApp.section}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Contact:</strong> {submittedApp.studentContact}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Guardian:</strong> {submittedApp.parentContact}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Submitted:</strong> {submittedApp.submissionDate}
                </p>
                <p>
                  <strong className="text-slate-500 font-sans">Portal Access:</strong> <span className="text-amber-700 font-bold">Awaiting Approval</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-900 text-left space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>What happens next?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                1. Principal Prof. Muhammad Tariq or authorized campus admins will review your matriculation credentials.
                <br />
                2. Once approved, your student account will be activated, and you can log in to the <strong>Student Portal</strong> using your student email or roll number.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Done / Close Slip
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl text-[11px] text-sky-900 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <span>
                Please fill in accurate personal and academic information. This application will be directly reviewed by the college Principal & Administration.
              </span>
            </div>

            {/* Personal Details */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>1. Personal & Guardian Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Muhammad Hamza"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    placeholder="e.g. Tariq Mahmood"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Portal Password</label>
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Contact *</label>
                  <input
                    type="tel"
                    required
                    value={studentContact}
                    onChange={e => setStudentContact(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Parent / Guardian Contact *</label>
                  <input
                    type="tel"
                    required
                    value={parentContact}
                    onChange={e => setParentContact(e.target.value)}
                    placeholder="+92 301 7654321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="hamza@student.kips.pk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-sky-600" />
                <span>2. Applied Program & Academic Record</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Applied Class / Program *</label>
                  <select
                    value={appliedClass}
                    onChange={e => setAppliedClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="1st Year (FSc Pre-Medical)">1st Year (FSc Pre-Medical)</option>
                    <option value="1st Year (FSc Pre-Engineering)">1st Year (FSc Pre-Engineering)</option>
                    <option value="1st Year (ICS Computer Science)">1st Year (ICS Computer Science)</option>
                    <option value="1st Year (ICOM Commerce)">1st Year (ICOM Commerce)</option>
                    <option value="2nd Year (FSc Pre-Medical)">2nd Year (FSc Pre-Medical)</option>
                    <option value="2nd Year (FSc Pre-Engineering)">2nd Year (FSc Pre-Engineering)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Section</label>
                  <select
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {db.sections.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.room})
                      </option>
                    ))}
                    <option value="CB1">CB1</option>
                    <option value="CB2">CB2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Previous School / Board</label>
                  <input
                    type="text"
                    value={previousSchool}
                    onChange={e => setPreviousSchool(e.target.value)}
                    placeholder="e.g. Govt High School Kotla Arab Ali Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Previous Marks / Result</label>
                  <input
                    type="text"
                    value={previousMarks}
                    onChange={e => setPreviousMarks(e.target.value)}
                    placeholder="e.g. 1012 / 1100 (92% BISE Gujranwala)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admission Information / Extra Remarks</label>
                <textarea
                  rows={2}
                  value={admissionInfo}
                  onChange={e => setAdmissionInfo(e.target.value)}
                  placeholder="Hostel requirement, bus transport route, or academic achievements..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Uploaded Documents / Attachment List</label>
                <input
                  type="text"
                  value={documentNote}
                  onChange={e => setDocumentNote(e.target.value)}
                  placeholder="e.g. Matric Result Card, B-Form, Passport Photos"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Submitting Application to College...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Admission Registration Form</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
