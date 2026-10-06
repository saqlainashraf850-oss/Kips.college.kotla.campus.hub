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
  LocationItem
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
  login: (role: 'student' | 'teacher' | 'admin', identifier: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updatePrincipal: (principal: Partial<PrincipalInfo>) => void;
  updateBranding: (title: string, logoUrl?: string) => void;
  updateAdminAuth: (adminUser: string, adminPass: string) => void;
  addSection: (sec: Omit<SectionItem, 'id'>) => boolean;
  deleteSection: (id: string) => void;
  addStudent: (std: Omit<StudentItem, 'id'>) => { success: boolean; message?: string };
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
        return {
          ...INITIAL_COLLEGE_DB,
          ...parsed,
          locations: parsed.locations || INITIAL_COLLEGE_DB.locations,
          gallery: parsed.gallery || INITIAL_COLLEGE_DB.gallery
        };
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    return INITIAL_COLLEGE_DB;
  });

  const [activeView, setActiveView] = useState<'public' | 'student' | 'teacher' | 'admin' | 'login'>('public');
  const [activeLoginRole, setActiveLoginRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [currentStudent, setCurrentStudent] = useState<StudentItem | null>(() => db.students[0] || null);
  const [currentTeacher, setCurrentTeacher] = useState<TeacherItem | null>(() => db.teachers[0] || null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [db]);

  const login = (role: 'student' | 'teacher' | 'admin', identifier: string, password = ''): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (role === 'admin') {
      if (cleanId === db.auth.adminUser.toLowerCase() && cleanPass === db.auth.adminPass) {
        setActiveView('admin');
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin username or password.' };
    }

    if (role === 'student') {
      const found = db.students.find(s => 
        s.email.toLowerCase() === cleanId ||
        s.cardId.toLowerCase() === cleanId ||
        s.roll.toLowerCase() === cleanId
      );
      if (!found) {
        return { success: false, message: 'No student found with this Card ID or Gmail.' };
      }
      // If student logs in via scanned card, password might match or be verified
      if (cleanPass && found.pass !== cleanPass) {
        return { success: false, message: 'Incorrect student password.' };
      }
      setCurrentStudent(found);
      setActiveView('student');
      return { success: true };
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

  const addStudent = (std: Omit<StudentItem, 'id'>): { success: boolean; message?: string } => {
    if (db.students.some(s => s.email.toLowerCase() === std.email.toLowerCase())) {
      return { success: false, message: 'A student with this Gmail address already exists.' };
    }
    if (db.students.some(s => s.cardId.toLowerCase() === std.cardId.toLowerCase())) {
      return { success: false, message: 'A student with this Card ID already exists.' };
    }

    const newStudent: StudentItem = {
      ...std,
      id: `std-${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setDb(prev => ({
      ...prev,
      students: [newStudent, ...prev.students]
    }));
    return { success: true };
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
        addStudent,
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
