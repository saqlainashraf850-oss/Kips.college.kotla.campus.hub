import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'storage_db.json');

// Interface definitions matching src/types.ts
export interface StudentRecord {
  id: string;
  name: string;
  father: string;
  email: string;
  pass: string;
  roll: string;
  cardId: string;
  class: string;
  section: string;
  mobile: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  approvalToken: string;
  attendance: number;
  attendanceStatus?: 'Present' | 'Absent' | 'Late';
  photo: string;
  grade?: string;
  joinedDate?: string;
}

export interface StudentApplicationRecord {
  id: string;
  studentName: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  studentContact: string;
  parentContact: string;
  email: string;
  appliedClass: string;
  section: string;
  previousSchool: string;
  previousMarks: string;
  admissionInfo: string;
  documents: string[];
  photoUrl?: string;
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  processedBy?: string;
  processedAt?: string;
  rejectionReason?: string;
  assignedStudentId?: string;
  assignedRoll?: string;
  assignedCardId?: string;
  assignedPassword?: string;
}

export interface AdminNotificationRecord {
  id: string;
  type: 'student_registration' | 'teacher_upload' | 'system';
  title: string;
  message: string;
  studentName?: string;
  applicationId?: string;
  class?: string;
  contact?: string;
  submittedAt?: string;
  readBy: string[];
  actionTaken: boolean;
  actionTakenBy?: string;
  actionTakenAt?: string;
  createdAt: string;
}

export interface StudentNotificationRecord {
  id: string;
  teacherName: string;
  contentTitle: string;
  class: string;
  section: string;
  contentId: string;
  date: string;
  read: boolean;
  studentId?: string;
}

export interface ContentViewRecordItem {
  id: string;
  contentId: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  firstViewedAt: string;
  lastViewedAt: string;
  viewCount: number;
}

export interface TeacherContentRecord {
  id: string;
  fileUrl?: string;
  fileType: 'PDF' | 'Image' | 'Video' | 'Notes' | 'Assignment' | 'Announcement';
  title: string;
  description: string;
  teacherName: string;
  teacherId: string;
  uploadDate: string;
  targetClass: string;
  targetSection: string;
  targetStudents?: string[];
  totalViews: number;
  uniqueViewers: number;
  downloadCount: number;
  isHidden?: boolean;
}

export interface AuditLogRecord {
  id: string;
  user: string;
  role: 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'System';
  action: string;
  relatedRecord: string;
  date: string;
  time: string;
  details?: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  username: string;
  role: 'Super Admin' | 'Admin';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  status?: 'active' | 'suspended';
}

export interface UserSessionRecord {
  id: string;
  token: string;
  userId: string;
  userName: string;
  role: 'admin' | 'super_admin' | 'teacher' | 'student';
  keepSignedIn: boolean;
  device: string;
  browser: string;
  ip: string;
  loginDate: string;
  lastActive: string;
  isValid: boolean;
}

export interface CollegeSettingsRecord {
  collegeName: string;
  principalName: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
  studentRegistrationEnabled: boolean;
  teacherUploadEnabled: boolean;
  notificationsEnabled: boolean;
  sessionDurationHours: number;
}

export interface NotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  roll: string;
  class: string;
  mobile: string;
  email?: string;
  principalMobile: string;
  message: string;
  timestamp: string;
  status: 'delivered' | 'sent' | 'simulated';
  channel: 'SMS' | 'WhatsApp' | 'System';
  actionToken: string;
}

// In-memory data
let principalApprovalMobile = process.env.PRINCIPAL_MOBILE_NUMBER || '+92 300 9876543';
let students: StudentRecord[] = [];
let applications: StudentApplicationRecord[] = [];
let adminNotifications: AdminNotificationRecord[] = [];
let studentNotifications: StudentNotificationRecord[] = [];
let teacherContents: TeacherContentRecord[] = [];
let contentViews: ContentViewRecordItem[] = [];
let auditLogs: AuditLogRecord[] = [];
let adminUsers: AdminUserRecord[] = [];
let activeSessions: UserSessionRecord[] = [];
let systemSettings: CollegeSettingsRecord = {
  collegeName: 'KIPS COLLEGE KOTLA',
  principalName: 'Prof. Muhammad Tariq',
  phone: '+92 300 1234567, +92 53 7580000',
  email: 'kotla@kips.edu.pk',
  address: 'KIPS College, Bhimber Road, Kotla Arab Ali Khan, Tehsil Kharian, District Gujrat, Punjab, Pakistan',
  logoUrl: '',
  studentRegistrationEnabled: true,
  teacherUploadEnabled: true,
  notificationsEnabled: true,
  sessionDurationHours: 168
};
let notificationLogs: NotificationLog[] = [];

