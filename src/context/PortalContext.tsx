import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  StudentApplication,
  AdminNotification,
  StudentNotification,
  ContentViewRecord,
  TeacherContentItem,
  AuditLogEntry,
  AdminUser,
  UserSession,
  CollegeSettings
} from '../types';
import { INITIAL_COLLEGE_DB } from '../data/initialData';

const STORAGE_KEY = 'kips_master_db_v4';
const AUTH_TOKEN_KEY = 'kips_session_token';

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
  currentAdmin: AdminUser | null;
  setCurrentAdmin: (a: AdminUser | null) => void;
  currentUserToken: string | null;

  // Management Data Accessors
  applications: StudentApplication[];
  adminNotifications: AdminNotification[];
  studentNotifications: StudentNotification[];
  teacherContents: TeacherContentItem[];
  contentViews: ContentViewRecord[];
  auditLogs: AuditLogEntry[];
  adminUsers: AdminUser[];
  activeSessions: UserSession[];
  systemSettings: CollegeSettings;

  // Auth & Session
  login: (role: 'student' | 'teacher' | 'admin', identifier: string, password?: string, keepSignedIn?: boolean) => Promise<{ success: boolean; message?: string; status?: string }>;
  logout: () => void;
  revokeOtherSessions: () => Promise<string>;

  // Student Registration & Approval
  registerStudentRequest: (std: {
    studentName?: string;
    fatherName?: string;
    name?: string;
    father?: string;
    email?: string;
    pass?: string;
    password?: string;
    roll?: string;
    appliedClass?: string;
    class?: string;
    section?: string;
    studentContact?: string;
    parentContact?: string;
    mobile?: string;
    photo?: string;
    photoUrl?: string;
    dob?: string;
    gender?: 'Male' | 'Female' | 'Other';
    previousSchool?: string;
    previousMarks?: string;
    admissionInfo?: string;
    documents?: string[];
  }) => Promise<{ success: boolean; message: string; application?: StudentApplication }>;

  approveApplication: (appId: string, adminName?: string) => Promise<{ success: boolean; conflict?: boolean; message: string; currentStatus?: string; application?: StudentApplication }>;
  rejectApplication: (appId: string, reason?: string, adminName?: string) => Promise<{ success: boolean; conflict?: boolean; message: string; currentStatus?: string; application?: StudentApplication }>;
  markApplicationUnderReview: (appId: string) => Promise<boolean>;

  // Admin Notifications
  markAdminNotificationRead: (notifId: string) => void;
  markAllAdminNotificationsRead: () => void;
  unreadAdminNotificationsCount: number;

  // Teacher Content & Tracking
  uploadTeacherContent: (content: Omit<TeacherContentItem, 'id' | 'uploadDate' | 'totalViews' | 'uniqueViewers' | 'downloadCount'>) => Promise<{ success: boolean; message?: string; content?: TeacherContentItem }>;
  updateTeacherContent: (id: string, updates: Partial<TeacherContentItem>) => Promise<void>;
  deleteTeacherContent: (id: string) => Promise<void>;
  trackContentView: (contentId: string, studentId?: string, studentName?: string, stdClass?: string, section?: string) => Promise<void>;

  // Administration & Database Actions
  updateContact: (contact: Partial<ContactInfo>) => void;
  updatePrincipal: (principal: Partial<PrincipalInfo>) => void;
  updateBranding: (title: string, logoUrl?: string) => void;
  updateAdminAuth: (adminUser: string, adminPass: string) => void;
  updateSystemSettings: (settings: Partial<CollegeSettings>) => void;
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

  // Compatibility helpers
  approveStudent: (idOrToken: string) => { success: boolean; message: string };
  rejectStudent: (idOrToken: string, reason?: string) => { success: boolean; message: string };
  updatePrincipalMobile: (mobileNumber: string) => { success: boolean; message: string };
  verifyApprovalToken: (token: string) => StudentItem | null;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<CollegeDatabase>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INITIAL_COLLEGE_DB,
          ...parsed,
          principal: {
            ...INITIAL_COLLEGE_DB.principal,
            ...parsed.principal
          },
          applications: parsed.applications || INITIAL_COLLEGE_DB.applications || [],
          adminNotifications: parsed.adminNotifications || INITIAL_COLLEGE_DB.adminNotifications || [],
          studentNotifications: parsed.studentNotifications || INITIAL_COLLEGE_DB.studentNotifications || [],
          teacherContents: parsed.teacherContents || INITIAL_COLLEGE_DB.teacherContents || [],
          contentViews: parsed.contentViews || INITIAL_COLLEGE_DB.contentViews || [],
          auditLogs: parsed.auditLogs || INITIAL_COLLEGE_DB.auditLogs || [],
          adminUsers: parsed.adminUsers || INITIAL_COLLEGE_DB.adminUsers || [],
          activeSessions: parsed.activeSessions || INITIAL_COLLEGE_DB.activeSessions || [],
          systemSettings: parsed.systemSettings || INITIAL_COLLEGE_DB.systemSettings
        };
      }
    } catch (e) {
      console.error('Failed to load local storage', e);
    }
    return INITIAL_COLLEGE_DB;
  });

  const [activeView, setActiveView] = useState<'public' | 'student' | 'teacher' | 'admin' | 'login'>('public');
  const [activeLoginRole, setActiveLoginRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [currentStudent, setCurrentStudent] = useState<StudentItem | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherItem | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [currentUserToken, setCurrentUserToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY) || null;
  });

  // Keep state synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [db]);

  // Sync with backend on startup
  const syncWithBackend = useCallback(async () => {
    try {
      const [appsRes, contentsRes, statsRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/content'),
        fetch('/api/admin/dashboard-stats')
      ]);

      if (appsRes.ok) {
        const data = await appsRes.json();
        if (data.applications) {
          setDb(prev => ({ ...prev, applications: data.applications }));
        }
      }

      if (contentsRes.ok) {
        const data = await contentsRes.json();
        if (data.contents) {
          setDb(prev => ({ ...prev, teacherContents: data.contents }));
        }
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.activityFeed) {
          setDb(prev => ({ ...prev, auditLogs: data.activityFeed }));
        }
      }
    } catch (err) {
      // Offline or server booting
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // 17. PERSISTENT LOGIN & SECURE SESSIONS VERIFICATION
  useEffect(() => {
    const verifySession = async () => {
      const token = currentUserToken;
      if (!token) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            if (data.session.role === 'super_admin' || data.session.role === 'admin') {
              const adm = (db.adminUsers || INITIAL_COLLEGE_DB.adminUsers || [])[0];
              setCurrentAdmin(adm);
            } else if (data.session.role === 'teacher') {
              const tea = db.teachers.find(t => t.id === data.session.userId) || db.teachers[0];
              setCurrentTeacher(tea);
            } else if (data.session.role === 'student' && data.student) {
              setCurrentStudent(data.student);
            }
          }
        } else {
          // Token invalid or revoked on server
          localStorage.removeItem(AUTH_TOKEN_KEY);
          sessionStorage.removeItem(AUTH_TOKEN_KEY);
          setCurrentUserToken(null);
          setCurrentStudent(null);
          setCurrentTeacher(null);
          setCurrentAdmin(null);
        }
      } catch (e) {
        // network issue - preserve current state
      }
    };

    verifySession();
  }, [currentUserToken, db.teachers, db.adminUsers]);

  // LOGIN FUNCTION
  const login = async (
    role: 'student' | 'teacher' | 'admin',
    identifier: string,
    password = '',
    keepSignedIn = true
  ): Promise<{ success: boolean; message?: string; status?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, identifier, password, keepSignedIn })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Login failed.',
          status: data.status
        };
      }

      if (data.token) {
        setCurrentUserToken(data.token);
        if (keepSignedIn) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        } else {
          sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
      }

      if (role === 'admin') {
        const adminObj: AdminUser = data.user || {
          id: 'adm-1',
          name: 'Prof. Muhammad Tariq',
          username: 'Kips.edu',
          role: 'Super Admin',
          permissions: ['applications', 'students', 'teachers', 'content', 'analytics', 'admins', 'settings', 'logs'],
          createdAt: '01 Jan 2025'
        };
        setCurrentAdmin(adminObj);
        setActiveView('admin');
        return { success: true };
      }

      if (role === 'teacher') {
        const tea = db.teachers.find(t => t.email.toLowerCase() === identifier.toLowerCase().trim()) || db.teachers[0];
        setCurrentTeacher(tea);
        setActiveView('teacher');
        return { success: true };
      }

      if (role === 'student') {
        if (data.student) {
          setCurrentStudent(data.student);
          setActiveView('student');
          return { success: true, status: 'approved' };
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login' };
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    if (currentUserToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentUserToken}` },
        body: JSON.stringify({ token: currentUserToken })
      }).catch(() => {});
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    setCurrentUserToken(null);
    setCurrentStudent(null);
    setCurrentTeacher(null);
    setCurrentAdmin(null);
    setActiveView('public');
  };

  const revokeOtherSessions = async (): Promise<string> => {
    try {
      const res = await fetch('/api/admin/sessions/revoke-others', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: currentUserToken ? `Bearer ${currentUserToken}` : ''
        },
        body: JSON.stringify({ currentToken: currentUserToken })
      });
      const data = await res.json();
      return data.message || 'Revoked other sessions.';
    } catch {
      return 'Failed to revoke other sessions.';
    }
  };

  // 1. STUDENT REGISTRATION
  const registerStudentRequest = async (std: {
    studentName?: string;
    fatherName?: string;
    name?: string;
    father?: string;
    email?: string;
    pass?: string;
    password?: string;
    roll?: string;
    appliedClass?: string;
    class?: string;
    section?: string;
    studentContact?: string;
    parentContact?: string;
    mobile?: string;
    photo?: string;
    photoUrl?: string;
    dob?: string;
    gender?: 'Male' | 'Female' | 'Other';
    previousSchool?: string;
    previousMarks?: string;
    admissionInfo?: string;
    documents?: string[];
  }): Promise<{ success: boolean; message: string; application?: StudentApplication }> => {
    try {
      const payload = {
        studentName: std.studentName || std.name,
        fatherName: std.fatherName || std.father,
        roll: std.roll,
        appliedClass: std.appliedClass || std.class,
        section: std.section || 'CB1',
        studentContact: std.studentContact || std.mobile,
        parentContact: std.parentContact,
        email: std.email,
        pass: std.pass || std.password || '1234',
        dob: std.dob || '12 Mar 2008',
        gender: std.gender || 'Male',
        previousSchool: std.previousSchool || 'Matric Science',
        previousMarks: std.previousMarks || '1020 / 1100 (Grade A+)',
        admissionInfo: std.admissionInfo || 'Direct Online Application',
        documents: std.documents || ['Matric Result Card', 'B-Form'],
        photoUrl: std.photoUrl || std.photo
      };

      const res = await fetch('/api/applications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Registration failed.' };
      }

      if (data.application) {
        setDb(prev => ({
          ...prev,
          applications: [data.application, ...(prev.applications || [])],
          adminNotifications: data.notification ? [data.notification, ...(prev.adminNotifications || [])] : (prev.adminNotifications || [])
        }));
      }

      return {
        success: true,
        message: data.message || 'Application submitted successfully!',
        application: data.application
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration request failed.' };
    }
  };

  // 4. APPROVE APPLICATION WITH DUPLICATE APPROVAL PROTECTION
  const approveApplication = async (
    appId: string,
    adminName = 'Prof. Muhammad Tariq (Principal)'
  ): Promise<{ success: boolean; conflict?: boolean; message: string; currentStatus?: string; application?: StudentApplication }> => {
    try {
      const res = await fetch(`/api/applications/${appId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName })
      });

      const data = await res.json();

      if (res.status === 409 || data.conflict) {
        // DUPLICATE APPROVAL DETECTED
        return {
          success: false,
          conflict: true,
          message: data.message || 'This application has already been processed by another administrator.',
          currentStatus: data.currentStatus
        };
      }

      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to approve application.' };
      }

      // Update local state
      setDb(prev => {
        const updatedApps = (prev.applications || []).map(a =>
          a.id === appId ? { ...a, status: 'Approved' as const, processedBy: adminName, processedAt: new Date().toLocaleDateString() } : a
        );
        const updatedStudents = prev.students.map(s =>
          s.id === data.student?.id || s.roll === data.application?.assignedRoll ? { ...s, status: 'approved' as const } : s
        );
        const updatedNotifs = (prev.adminNotifications || []).map(n =>
          n.applicationId === appId ? { ...n, actionTaken: true, actionTakenBy: adminName } : n
        );

        return {
          ...prev,
          applications: updatedApps,
          students: updatedStudents,
          adminNotifications: updatedNotifs
        };
      });

      return {
        success: true,
        message: data.message || 'Application approved successfully! Student account activated.',
        application: data.application
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Approval request failed.' };
    }
  };

  // 5. REJECT APPLICATION WITH DUPLICATE PROTECTION
  const rejectApplication = async (
    appId: string,
    reason?: string,
    adminName = 'Prof. Muhammad Tariq (Principal)'
  ): Promise<{ success: boolean; conflict?: boolean; message: string; currentStatus?: string; application?: StudentApplication }> => {
    try {
      const res = await fetch(`/api/applications/${appId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, adminName })
      });

      const data = await res.json();

      if (res.status === 409 || data.conflict) {
        return {
          success: false,
          conflict: true,
          message: data.message || 'This application has already been processed by another administrator.',
          currentStatus: data.currentStatus
        };
      }

      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to reject application.' };
      }

      setDb(prev => {
        const updatedApps = (prev.applications || []).map(a =>
          a.id === appId ? { ...a, status: 'Rejected' as const, rejectionReason: reason, processedBy: adminName } : a
        );
        return { ...prev, applications: updatedApps };
      });

      return {
        success: true,
        message: data.message || 'Application has been marked as Rejected.',
        application: data.application
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Rejection request failed.' };
    }
  };

  const markApplicationUnderReview = async (appId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/applications/${appId}/review`, { method: 'POST' });
      if (res.ok) {
        setDb(prev => ({
          ...prev,
          applications: (prev.applications || []).map(a => a.id === appId ? { ...a, status: 'Under Review' as const } : a)
        }));
        return true;
      }
    } catch {}
    return false;
  };

  // ADMIN NOTIFICATIONS READ TRACKING
  const markAdminNotificationRead = (notifId: string) => {
    const adminId = currentAdmin?.id || 'adm-1';
    fetch(`/api/admin/notifications/${notifId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId })
    }).catch(() => {});

    setDb(prev => ({
      ...prev,
      adminNotifications: (prev.adminNotifications || []).map(n =>
        n.id === notifId && !n.readBy.includes(adminId) ? { ...n, readBy: [...n.readBy, adminId] } : n
      )
    }));
  };

  const markAllAdminNotificationsRead = () => {
    const adminId = currentAdmin?.id || 'adm-1';
    fetch('/api/admin/notifications/mark-all-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId })
    }).catch(() => {});

    setDb(prev => ({
      ...prev,
      adminNotifications: (prev.adminNotifications || []).map(n =>
        !n.readBy.includes(adminId) ? { ...n, readBy: [...n.readBy, adminId] } : n
      )
    }));
  };

  const unreadAdminNotificationsCount = (db.adminNotifications || []).filter(
    n => !n.readBy.includes(currentAdmin?.id || 'adm-1')
  ).length;

  // TEACHER UPLOAD MANAGEMENT
  const uploadTeacherContent = async (
    content: Omit<TeacherContentItem, 'id' | 'uploadDate' | 'totalViews' | 'uniqueViewers' | 'downloadCount'>
  ): Promise<{ success: boolean; message?: string; content?: TeacherContentItem }> => {
    try {
      const res = await fetch('/api/content/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message };

      if (data.content) {
        setDb(prev => ({
          ...prev,
          teacherContents: [data.content, ...(prev.teacherContents || [])]
        }));
      }

      return { success: true, message: data.message, content: data.content };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const updateTeacherContent = async (id: string, updates: Partial<TeacherContentItem>) => {
    try {
      await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setDb(prev => ({
        ...prev,
        teacherContents: (prev.teacherContents || []).map(c => c.id === id ? { ...c, ...updates } : c)
      }));
    } catch {}
  };

  const deleteTeacherContent = async (id: string) => {
    try {
      await fetch(`/api/content/${id}`, { method: 'DELETE' });
      setDb(prev => ({
        ...prev,
        teacherContents: (prev.teacherContents || []).filter(c => c.id !== id)
      }));
    } catch {}
  };

  // CONTENT VIEW TRACKING
  const trackContentView = async (
    contentId: string,
    studentId?: string,
    studentName?: string,
    stdClass?: string,
    section?: string
  ) => {
    try {
      const sId = studentId || currentStudent?.id || 'std-1';
      const sName = studentName || currentStudent?.name || 'Ahmed Khan';
      const sClass = stdClass || currentStudent?.class || '1st Year';
      const sSec = section || currentStudent?.section || 'CB1';

      const res = await fetch(`/api/content/${contentId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: sId, studentName: sName, class: sClass, section: sSec })
      });

      if (res.ok) {
        const data = await res.json();
        setDb(prev => ({
          ...prev,
          teacherContents: (prev.teacherContents || []).map(c =>
            c.id === contentId ? { ...c, totalViews: data.totalViews, uniqueViewers: data.uniqueViewers } : c
          )
        }));
      }
    } catch {}
  };

  // SETTINGS & SYSTEM ACTIONS
  const updateSystemSettings = (settings: Partial<CollegeSettings>) => {
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(() => {});

    setDb(prev => ({
      ...prev,
      systemSettings: { ...(prev.systemSettings || INITIAL_COLLEGE_DB.systemSettings!), ...settings }
    }));
  };

  const deleteStudent = (id: string) => {
    fetch(`/api/admin/students/${id}`, { method: 'DELETE' }).catch(() => {});
    setDb(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id && s.roll !== id)
    }));
  };

  const deleteTeacher = (id: string) => {
    fetch(`/api/admin/teachers/${id}`, { method: 'DELETE' }).catch(() => {});
    setDb(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));
  };

  // Compatibility helpers
  const approveStudent = (idOrToken: string): { success: boolean; message: string } => {
    approveApplication(idOrToken);
    return { success: true, message: 'Student approval request submitted.' };
  };

  const rejectStudent = (idOrToken: string, reason?: string): { success: boolean; message: string } => {
    rejectApplication(idOrToken, reason);
    return { success: true, message: 'Student rejection request submitted.' };
  };

  const updatePrincipalMobile = (mobileNumber: string): { success: boolean; message: string } => {
    fetch('/api/config/principal-mobile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber })
    }).catch(() => {});
    return { success: true, message: `Principal Mobile Number updated to ${mobileNumber}` };
  };

  const verifyApprovalToken = (token: string): StudentItem | null => {
    return db.students.find(s => s.approvalToken === token || s.id === token) || null;
  };

  // Existing methods preserved
  const updateContact = (contact: Partial<ContactInfo>) => {
    setDb(prev => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  };

  const updatePrincipal = (principal: Partial<PrincipalInfo>) => {
    setDb(prev => ({ ...prev, principal: { ...prev.principal, ...principal } }));
  };

  const updateBranding = (title: string, logoUrl = '') => {
    setDb(prev => ({ ...prev, branding: { title, logoUrl } }));
  };

  const updateAdminAuth = (adminUser: string, adminPass: string) => {
    setDb(prev => ({ ...prev, auth: { adminUser, adminPass } }));
  };

  const addSection = (sec: Omit<SectionItem, 'id'>): boolean => {
    const id = `sec-${Date.now()}`;
    setDb(prev => ({ ...prev, sections: [...prev.sections, { ...sec, id }] }));
    return true;
  };

  const deleteSection = (id: string) => {
    setDb(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  const markAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === studentId ? { ...s, attendanceStatus: status } : s)
    }));
  };

  const addTeacher = (tea: Omit<TeacherItem, 'id'>) => {
    const id = `t-${Date.now()}`;
    setDb(prev => ({ ...prev, teachers: [...prev.teachers, { ...tea, id }] }));
    return { success: true };
  };

  const addMaterial = (mat: Omit<MaterialItem, 'id' | 'date'>) => {
    const id = `mat-${Date.now()}`;
    setDb(prev => ({
      ...prev,
      materials: [{ ...mat, id, date: 'Just now' }, ...prev.materials]
    }));
  };

  const deleteMaterial = (id: string) => {
    setDb(prev => ({ ...prev, materials: prev.materials.filter(m => m.id !== id) }));
  };

  const addAnnouncement = (ann: Omit<AnnouncementItem, 'id' | 'date'>) => {
    const id = `an-${Date.now()}`;
    setDb(prev => ({
      ...prev,
      announcements: [{ ...ann, id, date: 'Today' }, ...prev.announcements]
    }));
  };

  const deleteAnnouncement = (id: string) => {
    setDb(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const id = `g-${Date.now()}`;
    setDb(prev => ({ ...prev, gallery: [{ ...item, id }, ...prev.gallery] }));
  };

  const deleteGalleryItem = (id: string) => {
    setDb(prev => ({ ...prev, gallery: prev.gallery.filter(g => g.id !== id) }));
  };

  const addInquiry = (inq: Omit<InquiryItem, 'id' | 'date' | 'status'>) => {
    const id = `inq-${Date.now()}`;
    setDb(prev => ({
      ...prev,
      inquiries: [{ ...inq, id, date: 'Today', status: 'New' }, ...prev.inquiries]
    }));
  };

  const updateInquiryStatus = (id: string, status: 'New' | 'Replied' | 'Pending') => {
    setDb(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(i => i.id === id ? { ...i, status } : i)
    }));
  };

  const deleteInquiry = (id: string) => {
    setDb(prev => ({ ...prev, inquiries: prev.inquiries.filter(i => i.id !== id) }));
  };

  const addLocation = (loc: Omit<LocationItem, 'id'>) => {
    const id = `loc-${Date.now()}`;
    setDb(prev => ({ ...prev, locations: [...(prev.locations || []), { ...loc, id }] }));
  };

  const updateLocation = (id: string, loc: Partial<LocationItem>) => {
    setDb(prev => ({
      ...prev,
      locations: (prev.locations || []).map(l => l.id === id ? { ...l, ...loc } : l)
    }));
  };

  const deleteLocation = (id: string) => {
    setDb(prev => ({ ...prev, locations: (prev.locations || []).filter(l => l.id !== id) }));
  };

  const exportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kips_portal_backup_${new Date().toISOString().split('T')[0]}.json`);
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
    } catch {}
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
        currentAdmin,
        setCurrentAdmin,
        currentUserToken,

        applications: db.applications || INITIAL_COLLEGE_DB.applications || [],
        adminNotifications: db.adminNotifications || INITIAL_COLLEGE_DB.adminNotifications || [],
        studentNotifications: db.studentNotifications || INITIAL_COLLEGE_DB.studentNotifications || [],
        teacherContents: db.teacherContents || INITIAL_COLLEGE_DB.teacherContents || [],
        contentViews: db.contentViews || INITIAL_COLLEGE_DB.contentViews || [],
        auditLogs: db.auditLogs || INITIAL_COLLEGE_DB.auditLogs || [],
        adminUsers: db.adminUsers || INITIAL_COLLEGE_DB.adminUsers || [],
        activeSessions: db.activeSessions || INITIAL_COLLEGE_DB.activeSessions || [],
        systemSettings: db.systemSettings || INITIAL_COLLEGE_DB.systemSettings!,

        login,
        logout,
        revokeOtherSessions,
        registerStudentRequest,
        approveApplication,
        rejectApplication,
        markApplicationUnderReview,
        markAdminNotificationRead,
        markAllAdminNotificationsRead,
        unreadAdminNotificationsCount,
        uploadTeacherContent,
        updateTeacherContent,
        deleteTeacherContent,
        trackContentView,
        updateSystemSettings,
        deleteStudent,
        deleteTeacher,

        updateContact,
        updatePrincipal,
        updateBranding,
        updateAdminAuth,
        addSection,
        deleteSection,
        markAttendance,
        addTeacher,
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
        resetDatabase,
        approveStudent,
        rejectStudent,
        updatePrincipalMobile,
        verifyApprovalToken
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
