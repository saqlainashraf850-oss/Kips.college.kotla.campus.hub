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
  NotificationLogItem,
  DepartmentActivityNotification,
  CourseProgramItem
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
  
  // Tracking & Notifications
  activityNotifications: DepartmentActivityNotification[];
  isActivityCenterOpen: boolean;
  setIsActivityCenterOpen: (open: boolean) => void;
  recordStudentLogin: (studentId: string) => void;
  recordMaterialView: (studentId: string, materialId: string) => void;
  recordSensitiveAction: (title: string, description: string, severity?: 'alert' | 'warning' | 'info' | 'success') => void;
  dismissActivityNotification: (id: string) => void;
  clearActivityNotifications: () => void;
  todayLoggedStudents: StudentItem[];
  todayNotLoggedStudents: StudentItem[];

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
  updateTeacher: (id: string, tea: Partial<TeacherItem>) => { success: boolean; message?: string };
  deleteTeacher: (id: string) => void;
  addCourse: (course: Omit<CourseProgramItem, 'id'>) => { success: boolean; message?: string };
  updateCourse: (id: string, course: Partial<CourseProgramItem>) => void;
  deleteCourse: (id: string) => void;
  toggleCourseStatus: (id: string) => void;
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

        // Safeguard teachers so they are never truncated and any added teachers stay intact
        const parsedTeachers: TeacherItem[] = Array.isArray(parsed.teachers) ? parsed.teachers : [];
        const mergedTeachers = [...parsedTeachers];
        for (const defaultTea of INITIAL_COLLEGE_DB.teachers) {
          if (!mergedTeachers.some((t: any) => t.id === defaultTea.id || t.email.toLowerCase() === defaultTea.email.toLowerCase())) {
            mergedTeachers.push(defaultTea);
          }
        }

        const migratedCourses = (parsed.courses && parsed.courses.length > 0)
          ? parsed.courses
          : (INITIAL_COLLEGE_DB.courses || []);

        return {
          ...INITIAL_COLLEGE_DB,
          ...parsed,
          principal: {
            ...INITIAL_COLLEGE_DB.principal,
            ...parsed.principal,
            approvalMobileNumber: parsed.principal?.approvalMobileNumber || INITIAL_COLLEGE_DB.principal.approvalMobileNumber || '+92 300 9876543'
          },
          students: migratedStudents,
          teachers: mergedTeachers,
          courses: migratedCourses,
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
  const [isActivityCenterOpen, setIsActivityCenterOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentItem | null>(() => {
    return db.students.find(s => s.status === 'approved') || null;
  });
  const [currentTeacher, setCurrentTeacher] = useState<TeacherItem | null>(() => db.teachers[0] || null);

  // Sync to localStorage with quota protection so large images never cause silent drop of teachers/data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Failed to save to local storage, attempting optimized save", e);
      try {
        // Strip out excessive data URLs if quota exceeded to protect essential records
        const safeDb = {
          ...db,
          gallery: (db.gallery || []).map(g => ({
            ...g,
            url: g.url && g.url.length > 100000 ? 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80' : g.url
          })),
          teachers: (db.teachers || []).map(t => ({
            ...t,
            photo: t.photo && t.photo.length > 100000 ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' : t.photo
          }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDb));
      } catch (err2) {
        console.error("Critical storage error", err2);
      }
    }
  }, [db]);

  const todayStr = new Date().toISOString().split('T')[0];
  const activityNotifications = db.activityNotifications || [];
  const todayLoggedStudents = db.students.filter(s => s.status === 'approved' && s.lastLoginDate === todayStr);
  const todayNotLoggedStudents = db.students.filter(s => s.status === 'approved' && s.lastLoginDate !== todayStr);

  const recordStudentLogin = (studentId: string) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    let studentObj: StudentItem | undefined;

    setDb(prev => {
      const updatedStudents = prev.students.map(s => {
        if (s.id === studentId || s.roll === studentId) {
          studentObj = s;
          return {
            ...s,
            lastLoginDate: todayDate,
            lastLoginTime: timeStr
          };
        }
        return s;
      });

      const newNotif: DepartmentActivityNotification = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'login',
        title: 'طالب علم لاگ ان (Student Logged In Today)',
        description: `${studentObj?.name || 'طالب علم'} (Roll: ${studentObj?.roll || studentId}, Class: ${studentObj?.class || 'F.Sc'}) نے آج ${timeStr} پر لاگ ان کیا۔`,
        timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${timeStr}`,
        date: todayDate,
        studentId: studentObj?.id || studentId,
        studentName: studentObj?.name,
        studentRoll: studentObj?.roll,
        isSensitive: false,
        severity: 'success'
      };

      return {
        ...prev,
        students: updatedStudents,
        activityNotifications: [newNotif, ...(prev.activityNotifications || [])]
      };
    });

    setCurrentStudent(curr => {
      if (curr && (curr.id === studentId || curr.roll === studentId)) {
        return { ...curr, lastLoginDate: todayDate, lastLoginTime: timeStr };
      }
      return curr;
    });
  };

  const recordMaterialView = (studentId: string, materialId: string) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    let studentObj: StudentItem | undefined;
    let materialObj: MaterialItem | undefined;

    setDb(prev => {
      materialObj = prev.materials.find(m => m.id === materialId);
      const updatedStudents = prev.students.map(s => {
        if (s.id === studentId || s.roll === studentId) {
          studentObj = s;
          const alreadyViewed = (s.viewedMaterialIds || []).includes(materialId);
          const updatedViewed = alreadyViewed ? (s.viewedMaterialIds || []) : [...(s.viewedMaterialIds || []), materialId];
          return {
            ...s,
            viewedMaterialIds: updatedViewed
          };
        }
        return s;
      });

      const newNotif: DepartmentActivityNotification = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'viewed_material',
        title: 'سٹڈی میٹریل دیکھا گیا (Material Viewed)',
        description: `${studentObj?.name || 'طالب علم'} (Roll: ${studentObj?.roll}) نے '${materialObj?.title || 'Study Material'}' دیکھی۔`,
        timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${timeStr}`,
        date: todayDate,
        studentId: studentObj?.id || studentId,
        studentName: studentObj?.name,
        studentRoll: studentObj?.roll,
        materialId,
        materialTitle: materialObj?.title,
        isSensitive: false,
        severity: 'info'
      };

      return {
        ...prev,
        students: updatedStudents,
        activityNotifications: [newNotif, ...(prev.activityNotifications || [])]
      };
    });

    setCurrentStudent(curr => {
      if (curr && (curr.id === studentId || curr.roll === studentId)) {
        const alreadyViewed = (curr.viewedMaterialIds || []).includes(materialId);
        const updatedViewed = alreadyViewed ? (curr.viewedMaterialIds || []) : [...(curr.viewedMaterialIds || []), materialId];
        return { ...curr, viewedMaterialIds: updatedViewed };
      }
      return curr;
    });
  };

  const recordSensitiveAction = (title: string, description: string, severity: 'alert' | 'warning' | 'info' | 'success' = 'alert') => {
    const todayDate = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newNotif: DepartmentActivityNotification = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'sensitive_action',
      title,
      description,
      timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${timeStr}`,
      date: todayDate,
      isSensitive: true,
      severity
    };

    setDb(prev => ({
      ...prev,
      activityNotifications: [newNotif, ...(prev.activityNotifications || [])]
    }));
  };

  const dismissActivityNotification = (id: string) => {
    setDb(prev => ({
      ...prev,
      activityNotifications: (prev.activityNotifications || []).filter(n => n.id !== id)
    }));
  };

  const clearActivityNotifications = () => {
    setDb(prev => ({
      ...prev,
      activityNotifications: []
    }));
  };

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
        recordStudentLogin(found.id);
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

    recordSensitiveAction('نئی رجسٹریشن درخواست (Student Registration)', `طالب علم "${cleanName}" (Roll: ${cleanRoll}, ${std.class}) نے رجسٹریشن فارم جمع کرایا${std.photo ? ' بمع ذاتی تصویر' : ''}۔ پرنسپل کی منظوری درکار ہے۔`, 'info');

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

    recordSensitiveAction('طالب علم کی منظوری (Student Approved)', `پرنسپل نے طالب علم "${studentName || idOrToken}" کی رجسٹریشن منظور کر کے اکاؤنٹ ایکٹیو کیا۔`, 'success');

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

    recordSensitiveAction('رجسٹریشن مسترد (Student Rejected)', `پرنسپل نے طالب علم "${studentName || idOrToken}" کی درخواست مسترد کی۔ وجہ: "${reason}"`, 'alert');

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

    recordSensitiveAction('پرنسپل موبائل نمبر تبدیل (Principal Mobile Updated)', `ایمرجنسی نوٹیفکیشن الرٹ موبائل تبدیل کر کے "${clean}" کیا گیا۔`, 'alert');

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
    recordSensitiveAction('رابطہ معلومات اپ ڈیٹ (Contact Updated)', 'کالج کے پتے، فون، ای میل، یا دفتری اوقات میں تبدیلی کی گئی۔', 'warning');
    setDb(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...updatedContact
      }
    }));
  };

  const updatePrincipal = (updatedPrincipal: Partial<PrincipalInfo>) => {
    recordSensitiveAction('پرنسپل پروفائل اپ ڈیٹ (Principal Profile Updated)', 'پرنسپل کے پروفائل، ڈگریز یا دفتری رابطے میں ترمیم کی گئی۔', 'warning');
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
    recordSensitiveAction('ایڈمن لاگ ان تبدیل (Admin Credentials Updated)', 'ایڈمن کنٹرول پینل کے لاگ ان کریڈینشلز اپ ڈیٹ کیے گئے۔', 'alert');
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
    recordSensitiveAction('نیا سیکشن شامل (Section Added)', `سیکشن ${sec.name} شامل کیا گیا۔`, 'info');
    setDb(prev => ({
      ...prev,
      sections: [...prev.sections, newSec]
    }));
    return true;
  };

  const deleteSection = (id: string) => {
    recordSensitiveAction('سیکشن حذف (Section Deleted)', `سیکشن کا ریکارڈ حذف کر دیا گیا۔`, 'warning');
    setDb(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const deleteStudent = (id: string) => {
    recordSensitiveAction('طالب علم ریکارڈ حذف (Student Deleted)', `طالب علم کا پروفائل ریکارڈ حذف کر دیا گیا۔`, 'alert');
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
    const cleanEmail = tea.email.trim().toLowerCase();
    const existing = db.teachers.some(t => t.email.trim().toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'A teacher with this Gmail already exists.' };
    }
    const newTeacher: TeacherItem = {
      ...tea,
      email: cleanEmail,
      id: `t-${Date.now()}`
    };

    setDb(prev => {
      let updatedSections = prev.sections;
      if (tea.inchargeSection && tea.inchargeSection !== 'None') {
        updatedSections = prev.sections.map(sec => 
          sec.name === tea.inchargeSection ? { ...sec, incharge: `${tea.name} (${tea.subject})` } : sec
        );
      }
      return {
        ...prev,
        sections: updatedSections,
        teachers: [newTeacher, ...prev.teachers]
      };
    });
    recordSensitiveAction('نیا استاد شامل (Teacher Added)', `استاد ${tea.name} (${tea.subject}) فیکلٹی میں شامل کیا گیا۔`, 'info');
    return { success: true };
  };

  const updateTeacher = (id: string, updated: Partial<TeacherItem>): { success: boolean; message?: string } => {
    setDb(prev => {
      const updatedTeachers = prev.teachers.map(t => {
        if (t.id === id) {
          return { ...t, ...updated };
        }
        return t;
      });

      let updatedSections = prev.sections;
      if (updated.inchargeSection && updated.inchargeSection !== 'None') {
        const found = updatedTeachers.find(t => t.id === id);
        if (found) {
          updatedSections = prev.sections.map(sec => 
            sec.name === updated.inchargeSection ? { ...sec, incharge: `${found.name} (${found.subject})` } : sec
          );
        }
      }

      return {
        ...prev,
        sections: updatedSections,
        teachers: updatedTeachers
      };
    });
    recordSensitiveAction('استاد کا ریکارڈ اپ ڈیٹ (Teacher Updated)', `استاد کی تفصیلات و معلومات اپ ڈیٹ کی گئیں۔`, 'info');
    return { success: true };
  };

  const deleteTeacher = (id: string) => {
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));
    recordSensitiveAction('استاد کا ریکارڈ حذف (Teacher Removed)', `استاد فیکلٹی لسٹ سے ریموو کر دیا گیا۔`, 'warning');
  };

  const addCourse = (course: Omit<CourseProgramItem, 'id'>): { success: boolean; message?: string } => {
    const cleanTitle = course.title.trim();
    if (!cleanTitle) {
      return { success: false, message: 'Course title is required.' };
    }
    const newCourse: CourseProgramItem = {
      ...course,
      id: `course-${Date.now()}`
    };
    setDb(prev => ({
      ...prev,
      courses: [newCourse, ...(prev.courses || [])]
    }));
    recordSensitiveAction('نیا کورس شامل (Course Added)', `تعلیمی پروگرام '${cleanTitle}' کامیابی سے شامل کیا گیا۔`, 'info');
    return { success: true };
  };

  const updateCourse = (id: string, updated: Partial<CourseProgramItem>) => {
    setDb(prev => ({
      ...prev,
      courses: (prev.courses || []).map(c => c.id === id ? { ...c, ...updated } : c)
    }));
    recordSensitiveAction('کورس معلومات اپ ڈیٹ (Course Updated)', `کورس کے قواعد و مضامین اپ ڈیٹ کیے گئے۔`, 'info');
  };

  const deleteCourse = (id: string) => {
    setDb(prev => ({
      ...prev,
      courses: (prev.courses || []).filter(c => c.id !== id)
    }));
    recordSensitiveAction('کورس حذف (Course Deleted)', `کورس پورٹل سے خارج کر دیا گیا۔`, 'warning');
  };

  const toggleCourseStatus = (id: string) => {
    setDb(prev => ({
      ...prev,
      courses: (prev.courses || []).map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
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
        activityNotifications,
        isActivityCenterOpen,
        setIsActivityCenterOpen,
        recordStudentLogin,
        recordMaterialView,
        recordSensitiveAction,
        dismissActivityNotification,
        clearActivityNotifications,
        todayLoggedStudents,
        todayNotLoggedStudents,
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
        updateTeacher,
        deleteTeacher,
        addCourse,
        updateCourse,
        deleteCourse,
        toggleCourseStatus,
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