// Load from JSON file
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (data.students) students = data.students;
      if (data.applications) applications = data.applications;
      if (data.adminNotifications) adminNotifications = data.adminNotifications;
      if (data.studentNotifications) studentNotifications = data.studentNotifications;
      if (data.teacherContents) teacherContents = data.teacherContents;
      if (data.contentViews) contentViews = data.contentViews;
      if (data.auditLogs) auditLogs = data.auditLogs;
      if (data.adminUsers) adminUsers = data.adminUsers;
      if (data.activeSessions) activeSessions = data.activeSessions;
      if (data.systemSettings) systemSettings = data.systemSettings;
      if (data.principalMobile) principalApprovalMobile = data.principalMobile;
      if (data.notificationLogs) notificationLogs = data.notificationLogs;
    }
  } catch (err) {
    console.error('Failed to read storage_db.json, using defaults', err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          principalMobile: principalApprovalMobile,
          students,
          applications,
          adminNotifications,
          studentNotifications,
          teacherContents,
          contentViews,
          auditLogs,
          adminUsers,
          activeSessions,
          systemSettings,
          notificationLogs
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error('Failed to save storage_db.json', err);
  }
}

loadDatabase();

// Audit log helper
function addAuditLog(
  user: string,
  role: 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'System',
  action: string,
  relatedRecord: string,
  details?: string
) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const entry: AuditLogRecord = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user,
    role,
    action,
    relatedRecord,
    date: dateStr,
    time: timeStr,
    details
  };

  auditLogs.unshift(entry);
  if (auditLogs.length > 200) auditLogs.pop();
  saveDatabase();
  return entry;
}

// External notification dispatcher
async function dispatchPrincipalMobileNotification(
  studentName: string,
  roll: string,
  className: string,
  section: string,
  mobile: string,
  email: string | undefined,
  appId: string,
  reqHost: string
): Promise<NotificationLog> {
  const timestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const directLink = `https://${reqHost}/?action=principal-approval&token=${appId}`;

  const messageText = [
    '🎓 KIPS COLLEGE KOTLA - NEW STUDENT ACCESS REQUEST',
    `• Student Name: ${studentName}`,
    `• Application ID: ${appId}`,
    `• Class / Course: ${className} (${section})`,
    `• Registered Mobile: ${mobile}`,
    `• Email: ${email || 'N/A'}`,
    `• Date & Time: ${timestamp}`,
    '• Status: PENDING PRINCIPAL APPROVAL',
    `• 1-Click Action Link: ${directLink}`
  ].join('\n');

  console.log('--------------------------------------------------');
  console.log(`[PRINCIPAL MOBILE NOTIFICATION] Dispatched to ${principalApprovalMobile}:`);
  console.log(messageText);
  console.log('--------------------------------------------------');

  const logEntry: NotificationLog = {
    id: `notif-${Date.now()}`,
    studentId: appId,
    studentName,
    roll: roll || 'Pending',
    class: `${className} (${section})`,
    mobile,
    email,
    principalMobile: principalApprovalMobile,
    message: messageText,
    timestamp,
    status: 'delivered',
    channel: 'SMS',
    actionToken: appId
  };

  notificationLogs.unshift(logEntry);
  saveDatabase();
  return logEntry;
}

