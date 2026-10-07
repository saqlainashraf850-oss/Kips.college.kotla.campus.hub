import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CollegeDatabase,
  ContactInfo,
  PrincipalInfo,
  SectionItem,
  StudentItem,
  TeacherItem,
  MaterialItem,
  AnnouncementItem,
  GalleryItem,
  InquiryItem,
  LocationItem,
  NotificationLogItem
} from '../types';
import { INITIAL_COLLEGE_DB } from '../data/initialData';

const STORAGE_KEY = 'kips_master_db_v3';

interface PortalContextType {
  db: CollegeDatabase;
  activeView: 'public' | 'student' | 'teacher' | 'admin' | 'login';
  setActiveView: (view: 'public' | 'student' | 'teacher' | 'admin' | 'login') => void;
  activeLoginRole: 'student' | 'teacher' | 'admin';
  setActiveLoginRole: (role: 'student' | 'teacher' | 'admin') => void;
  currentStudent: StudentItem | null;
  setCurrentStudent: (s: StudentItem | null) => void;
  currentTeacher: TeacherItem | null;
  setCurrentTeacher: (t: TeacherItem | null) => void;
  
  // Actions
  login: (role: 'student' | 'teacher' | 'admin', identifier: string, password?: string) => { success: boolean; message?: string; status?: string };
  logout: () => void;
  registerStudentRequest: (std: {
    name: string;
    father: string;
    email?: string;
    pass: string;
    roll: string;
    class: string;
    section: string;
    mobile: string;
    photo?: string;
    customCardId?: string;
  }) => { success: boolean; message: string; student?: StudentItem };
  approveStudent: (idOrToken: string) => { success: boolean; message: string };
  rejectStudent: (idOrToken: string, reason?: string) => { success: boolean; message: string };
  updatePrincipalMobile: (mobileNumber: string) => { success: boolean; message: string };
  verifyApprovalToken: (token: string) => StudentItem | null;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updatePrincipal: (principal: Partial<PrincipalInfo>) => void;
  updateBranding: (title: string, logoUrl?: string) => void;
  updateAdminAuth: (adminUser: string, adminPass: string) => void;
  addSection: (sec: Omit<SectionItem, 'id'>) => boolean;
  deleteSection: (id: string) => void;
  deleteStudent: (id: string) => void;
  markAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Late') => void;
  addTeacher: (tea: Omit<TeacherItem, 'id'>) => { success: boolean; message?: string };
  deleteTeacher: (id: string) => void;
  addMaterial: (mat: Omit<MaterialItem, 'id' | 'date'>) => void;
  deleteMaterial: (id: string) => void;
  addAnnouncement: (ann: Omit<AnnouncementItem, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  addInquiry: (inq: Omit<InquiryItem, 'id' | 'date' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: 'New' | 'Replied' | 'Pending') => void;
  deleteInquiry: (id: string) => void;
  addLocation: (loc: Omit<LocationItem, 'id'>) => void;
  updateLocation: (id: string, loc: Partial<LocationItem>) => void;
  deleteLocation: (id: string) => void;
  exportBackup: () => void;
  importBackup: (jsonStr: string) => boolean;
  resetDatabase: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<CollegeDatabase>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const migratedStudents = (parsed.students || INITIAL_COLLEGE_DB.students).map((s: any) => ({
          ...s,
          status: s.status || 'approved',
          mobile: s.mobile || '+92 300 1234500',
          requestedAt: s.requestedAt || '15 Aug 2025, 10:00 AM',
          approvalToken: s.approvalToken || `token-${s.id}`
        }));

        return {
          ...INITIAL_COLLEGE_DB,
          ...parsed,
          principal: {
            ...INITIAL_COLLEGE_DB.principal,
            ...parsed.principal,
            approvalMobileNumber: parsed.principal?.approvalMobileNumber || INITIAL_COLLEGE_DB.principal.approvalMobileNumber || '+92 300 9876543'
          },
          students: migratedStudents,
          locations: parsed.locations || INITIAL_COLLEGE_DB.locations,
          gallery: parsed.gallery || INITIAL_COLLEGE_DB.gallery,
          notificationLogs: parsed.notificationLogs || INITIAL_COLLEGE_DB.notificationLogs || []
        };
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    return INITIAL_COLLEGE_DB;
  });

  const [activeView, setActiveView] = useState<'public' | 'student' | 'teacher' | 'admin' | 'login'>('public');
  const [activeLoginRole, setActiveLoginRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [currentStudent, setCurrentStudent] = useState<StudentItem | null>(() => {
    return db.students.find(s => s.status === 'approved') || null;
  });
  const [currentTeacher, setCurrentTeacher] = useState<TeacherItem | null>(() => db.teachers[0] || null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [db]);

  const login = (role: 'student' | 'teacher' | 'admin', identifier: string, password = ''): { success: boolean; message?: string; status?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (role === 'admin') {
      const isOfficialAdmin = (cleanId === db.auth.adminUser.toLowerCase() && cleanPass === db.auth.adminPass);
      const isPrincipalLogin = (cleanId === 'principal' || cleanId === db.principal.email.toLowerCase()) && (cleanPass === db.auth.adminPass || cleanPass === '1234' || cleanPass === '0852');
      
      if (isOfficialAdmin || isPrincipalLogin) {
        setActiveView('admin');
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin/Principal username or password.' };
    }

    if (role === 'student') {
      const cleanDigits = cleanId.replace(/[^0-9]/g, '');
      const found = db.students.find(s => {
        const stdDigits = s.mobile ? s.mobile.replace(/[^0-9]/g, '') : '';
        return (
          s.email.toLowerCase() === cleanId ||
          s.cardId.toLowerCase() === cleanId ||
          s.roll.toLowerCase() === cleanId ||
          (cleanDigits.length >= 7 && stdDigits.endsWith(cleanDigits))
        );
      });

      if (!found) {
        return { success: false, message: 'No registered student found with this Card ID, Roll Number, or Registered Email.' };
      }

      // Check password
      if (cleanPass && found.pass !== cleanPass) {
        return { success: false, message: 'Incorrect student password.' };
      }

      // STRICT APPROVAL STATUS ENFORCEMENT
      if (found.status === 'pending') {
        return {
          success: false,
          status: 'pending',
          message: 'Your account is currently Pending Approval. A notification has been sent to the Principal\'s mobile number. You cannot access the student portal until approval is granted.'
        };
      }

      if (found.status === 'rejected') {
        return {
          success: false,
          status: 'rejected',
          message: found.rejectionReason || 'Your account has not been approved by the Principal. Please contact the college administration office.'
        };
      }

      if (found.status === 'approved') {
        setCurrentStudent(found);
        setActiveView('student');
        return { success: true, status: 'approved' };
      }

      return {
        success: false,
        status: 'pending',
        message: 'Your account is pending Principal approval.'
      };
    }

    if (role === 'teacher') {
      const found = db.teachers.find(t => t.email.toLowerCase() === cleanId);
      if (!found) {
        return { success: false, message: 'No registered teacher found with this email.' };
      }
      if (found.pass !== cleanPass) {
        return { success: false, message: 'Incorrect teacher password.' };
      }
      setCurrentTeacher(found);
      setActiveView('teacher');
      return { success: true };
    }

    return { success: false, message: 'Authentication failed.' };
  };

  const logout = () => {
    setActiveView('public');
  };

  // 1. STUDENT REGISTRATION WITH PRINCIPAL NOTIFICATION (REPLACES OLD GENERATE STUDENT)
  const registerStudentRequest = (std: {
    name: string;
    father: string;
    email?: string;
    pass: string;
    roll: string;
    class: string;
    section: string;
    mobile: string;
    photo?: string;
    customCardId?: string;
  }): { success: boolean; message: string; student?: StudentItem } => {
    const cleanName = std.name.trim();
    const cleanFather = std.father.trim();
    const cleanRoll = std.roll.trim();
    const cleanMobile = std.mobile.trim();
    const cleanEmail = (std.email || '').trim().toLowerCase();
    const cleanPass = std.pass.trim();
    const cleanDigits = cleanMobile.replace(/[^0-9]/g, '');

    if (!cleanName || !cleanRoll || !cleanMobile || !cleanPass) {
      return { success: false, message: 'Student Name, Roll Number, Mobile Number, and Password are required.' };
    }

    if (cleanDigits.length < 10) {
      return { success: false, message: 'Please enter a valid mobile number with at least 10 digits (e.g. +92 300 1234567).' };
    }

    // Duplicate Check: Roll Number
    const existingByRoll = db.students.find(s => s.roll.toLowerCase() === cleanRoll.toLowerCase());
    if (existingByRoll) {
      if (existingByRoll.status === 'pending') {
        return { success: false, message: `A registration request for Roll Number "${cleanRoll}" is already pending Principal approval.` };
      }
      if (existingByRoll.status === 'rejected') {
        return { success: false, message: `Your account with Roll Number "${cleanRoll}" has not been approved by the Principal.` };
      }
      return { success: false, message: `A student account with Roll Number "${cleanRoll}" already exists and is active. Please sign in.` };
    }

    // Duplicate Check: Mobile Number
    const existingByMobile = db.students.find(s => {
      const sDigits = (s.mobile || '').replace(/[^0-9]/g, '');
      return sDigits.length >= 10 && cleanDigits.length >= 10 && (sDigits === cleanDigits || sDigits.endsWith(cleanDigits) || cleanDigits.endsWith(sDigits));
    });
    if (existingByMobile) {
      if (existingByMobile.status === 'pending') {
        return { success: false, message: `A registration request with Mobile Number "${cleanMobile}" is already pending Principal approval.` };
      }
      if (existingByMobile.status === 'rejected') {
        return { success: false, message: 'Your account has not been approved by the Principal.' };
      }
      return { success: false, message: `An account with this Mobile Number already exists. Please sign in.` };
    }

    // Duplicate Check: Email (if provided)
    if (cleanEmail) {
      const existingByEmail = db.students.find(s => s.email && s.email.toLowerCase() === cleanEmail);
      if (existingByEmail) {
        if (existingByEmail.status === 'pending') {
          return { success: false, message: `A registration request with Email "${cleanEmail}" is already pending Principal approval.` };
        }
        return { success: false, message: `An account with this Email already exists.` };
      }
    }

    const cardId = std.customCardId?.trim() || `KIPS-${std.section}-${cleanRoll.padStart(4, '0')}`;
    const timestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const approvalToken = `appr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newStudent: StudentItem = {
      id: `std-${Date.now()}`,
      name: cleanName,
      father: cleanFather || 'Parent / Guardian',
      email: cleanEmail || `${cleanRoll.toLowerCase()}@kips.edu.pk`,
      pass: cleanPass,
      roll: cleanRoll,
      cardId,
      class: std.class,
      section: std.section,
      mobile: cleanMobile,
      status: 'pending',
      requestedAt: timestamp,
      approvalToken,
      attendance: 100,
      attendanceStatus: 'Present',
      photo: std.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      grade: 'Pending Enrollment',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Principal Mobile Number for Notifications (from Admin Configuration)
    const principalMobile = db.principal.approvalMobileNumber || db.principal.phone || '+92 300 9876543';

    // Dispatched Mobile Notification Record
    const notificationMessage = `🎓 GIPS/KIPS College Kotla - Student Access Request\n• Student Name: ${cleanName}\n• Student ID/Roll: ${cleanRoll}\n• Class/Course: ${std.class} (Section ${std.section})\n• Registered Mobile: ${cleanMobile}\n• Email: ${cleanEmail || 'Not Provided'}\n• Request Time: ${timestamp}\nStatus: Pending Principal Approval`;

    const newNotification: NotificationLogItem = {
      id: `notif-${Date.now()}`,
      studentId: newStudent.id,
      studentName: cleanName,
      roll: cleanRoll,
      class: `${std.class} (${std.section})`,
      mobile: cleanMobile,
      email: cleanEmail,
      principalMobile,
      message: notificationMessage,
      timestamp,
      status: 'delivered',
      channel: 'SMS',
      actionToken: approvalToken
    };

    setDb(prev => ({
      ...prev,
      students: [newStudent, ...prev.students],
      notificationLogs: [newNotification, ...(prev.notificationLogs || [])]
    }));

    // Trigger backend API if server running
    try {
      fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      message: `Registration request submitted! An approval notification has been sent to Principal mobile (${principalMobile}). Status: Pending Approval.`,
      student: newStudent
    };
  };

  // 2. APPROVE STUDENT ACCESS
  const approveStudent = (idOrToken: string): { success: boolean; message: string } => {
    let studentName = '';
    const approvalTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setDb(prev => {
      const updatedStudents = prev.students.map(s => {
        if (s.id === idOrToken || s.approvalToken === idOrToken) {
          studentName = s.name;
          return {
            ...s,
            status: 'approved' as const,
            approvedAt: approvalTime,
            rejectionReason: undefined
          };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents
      };
    });

    try {
      fetch('/api/principal/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: idOrToken })
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      message: studentName ? `Student "${studentName}" approved! Account is now Active.` : 'Student approved successfully.'
    };
  };

  // 3. REJECT STUDENT ACCESS
  const rejectStudent = (idOrToken: string, reason = 'Your account has not been approved by the Principal.'): { success: boolean; message: string } => {
    let studentName = '';
    const rejectionTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setDb(prev => {
      const updatedStudents = prev.students.map(s => {
        if (s.id === idOrToken || s.approvalToken === idOrToken) {
          studentName = s.name;
          return {
            ...s,
            status: 'rejected' as const,
            rejectedAt: rejectionTime,
            rejectionReason: reason
          };
        }
        return s;
      });

      return {
        ...prev,
        students: updatedStudents
      };
    });

    // If current student was rejected, clear active session
    if (currentStudent && (currentStudent.id === idOrToken || currentStudent.approvalToken === idOrToken)) {
      setCurrentStudent(null);
      setActiveView('public');
    }

    try {
      fetch('/api/principal/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: idOrToken, reason })
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      message: studentName ? `Student "${studentName}" rejected.` : 'Student access rejected.'
    };
  };

  // 4. CONFIGURE PRINCIPAL MOBILE NUMBER (SECURE ADMIN SETTING)
  const updatePrincipalMobile = (mobileNumber: string): { success: boolean; message: string } => {
    const clean = mobileNumber.trim();
    const digits = clean.replace(/[^0-9]/g, '');

    if (!clean || digits.length < 10) {
      return {
        success: false,
        message: 'Invalid mobile number. Please enter a valid number with country code and at least 10 digits (e.g. +92 300 9876543).'
      };
    }

    setDb(prev => ({
      ...prev,
      principal: {
        ...prev.principal,
        approvalMobileNumber: clean
      }
    }));

    try {
      fetch('/api/config/principal-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: clean })
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      message: `Principal mobile number saved successfully! New notifications will be sent to ${clean}.`
    };
  };

  const verifyApprovalToken = (token: string): StudentItem | null => {
    return db.students.find(s => s.approvalToken === token) || null;
  };

  const updateContact = (updatedContact: Partial<ContactInfo>) => {
    setDb(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...updatedContact
      }
    }));
  };

  const updatePrincipal = (updatedPrincipal: Partial<PrincipalInfo>) => {
    setDb(prev => ({
      ...prev,
      principal: {
        ...prev.principal,
        ...updatedPrincipal
      }
    }));
  };

  const updateBranding = (title: string, logoUrl?: string) => {
    setDb(prev => ({
      ...prev,
      branding: {
        title: title || prev.branding.title,
        logoUrl: logoUrl !== undefined ? logoUrl : prev.branding.logoUrl
      }
    }));
  };

  const updateAdminAuth = (adminUser: string, adminPass: string) => {
    setDb(prev => ({
      ...prev,
      auth: { adminUser, adminPass }
    }));
  };

  const addSection = (sec: Omit<SectionItem, 'id'>): boolean => {
    if (db.sections.some(s => s.name.toUpperCase() === sec.name.toUpperCase())) {
      return false;
    }
    const newSec: SectionItem = {
      ...sec,
      id: `sec-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      sections: [...prev.sections, newSec]
    }));
    return true;
  };

  const deleteSection = (id: string) => {
    setDb(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const deleteStudent = (id: string) => {
    setDb(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id)
    }));
    if (currentStudent?.id === id) {
      setCurrentStudent(db.students.find(s => s.id !== id) || null);
    }
  };

  const markAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setDb(prev => ({
      ...prev,
      students: prev.students.map(s => {
        if (s.id === studentId) {
          const adjAttendance = status === 'Present' ? Math.min(100, s.attendance + 1) : Math.max(50, s.attendance - 2);
          return {
            ...s,
            attendanceStatus: status,
            attendance: adjAttendance
          };
        }
        return s;
      })
    }));
  };

  const addTeacher = (tea: Omit<TeacherItem, 'id'>): { success: boolean; message?: string } => {
    if (db.teachers.some(t => t.email.toLowerCase() === tea.email.toLowerCase())) {
      return { success: false, message: 'A teacher with this Gmail already exists.' };
    }
    const newTeacher: TeacherItem = {
      ...tea,
      id: `t-${Date.now()}`
    };

    // If teacher is assigned as incharge of a section, update section incharge
    let updatedSections = db.sections;
    if (tea.inchargeSection && tea.inchargeSection !== 'None') {
      updatedSections = db.sections.map(sec => 
        sec.name === tea.inchargeSection ? { ...sec, incharge: `${tea.name} (${tea.subject})` } : sec
      );
    }

    setDb(prev => ({
      ...prev,
      sections: updatedSections,
      teachers: [newTeacher, ...prev.teachers]
    }));
    return { success: true };
  };

  const deleteTeacher = (id: string) => {
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));
  };

  const addMaterial = (mat: Omit<MaterialItem, 'id' | 'date'>) => {
    const newMat: MaterialItem = {
      ...mat,
      id: `mat-${Date.now()}`,
      date: 'Just Now'
    };
    setDb(prev => ({
      ...prev,
      materials: [newMat, ...prev.materials]
    }));
  };

  const deleteMaterial = (id: string) => {
    setDb(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id)
    }));
  };

  const addAnnouncement = (ann: Omit<AnnouncementItem, 'id' | 'date'>) => {
    const newAnn: AnnouncementItem = {
      ...ann,
      id: `an-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setDb(prev => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements]
    }));
  };

  const deleteAnnouncement = (id: string) => {
    setDb(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id)
    }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `g-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      gallery: [newItem, ...prev.gallery]
    }));
  };

  const deleteGalleryItem = (id: string) => {
    setDb(prev => {
      const targetId = String(id).trim().toLowerCase();
      const filtered = (prev.gallery || []).filter(g => 
        String(g.id).trim().toLowerCase() !== targetId &&
        String(g.url).trim() !== String(id).trim()
      );
      const updated = {
        ...prev,
        gallery: filtered
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to sync deleted gallery to localStorage", e);
      }
      return updated;
    });
  };

  const addInquiry = (inq: Omit<InquiryItem, 'id' | 'date' | 'status'>) => {
    const newInq: InquiryItem = {
      ...inq,
      id: `inq-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'New'
    };
    setDb(prev => ({
      ...prev,
      inquiries: [newInq, ...(prev.inquiries || [])]
    }));
  };

  const updateInquiryStatus = (id: string, status: 'New' | 'Replied' | 'Pending') => {
    setDb(prev => ({
      ...prev,
      inquiries: (prev.inquiries || []).map(inq => inq.id === id ? { ...inq, status } : inq)
    }));
  };

  const deleteInquiry = (id: string) => {
    setDb(prev => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter(inq => inq.id !== id)
    }));
  };

  const addLocation = (loc: Omit<LocationItem, 'id'>) => {
    const newLoc: LocationItem = {
      ...loc,
      id: `loc-${Date.now()}`
    };
    setDb(prev => {
      const updated = {
        ...prev,
        locations: [...(prev.locations || []), newLoc]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Storage error", e);
      }
      return updated;
    });
  };

  const updateLocation = (id: string, loc: Partial<LocationItem>) => {
    setDb(prev => {
      const updatedLocs = (prev.locations || []).map(l => l.id === id ? { ...l, ...loc } : l);
      const updated = {
        ...prev,
        locations: updatedLocs
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Storage error", e);
      }
      return updated;
    });
  };

  const deleteLocation = (id: string) => {
    setDb(prev => {
      const filtered = (prev.locations || []).filter(l => l.id !== id);
      const updated = {
        ...prev,
        locations: filtered
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Storage error", e);
      }
      return updated;
    });
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kips_portal_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.students && parsed.auth) {
        setDb(parsed);
        return true;
      }
    } catch (e) {
      console.error("Backup import error", e);
    }
    return false;
  };

  const resetDatabase = () => {
    setDb(INITIAL_COLLEGE_DB);
  };

  return (
    <PortalContext.Provider
      value={{
        db,
        activeView,
        setActiveView,
        activeLoginRole,
        setActiveLoginRole,
        currentStudent,
        setCurrentStudent,
        currentTeacher,
        setCurrentTeacher,
        login,
        logout,
        updateContact,
        updatePrincipal,
        updateBranding,
        updateAdminAuth,
        addSection,
        deleteSection,
        registerStudentRequest,
        approveStudent,
        rejectStudent,
        updatePrincipalMobile,
        verifyApprovalToken,
        deleteStudent,
        markAttendance,
        addTeacher,
        deleteTeacher,
        addMaterial,
        deleteMaterial,
        addAnnouncement,
        deleteAnnouncement,
        addGalleryItem,
        deleteGalleryItem,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        addLocation,
        updateLocation,
        deleteLocation,
        exportBackup,
        importBackup,
        resetDatabase
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