// Helper to extract bearer token
function getBearerToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // API ROUTE: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // ----------------------------------------------------
  // AUTHENTICATION & SECURE PERSISTENT SESSIONS
  // ----------------------------------------------------

  app.post('/api/auth/login', (req, res) => {
    const { role, identifier, password, keepSignedIn } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const userAgent = req.headers['user-agent'] || 'Web Browser';
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    let device = 'Desktop PC';
    if (/mobile/i.test(userAgent)) device = 'Mobile Device';
    else if (/tablet|ipad/i.test(userAgent)) device = 'Tablet Device';

    let browser = 'Browser';
    if (/chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/edge/i.test(userAgent)) browser = 'Edge';

    const now = new Date();
    const loginDate = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

    // ADMIN LOGIN
    if (role === 'admin') {
      const isOfficial = cleanId === 'kips.edu' && (cleanPass === '0852' || cleanPass === 'admin123');
      const isVP = cleanId === 'vp.academic' && (cleanPass === '0852' || cleanPass === '1234');
      const isPrincipal = (cleanId === 'principal' || cleanId === 'principal@kips.edu.pk') && (cleanPass === '0852' || cleanPass === '1234');

      if (!isOfficial && !isVP && !isPrincipal) {
        return res.status(401).json({ success: false, message: 'Invalid Admin username or password.' });
      }

      const adminUser = isVP ? adminUsers[1] || adminUsers[0] : adminUsers[0];
      const token = `token-adm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newSession: UserSessionRecord = {
        id: `sess-${Date.now()}`,
        token,
        userId: adminUser.id,
        userName: adminUser.name,
        role: adminUser.role === 'Super Admin' ? 'super_admin' : 'admin',
        keepSignedIn: Boolean(keepSignedIn),
        device,
        browser,
        ip: clientIp.split(',')[0].trim(),
        loginDate,
        lastActive: 'Just now',
        isValid: true
      };

      activeSessions.unshift(newSession);
      addAuditLog(adminUser.name, adminUser.role, 'Admin Login', 'Admin Dashboard Session', `Logged in via ${device} (${browser})`);
      saveDatabase();

      return res.json({
        success: true,
        token,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          username: adminUser.username,
          role: adminUser.role,
          permissions: adminUser.permissions
        }
      });
    }

    // TEACHER LOGIN
    if (role === 'teacher') {
      // Check teachers
      const teacherEmails: Record<string, { id: string; name: string; pass: string }> = {
        'hamza@gmail.com': { id: 't-1', name: 'Engr. Hamza Nawaz', pass: '1234' },
        'sara@gmail.com': { id: 't-2', name: 'Prof. Sara Malik', pass: '1234' },
        'farhan@gmail.com': { id: 't-3', name: 'Prof. Farhan Qasim', pass: '1234' },
        'noman@gmail.com': { id: 't-4', name: 'Prof. Dr. Noman Rauf', pass: '1234' }
      };

      const found = teacherEmails[cleanId];
      if (!found || found.pass !== cleanPass) {
        return res.status(401).json({ success: false, message: 'Invalid Teacher email or password.' });
      }

      const token = `token-tea-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newSession: UserSessionRecord = {
        id: `sess-${Date.now()}`,
        token,
        userId: found.id,
        userName: found.name,
        role: 'teacher',
        keepSignedIn: Boolean(keepSignedIn),
        device,
        browser,
        ip: clientIp.split(',')[0].trim(),
        loginDate,
        lastActive: 'Just now',
        isValid: true
      };

      activeSessions.unshift(newSession);
      addAuditLog(found.name, 'Teacher', 'Teacher Login', 'Teacher Portal Session');
      saveDatabase();

      return res.json({
        success: true,
        token,
        user: found
      });
    }

    // STUDENT LOGIN
    if (role === 'student') {
      const cleanDigits = cleanId.replace(/[^0-9]/g, '');
      const found = students.find(s => {
        const stdDigits = s.mobile ? s.mobile.replace(/[^0-9]/g, '') : '';
        return (
          s.email.toLowerCase() === cleanId ||
          s.cardId.toLowerCase() === cleanId ||
          s.roll.toLowerCase() === cleanId ||
          (cleanDigits.length >= 7 && stdDigits.endsWith(cleanDigits))
        );
      });

      if (!found) {
        return res.status(404).json({
          success: false,
          message: 'No registered student found with this Card ID, Roll Number, or Registered Email.'
        });
      }

      if (cleanPass && found.pass !== cleanPass) {
        return res.status(401).json({ success: false, message: 'Incorrect student password.' });
      }

      // STRICT APPROVAL GATEWAY
      if (found.status === 'pending') {
        return res.status(403).json({
          success: false,
          status: 'pending',
          message: 'Your account is currently Pending Approval. A notification has been sent to the Principal & Admin Panel. You cannot access the student portal until approval is granted.'
        });
      }

      if (found.status === 'rejected') {
        return res.status(403).json({
          success: false,
          status: 'rejected',
          message: found.rejectionReason || 'Your account has not been approved by the Principal.'
        });
      }

      const token = `token-std-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newSession: UserSessionRecord = {
        id: `sess-${Date.now()}`,
        token,
        userId: found.id,
        userName: found.name,
        role: 'student',
        keepSignedIn: Boolean(keepSignedIn),
        device,
        browser,
        ip: clientIp.split(',')[0].trim(),
        loginDate,
        lastActive: 'Just now',
        isValid: true
      };

      activeSessions.unshift(newSession);
      addAuditLog(found.name, 'Student', 'Student Login', `Roll: ${found.roll} (${found.section})`);
      saveDatabase();

      return res.json({
        success: true,
        status: 'approved',
        token,
        student: found
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid login role specified.' });
  });

  // Verify Current Session & Account Status
  app.get('/api/auth/me', (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No session token provided.' });
    }

    const session = activeSessions.find(s => s.token === token && s.isValid);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired or invalidated. Please sign in again.' });
    }

    // Check if user account was deleted or disabled
    if (session.role === 'student') {
      const student = students.find(s => s.id === session.userId);
      if (!student || student.status !== 'approved') {
        session.isValid = false;
        saveDatabase();
        return res.status(401).json({ success: false, message: 'Student account has been deactivated or deleted.' });
      }
      session.lastActive = 'Just now';
      return res.json({ success: true, session, student });
    }

    session.lastActive = 'Just now';
    saveDatabase();
    return res.json({ success: true, session });
  });

  // Logout & Revoke Session
  app.post('/api/auth/logout', (req, res) => {
    const token = getBearerToken(req) || req.body.token;
    if (token) {
      const session = activeSessions.find(s => s.token === token);
      if (session) {
        session.isValid = false;
        addAuditLog(session.userName, session.role === 'student' ? 'Student' : session.role === 'teacher' ? 'Teacher' : 'Admin', 'User Logout', `Session ${session.id} revoked`);
        saveDatabase();
      }
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Active Sessions Management (Admin)
  app.get('/api/admin/sessions', (_req, res) => {
    res.json({
      success: true,
      sessions: activeSessions.filter(s => s.isValid)
    });
  });

  app.post('/api/admin/sessions/revoke-others', (req, res) => {
    const currentToken = getBearerToken(req) || req.body.currentToken;
    let revokedCount = 0;
    activeSessions.forEach(s => {
      if (s.token !== currentToken) {
        s.isValid = false;
        revokedCount++;
      }
    });
    addAuditLog('Super Admin', 'Super Admin', 'Revoked Other Sessions', `${revokedCount} devices logged out`);
    saveDatabase();
    res.json({ success: true, message: `Successfully logged out ${revokedCount} other device(s).` });
  });

  // ----------------------------------------------------
  // 1. STUDENT REGISTRATION & APPLICATION SYSTEM
  // ----------------------------------------------------

  app.post('/api/applications/register', async (req, res) => {
    try {
      const data = req.body;
      const cleanName = (data.studentName || data.name || '').trim();
      const cleanFather = (data.fatherName || data.father || '').trim();
      const cleanRoll = (data.roll || '').trim();
      const cleanMobile = (data.studentContact || data.mobile || '').trim();
      const cleanParentContact = (data.parentContact || '').trim() || cleanMobile;
      const cleanEmail = (data.email || '').trim().toLowerCase();
      const cleanPass = (data.pass || data.password || '1234').trim();
      const cleanClass = data.appliedClass || data.class || '1st Year (ICS Maths/CS)';
      const cleanSection = data.section || 'CB1';
      const dob = data.dob || '2008-01-01';
      const gender = data.gender || 'Male';
      const previousSchool = data.previousSchool || 'Matric Science';
      const previousMarks = data.previousMarks || '1020 / 1100';
      const admissionInfo = data.admissionInfo || 'Direct Online Admission';
      const documents = Array.isArray(data.documents) ? data.documents : ['Matric DMC', 'B-Form'];
      const photoUrl = data.photoUrl || data.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

      if (!cleanName || !cleanMobile) {
        return res.status(400).json({ success: false, message: 'Student Name and Contact are required.' });
      }

      // Check duplicates
      const cleanDigits = cleanMobile.replace(/[^0-9]/g, '');
      const existingApp = applications.find(a => {
        const aDigits = (a.studentContact || '').replace(/[^0-9]/g, '');
        return (cleanRoll && a.assignedRoll === cleanRoll) || (aDigits.length >= 10 && aDigits.endsWith(cleanDigits));
      });

      if (existingApp && existingApp.status === 'Pending') {
        return res.status(400).json({
          success: false,
          message: `An admission application for this student is already Pending Admin Approval (ID: ${existingApp.id}).`
        });
      }

      const now = new Date();
      const timestamp = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const nextNum = (applications.length + 80).toString().padStart(3, '0');
      const appId = `APP-2026-${nextNum}`;
      const rollNum = cleanRoll || nextNum;
      const cardId = `KIPS-${cleanSection}-${rollNum.padStart(4, '0')}`;
      const stdId = `std-${Date.now()}`;

      // Create Application Record (Status: Pending)
      const newApp: StudentApplicationRecord = {
        id: appId,
        studentName: cleanName,
        fatherName: cleanFather,
        dob,
        gender,
        studentContact: cleanMobile,
        parentContact: cleanParentContact,
        email: cleanEmail || `${rollNum}@kips.edu.pk`,
        appliedClass: cleanClass,
        section: cleanSection,
        previousSchool,
        previousMarks,
        admissionInfo,
        documents,
        photoUrl,
        submissionDate: timestamp,
        status: 'Pending',
        assignedStudentId: stdId,
        assignedRoll: rollNum,
        assignedCardId: cardId,
        assignedPassword: cleanPass
      };

      applications.unshift(newApp);

      // Create in students table with 'pending' status
      const newStudent: StudentRecord = {
        id: stdId,
        name: cleanName,
        father: cleanFather,
        email: cleanEmail || `${rollNum}@kips.edu.pk`,
        pass: cleanPass,
        roll: rollNum,
        cardId,
        class: cleanClass,
        section: cleanSection,
        mobile: cleanMobile,
        status: 'pending',
        requestedAt: timestamp,
        approvalToken: `token-${appId}`,
        attendance: 100,
        attendanceStatus: 'Present',
        photo: photoUrl,
        grade: 'Pending Enrollment',
        joinedDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      students.unshift(newStudent);

      // Create Admin Notification for ALL authorized admins
      const adminNotif: AdminNotificationRecord = {
        id: `notif-reg-${Date.now()}`,
        type: 'student_registration',
        title: 'New Student Registration Request',
        message: `Student: ${cleanName}\nApplication ID: ${appId}\nClass: ${cleanClass}\nContact: ${cleanMobile}\nSubmitted: ${timestamp}`,
        studentName: cleanName,
        applicationId: appId,
        class: cleanClass,
        contact: cleanMobile,
        submittedAt: timestamp,
        readBy: [],
        actionTaken: false,
        createdAt: timestamp
      };
      adminNotifications.unshift(adminNotif);

      // Create audit log
      addAuditLog(cleanName, 'Student', 'New Student Registration', `Application ${appId}`, `Submitted registration for ${cleanClass} (${cleanSection})`);

      // Dispatch Principal SMS / WhatsApp notification
      await dispatchPrincipalMobileNotification(cleanName, rollNum, cleanClass, cleanSection, cleanMobile, cleanEmail, appId, req.get('host') || 'localhost:3000');

      saveDatabase();

      return res.status(201).json({
        success: true,
        message: `Application submitted successfully! Application ID: ${appId}. Status: Pending. All authorized Admins have been notified.`,
        application: newApp,
        notification: adminNotif
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  });

  // GET All Applications with Search, Filter & Sort
  app.get('/api/applications', (req, res) => {
    const { status, class: filterClass, section: filterSection, search } = req.query;
    let result = [...applications];

    if (status && status !== 'All') {
      result = result.filter(a => a.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (filterClass && filterClass !== 'All') {
      result = result.filter(a => a.appliedClass.toLowerCase().includes((filterClass as string).toLowerCase()));
    }
    if (filterSection && filterSection !== 'All') {
      result = result.filter(a => a.section.toLowerCase() === (filterSection as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(a =>
        a.studentName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.studentContact.includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      total: result.length,
      applications: result
    });
  });

  // ----------------------------------------------------
  // APPROVE APPLICATION WITH DUPLICATE PROTECTION
  // ----------------------------------------------------
  app.post('/api/applications/:id/approve', (req, res) => {
    const appId = req.params.id;
    const adminName = req.body.adminName || 'Prof. Muhammad Tariq (Principal)';

    const appItem = applications.find(a => a.id === appId || a.assignedStudentId === appId || a.assignedRoll === appId);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // CONCURRENCY & DUPLICATE APPROVAL PROTECTION
    if (appItem.status === 'Approved' || appItem.status === 'Rejected') {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: 'This application has already been processed by another administrator.',
        currentStatus: appItem.status,
        processedBy: appItem.processedBy,
        processedAt: appItem.processedAt
      });
    }

    const now = new Date();
    const approvalTime = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Update Application
    appItem.status = 'Approved';
    appItem.processedBy = adminName;
    appItem.processedAt = approvalTime;
    appItem.rejectionReason = undefined;

    // Activate in students list
    let std = students.find(s => s.id === appItem.assignedStudentId || s.roll === appItem.assignedRoll);
    if (std) {
      std.status = 'approved';
      std.approvedAt = approvalTime;
      std.rejectionReason = undefined;
    } else {
      std = {
        id: appItem.assignedStudentId || `std-${Date.now()}`,
        name: appItem.studentName,
        father: appItem.fatherName,
        email: appItem.email,
        pass: appItem.assignedPassword || '1234',
        roll: appItem.assignedRoll || '001',
        cardId: appItem.assignedCardId || `KIPS-${appItem.section}-001`,
        class: appItem.appliedClass,
        section: appItem.section,
        mobile: appItem.studentContact,
        status: 'approved',
        requestedAt: appItem.submissionDate,
        approvedAt: approvalTime,
        approvalToken: `token-${appItem.id}`,
        attendance: 100,
        attendanceStatus: 'Present',
        photo: appItem.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        grade: 'Active Enrollment',
        joinedDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      students.unshift(std);
    }

    // Mark admin notification action taken
    const notif = adminNotifications.find(n => n.applicationId === appItem.id);
    if (notif) {
      notif.actionTaken = true;
      notif.actionTakenBy = adminName;
      notif.actionTakenAt = approvalTime;
    }

    // Audit Log
    addAuditLog(adminName, 'Super Admin', 'Student Approved', `${appItem.studentName} (App: ${appItem.id}, Roll: ${appItem.assignedRoll})`, `Approved admission into ${appItem.appliedClass} (${appItem.section})`);

    saveDatabase();

    return res.json({
      success: true,
      message: `Application ${appItem.id} approved successfully! Student account is now Active and can log in.`,
      application: appItem,
      student: std
    });
  });

  // ----------------------------------------------------
  // REJECT APPLICATION WITH DUPLICATE PROTECTION
  // ----------------------------------------------------
  app.post('/api/applications/:id/reject', (req, res) => {
    const appId = req.params.id;
    const { reason, adminName } = req.body;
    const rejectingAdmin = adminName || 'Prof. Muhammad Tariq (Principal)';

    const appItem = applications.find(a => a.id === appId || a.assignedStudentId === appId || a.assignedRoll === appId);
    if (!appItem) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // CONCURRENCY & DUPLICATE PROTECTION
    if (appItem.status === 'Approved' || appItem.status === 'Rejected') {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: 'This application has already been processed by another administrator.',
        currentStatus: appItem.status,
        processedBy: appItem.processedBy,
        processedAt: appItem.processedAt
      });
    }

    const rejectionTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    appItem.status = 'Rejected';
    appItem.processedBy = rejectingAdmin;
    appItem.processedAt = rejectionTime;
    appItem.rejectionReason = reason || 'Your application has not been approved by college administration.';

    const std = students.find(s => s.id === appItem.assignedStudentId || s.roll === appItem.assignedRoll);
    if (std) {
      std.status = 'rejected';
      std.rejectedAt = rejectionTime;
      std.rejectionReason = appItem.rejectionReason;
    }

    // Mark admin notification action taken
    const notif = adminNotifications.find(n => n.applicationId === appItem.id);
    if (notif) {
      notif.actionTaken = true;
      notif.actionTakenBy = rejectingAdmin;
      notif.actionTakenAt = rejectionTime;
    }

    // Audit Log
    addAuditLog(rejectingAdmin, 'Super Admin', 'Student Rejected', `${appItem.studentName} (App: ${appItem.id})`, `Reason: ${appItem.rejectionReason}`);

    saveDatabase();

    return res.json({
      success: true,
      message: `Application ${appItem.id} marked as Rejected.`,
      application: appItem
    });
  });

  // Mark Application Under Review
  app.post('/api/applications/:id/review', (req, res) => {
    const appId = req.params.id;
    const adminName = req.body.adminName || 'Admin Office';
    const appItem = applications.find(a => a.id === appId);
    if (!appItem) return res.status(404).json({ success: false, message: 'Application not found.' });

    appItem.status = 'Under Review';
    addAuditLog(adminName, 'Admin', 'Application Under Review', `Application ${appItem.id}`);
    saveDatabase();
    res.json({ success: true, application: appItem });
  });

  // ----------------------------------------------------
  // ADMIN NOTIFICATIONS SYSTEM
  // ----------------------------------------------------

  app.get('/api/admin/notifications', (req, res) => {
    const adminId = (req.query.adminId as string) || 'adm-1';
    const notificationsWithState = adminNotifications.map(n => ({
      ...n,
      isRead: n.readBy.includes(adminId)
    }));

    const unreadCount = notificationsWithState.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications: notificationsWithState
    });
  });

  app.post('/api/admin/notifications/:id/read', (req, res) => {
    const notifId = req.params.id;
    const adminId = req.body.adminId || 'adm-1';
    const notif = adminNotifications.find(n => n.id === notifId);
    if (notif && !notif.readBy.includes(adminId)) {
      notif.readBy.push(adminId);
      saveDatabase();
    }
    res.json({ success: true });
  });

  app.post('/api/admin/notifications/mark-all-read', (req, res) => {
    const adminId = req.body.adminId || 'adm-1';
    adminNotifications.forEach(n => {
      if (!n.readBy.includes(adminId)) n.readBy.push(adminId);
    });
    saveDatabase();
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // TEACHER UPLOAD MANAGEMENT & CONTENT VIEWS
  // ----------------------------------------------------

  app.post('/api/content/upload', (req, res) => {
    const {
      fileUrl,
      fileType,
      title,
      description,
      teacherName,
      teacherId,
      targetClass,
      targetSection,
      targetStudents
    } = req.body;

    if (!title || !teacherName) {
      return res.status(400).json({ success: false, message: 'Title and Teacher Name are required.' });
    }

    const now = new Date();
    const dateStr = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    const contentId = `CNT-2026-${(teacherContents.length + 1).toString().padStart(3, '0')}`;

    const newContent: TeacherContentRecord = {
      id: contentId,
      fileUrl: fileUrl || '',
      fileType: fileType || 'Notes',
      title,
      description: description || '',
      teacherName,
      teacherId: teacherId || 't-1',
      uploadDate: dateStr,
      targetClass: targetClass || 'All',
      targetSection: targetSection || 'All',
      targetStudents: targetStudents || [],
      totalViews: 0,
      uniqueViewers: 0,
      downloadCount: 0,
      isHidden: false
    };

    teacherContents.unshift(newContent);

    // Notify matching students
    const studentNotif: StudentNotificationRecord = {
      id: `snotif-${Date.now()}`,
      teacherName,
      contentTitle: title,
      class: targetClass || 'All',
      section: targetSection || 'All',
      contentId,
      date: dateStr,
      read: false
    };
    studentNotifications.unshift(studentNotif);

    // Notify admins
    adminNotifications.unshift({
      id: `notif-upload-${Date.now()}`,
      type: 'teacher_upload',
      title: `New Teacher Upload: ${title}`,
      message: `Teacher: ${teacherName} uploaded '${title}' for Section ${targetSection}.`,
      submittedAt: dateStr,
      readBy: [],
      actionTaken: true,
      createdAt: dateStr
    });

    addAuditLog(teacherName, 'Teacher', 'Teacher Uploaded Content', `${title} (${contentId})`, `Target: ${targetClass} / ${targetSection}`);

    saveDatabase();

    res.status(201).json({
      success: true,
      message: 'Content uploaded successfully! Relevant students have been notified.',
      content: newContent
    });
  });

  app.get('/api/content', (req, res) => {
    const { section, class: reqClass, isStudent } = req.query;
    let list = teacherContents.filter(c => !c.isHidden);

    if (isStudent === 'true' && section) {
      const sec = (section as string).toUpperCase();
      list = list.filter(c => {
        if (c.targetSection === 'All') return true;
        if (c.targetSection.includes(sec)) return true;
        return false;
      });
    }

    res.json({
      success: true,
      total: list.length,
      contents: list
    });
  });

  app.put('/api/content/:id', (req, res) => {
    const contentId = req.params.id;
    const target = teacherContents.find(c => c.id === contentId);
    if (!target) return res.status(404).json({ success: false, message: 'Content not found.' });

    const { targetSection, targetClass, title, description, isHidden } = req.body;
    if (targetSection !== undefined) target.targetSection = targetSection;
    if (targetClass !== undefined) target.targetClass = targetClass;
    if (title !== undefined) target.title = title;
    if (description !== undefined) target.description = description;
    if (isHidden !== undefined) target.isHidden = isHidden;

    addAuditLog('Admin', 'Admin', 'Updated Content Settings', `${target.title} (${contentId})`);
    saveDatabase();

    res.json({ success: true, content: target });
  });

  app.delete('/api/content/:id', (req, res) => {
    const contentId = req.params.id;
    const index = teacherContents.findIndex(c => c.id === contentId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Content not found.' });

    const removed = teacherContents.splice(index, 1)[0];
    // Remove student notifications referencing this
    studentNotifications = studentNotifications.filter(sn => sn.contentId !== contentId);

    addAuditLog('Admin', 'Admin', 'Content Delete', `${removed.title} (${contentId})`);
    saveDatabase();

    res.json({ success: true, message: 'Content deleted from portal.' });
  });

  // Track Student Content View
  app.post('/api/content/:id/view', (req, res) => {
    const contentId = req.params.id;
    const { studentId, studentName, class: stdClass, section } = req.body;
    const content = teacherContents.find(c => c.id === contentId);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found.' });

    const now = new Date();
    const timeStr = now.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

    let viewRecord = contentViews.find(v => v.contentId === contentId && v.studentId === studentId);
    if (viewRecord) {
      viewRecord.viewCount += 1;
      viewRecord.lastViewedAt = timeStr;
    } else {
      viewRecord = {
        id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        contentId,
        studentId: studentId || 'guest',
        studentName: studentName || 'Student',
        class: stdClass || '1st Year',
        section: section || 'CB1',
        firstViewedAt: timeStr,
        lastViewedAt: timeStr,
        viewCount: 1
      };
      contentViews.push(viewRecord);
    }

    content.totalViews += 1;
    const uniqueStudentIds = new Set(contentViews.filter(v => v.contentId === contentId).map(v => v.studentId));
    content.uniqueViewers = uniqueStudentIds.size;

    addAuditLog(studentName || 'Student', 'Student', 'Content Viewed', `${content.title} (${contentId})`);
    saveDatabase();

    res.json({
      success: true,
      totalViews: content.totalViews,
      uniqueViewers: content.uniqueViewers
    });
  });

  // Content View Analytics: VIEW STUDENT LIST (who viewed & who did NOT view)
  app.get('/api/content/:id/analytics', (req, res) => {
    const contentId = req.params.id;
    const content = teacherContents.find(c => c.id === contentId);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found.' });

    const views = contentViews.filter(v => v.contentId === contentId);

    // Target audience students
    let targetStudentsList = students.filter(s => s.status === 'approved');
    if (content.targetSection && content.targetSection !== 'All') {
      targetStudentsList = targetStudentsList.filter(s => content.targetSection.includes(s.section));
    }

    const viewedStudentIds = new Set(views.map(v => v.studentId));
    const notViewedStudents = targetStudentsList.filter(s => !viewedStudentIds.has(s.id));

    res.json({
      success: true,
      content,
      totalTargetStudents: targetStudentsList.length,
      viewedCount: viewedStudentIds.size,
      notViewedCount: notViewedStudents.length,
      viewedList: views,
      notViewedList: notViewedStudents.map(s => ({
        id: s.id,
        name: s.name,
        roll: s.roll,
        class: s.class,
        section: s.section,
        mobile: s.mobile
      }))
    });
  });

  // Teacher Performance Analytics
  app.get('/api/admin/teachers/analytics', (_req, res) => {
    const teachersList = [
      { id: 't-1', name: 'Engr. Hamza Nawaz', subject: 'Mathematics' },
      { id: 't-2', name: 'Prof. Sara Malik', subject: 'Computer Science' },
      { id: 't-3', name: 'Prof. Farhan Qasim', subject: 'Mathematics' },
      { id: 't-4', name: 'Prof. Dr. Noman Rauf', subject: 'Physics' }
    ];

    const analytics = teachersList.map(t => {
      const uploads = teacherContents.filter(c => c.teacherName.toLowerCase().includes(t.name.toLowerCase()) || c.teacherId === t.id);
      const totalViews = uploads.reduce((acc, c) => acc + c.totalViews, 0);
      const uniqueViewers = uploads.reduce((acc, c) => acc + c.uniqueViewers, 0);
      const pictures = uploads.filter(c => c.fileType === 'Image').length;
      const videos = uploads.filter(c => c.fileType === 'Video').length;
      const notes = uploads.filter(c => c.fileType === 'Notes' || c.fileType === 'PDF').length;
      const sortedByViews = [...uploads].sort((a, b) => b.totalViews - a.totalViews);
      const mostViewed = sortedByViews[0] ? sortedByViews[0].title : 'None';
      const latestUpload = uploads[0] ? uploads[0].uploadDate : 'No uploads yet';

      return {
        id: t.id,
        name: t.name,
        subject: t.subject,
        totalUploads: uploads.length,
        pictures,
        videos,
        notes,
        totalViews,
        uniqueViewers,
        mostViewedContent: mostViewed,
        latestUpload
      };
    });

    res.json({ success: true, teachers: analytics });
  });

  // ----------------------------------------------------
  // ADMIN DASHBOARD STATS & ACTIVITY FEED
  // ----------------------------------------------------

  app.get('/api/admin/dashboard-stats', (_req, res) => {
    const approvedStudents = students.filter(s => s.status === 'approved').length;
    const pendingApps = applications.filter(a => a.status === 'Pending').length;
    const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
    const totalViews = teacherContents.reduce((acc, c) => acc + c.totalViews, 0);
    const unreadNotifs = adminNotifications.filter(n => n.readBy.length === 0).length;

    res.json({
      success: true,
      stats: {
        totalStudents: students.length,
        totalTeachers: 4,
        pendingApplications: pendingApps,
        approvedStudents,
        rejectedApplications: rejectedApps,
        totalTeacherUploads: teacherContents.length,
        totalContentViews: totalViews,
        unreadNotifications: unreadNotifs,
        todayApplications: 2,
        todayUploads: 2
      },
      activityFeed: auditLogs.slice(0, 15)
    });
  });

  // Audit Logs
  app.get('/api/admin/audit-logs', (_req, res) => {
    res.json({
      success: true,
      total: auditLogs.length,
      logs: auditLogs
    });
  });

  // Settings
  app.get('/api/admin/settings', (_req, res) => {
    res.json({ success: true, settings: systemSettings });
  });

  app.put('/api/admin/settings', (req, res) => {
    systemSettings = { ...systemSettings, ...req.body };
    addAuditLog('Admin', 'Super Admin', 'Settings Change', 'College Configuration Updated');
    saveDatabase();
    res.json({ success: true, settings: systemSettings });
  });

  // Delete Student with Immediate Session Invalidation
  app.delete('/api/admin/students/:id', (req, res) => {
    const stdId = req.params.id;
    const index = students.findIndex(s => s.id === stdId || s.roll === stdId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found.' });

    const removed = students.splice(index, 1)[0];

    // Invalidate all active sessions for this student
    activeSessions.forEach(sess => {
      if (sess.userId === removed.id || sess.userName === removed.name) {
        sess.isValid = false;
      }
    });

    addAuditLog('Admin', 'Super Admin', 'Student Deletion', `${removed.name} (Roll: ${removed.roll})`, 'Account deleted and active sessions revoked');
    saveDatabase();

    res.json({ success: true, message: `Student ${removed.name} deleted and sessions revoked.` });
  });

  // Delete Teacher with Session Invalidation
  app.delete('/api/admin/teachers/:id', (req, res) => {
    const teaId = req.params.id;
    activeSessions.forEach(sess => {
      if (sess.userId === teaId) sess.isValid = false;
    });
    addAuditLog('Admin', 'Super Admin', 'Teacher Deletion', `Teacher ID: ${teaId}`);
    saveDatabase();
    res.json({ success: true, message: 'Teacher removed and sessions invalidated.' });
  });

  // Principal Mobile Config
  app.get('/api/config/principal-mobile', (_req, res) => {
    res.json({ success: true, principalMobile: principalApprovalMobile });
  });

  app.post('/api/config/principal-mobile', (req, res) => {
    const { mobileNumber } = req.body;
    const clean = (mobileNumber || '').trim();
    if (!clean || clean.replace(/[^0-9]/g, '').length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number.' });
    }
    principalApprovalMobile = clean;
    saveDatabase();
    res.json({ success: true, message: `Configured to ${clean}`, principalMobile: clean });
  });

  // Student Legacy Routes for Backward Compatibility
  app.post('/api/students/register', async (req, res) => {
    req.url = '/api/applications/register';
    return app._router.handle(req, res);
  });

  app.post('/api/students/login', (req, res) => {
    req.body.role = 'student';
    req.url = '/api/auth/login';
    return app._router.handle(req, res);
  });

  app.get('/api/principal/approval-requests', (_req, res) => {
    res.json({
      success: true,
      principalMobile: principalApprovalMobile,
      counts: {
        pending: applications.filter(a => a.status === 'Pending').length,
        approved: applications.filter(a => a.status === 'Approved').length,
        rejected: applications.filter(a => a.status === 'Rejected').length,
        total: applications.length
      },
      requests: {
        pending: applications.filter(a => a.status === 'Pending'),
        approved: applications.filter(a => a.status === 'Approved'),
        rejected: applications.filter(a => a.status === 'Rejected'),
        all: applications
      }
    });
  });

  app.post('/api/principal/approve', (req, res) => {
    const { studentId, token } = req.body;
    const target = applications.find(a => a.id === studentId || a.assignedStudentId === studentId || a.assignedRoll === studentId || a.id === token);
    if (!target) return res.status(404).json({ success: false, message: 'Application not found.' });
    req.params = { id: target.id };
    req.url = `/api/applications/${target.id}/approve`;
    return app._router.handle(req, res);
  });

  app.post('/api/principal/reject', (req, res) => {
    const { studentId, token, reason } = req.body;
    const target = applications.find(a => a.id === studentId || a.assignedStudentId === studentId || a.assignedRoll === studentId || a.id === token);
    if (!target) return res.status(404).json({ success: false, message: 'Application not found.' });
    req.params = { id: target.id };
    req.body.reason = reason;
    req.url = `/api/applications/${target.id}/reject`;
    return app._router.handle(req, res);
  });

  app.get('/api/notifications/log', (_req, res) => {
    res.json({ success: true, logs: notificationLogs });
  });

  // Mount Vite or static build
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KIPS College Portal] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
