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

// Interface definitions
interface StudentRecord {
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

interface NotificationLog {
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

// In-memory + persisted storage
let principalApprovalMobile = process.env.PRINCIPAL_MOBILE_NUMBER || '+92 300 9876543';
let students: StudentRecord[] = [];
let notificationLogs: NotificationLog[] = [];

// Initialize data
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (data.students) students = data.students;
      if (data.principalMobile) principalApprovalMobile = data.principalMobile;
      if (data.notificationLogs) notificationLogs = data.notificationLogs;
    }
  } catch (err) {
    console.error('Failed to read storage_db.json, using defaults', err);
  }

  // Ensure default students exist if empty
  if (students.length === 0) {
    students = [
      {
        id: 'std-1',
        name: 'Ahmed Khan',
        father: 'Tariq Mahmood Khan',
        email: 'ahmed@gmail.com',
        pass: '1234',
        roll: '001',
        cardId: 'KIPS-CB1-00125',
        class: '1st Year (F.Sc Pre-Eng)',
        section: 'CB1',
        mobile: '+92 300 1234501',
        status: 'approved',
        requestedAt: '15 Aug 2025, 09:30 AM',
        approvedAt: '15 Aug 2025, 10:15 AM',
        approvalToken: 'token-std-1',
        attendance: 94,
        attendanceStatus: 'Present',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        grade: 'A+ (92% marks)',
        joinedDate: '15 Aug 2025'
      },
      {
        id: 'std-2',
        name: 'Sara Naveed',
        father: 'Malik Naveed',
        email: 'sara.std@gmail.com',
        pass: '1234',
        roll: '002',
        cardId: 'KIPS-CB1-00126',
        class: '1st Year (ICS Maths/CS)',
        section: 'CB1',
        mobile: '+92 301 7654302',
        status: 'approved',
        requestedAt: '16 Aug 2025, 10:00 AM',
        approvedAt: '16 Aug 2025, 11:20 AM',
        approvalToken: 'token-std-2',
        attendance: 98,
        attendanceStatus: 'Present',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        grade: 'A+ (95% marks)',
        joinedDate: '16 Aug 2025'
      },
      {
        id: 'std-5',
        name: 'Muhammad Hamza',
        father: 'Muhammad Shafiq',
        email: 'hamza.std@gmail.com',
        pass: '1234',
        roll: '005',
        cardId: 'KIPS-CB1-00129',
        class: '1st Year (ICS Maths/CS)',
        section: 'CB1',
        mobile: '+92 313 7894561',
        status: 'pending',
        requestedAt: '07 Oct 2026, 09:15 AM',
        approvalToken: 'token-std-5-pending',
        attendance: 100,
        attendanceStatus: 'Present',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        grade: 'Pending Enrollment',
        joinedDate: '07 Oct 2026'
      },
      {
        id: 'std-6',
        name: 'Ayesha Noor',
        father: 'Dr. Noor Ahmed',
        email: 'ayesha.noor@gmail.com',
        pass: '1234',
        roll: '006',
        cardId: 'KIPS-CB2-00130',
        class: '1st Year (F.Sc Pre-Med)',
        section: 'CB2',
        mobile: '+92 321 4561230',
        status: 'pending',
        requestedAt: '07 Oct 2026, 10:45 AM',
        approvalToken: 'token-std-6-pending',
        attendance: 100,
        attendanceStatus: 'Present',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        grade: 'Pending Enrollment',
        joinedDate: '07 Oct 2026'
      },
      {
        id: 'std-7',
        name: 'Kashif Mehmood',
        father: 'Mehmood Ali',
        email: 'kashif.m@gmail.com',
        pass: '1234',
        roll: '007',
        cardId: 'KIPS-CB1-00131',
        class: '1st Year (F.Sc Pre-Eng)',
        section: 'CB1',
        mobile: '+92 345 6789012',
        status: 'rejected',
        requestedAt: '06 Oct 2026, 02:30 PM',
        rejectedAt: '06 Oct 2026, 03:45 PM',
        rejectionReason: 'Your account has not been approved by the Principal. (Invalid admission roll record).',
        approvalToken: 'token-std-7-rejected',
        attendance: 0,
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        grade: 'Not Admitted',
        joinedDate: '06 Oct 2026'
      }
    ];

    notificationLogs = [
      {
        id: 'notif-1',
        studentId: 'std-5',
        studentName: 'Muhammad Hamza',
        roll: '005',
        class: '1st Year (ICS Maths/CS)',
        mobile: '+92 313 7894561',
        email: 'hamza.std@gmail.com',
        principalMobile: principalApprovalMobile,
        message: `🎓 GIPS College Kotla - Student Access Request\n• Name: Muhammad Hamza\n• Roll: 005\n• Class: 1st Year (ICS Maths/CS)\n• Mobile: +92 313 7894561\n• Email: hamza.std@gmail.com\n• Date/Time: 07 Oct 2026, 09:15 AM\nStatus: Pending Principal Approval`,
        timestamp: '07 Oct 2026, 09:15 AM',
        status: 'delivered',
        channel: 'SMS',
        actionToken: 'token-std-5-pending'
      }
    ];

    saveDatabase();
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

// External notification dispatcher
async function dispatchPrincipalMobileNotification(
  student: StudentRecord,
  reqHost: string
): Promise<NotificationLog> {
  const timestamp = student.requestedAt || new Date().toLocaleString();
  const directLink = `https://${reqHost}/?action=principal-approval&token=${student.approvalToken}`;

  const messageText = [
    '🎓 GIPS COLLEGE KOTLA - NEW STUDENT ACCESS REQUEST',
    `• Student Name: ${student.name}`,
    `• Roll / Student ID: ${student.roll}`,
    `• Class / Course: ${student.class} (${student.section})`,
    `• Registered Mobile: ${student.mobile}`,
    `• Email: ${student.email || 'N/A'}`,
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
    studentId: student.id,
    studentName: student.name,
    roll: student.roll,
    class: `${student.class} (${student.section})`,
    mobile: student.mobile,
    email: student.email,
    principalMobile: principalApprovalMobile,
    message: messageText,
    timestamp,
    status: 'delivered',
    channel: 'SMS',
    actionToken: student.approvalToken
  };

  notificationLogs.unshift(logEntry);
  saveDatabase();

  return logEntry;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API ROUTE: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // API ROUTE: Get/Set Principal Mobile Number (Protected)
  app.get('/api/config/principal-mobile', (_req, res) => {
    res.json({
      success: true,
      principalMobile: principalApprovalMobile
    });
  });

  app.post('/api/config/principal-mobile', (req, res) => {
    const { mobileNumber } = req.body;
    const clean = (mobileNumber || '').trim();
    const digits = clean.replace(/[^0-9]/g, '');

    if (!clean || digits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number. Please provide a valid number with at least 10 digits.'
      });
    }

    principalApprovalMobile = clean;
    saveDatabase();

    res.json({
      success: true,
      message: `Principal mobile number configured successfully to ${clean}`,
      principalMobile: clean
    });
  });

  // API ROUTE: Student Registration (Requires Principal Approval)
  app.post('/api/students/register', async (req, res) => {
    try {
      const data = req.body;
      const cleanName = (data.name || '').trim();
      const cleanFather = (data.father || '').trim();
      const cleanRoll = (data.roll || '').trim();
      const cleanMobile = (data.mobile || '').trim();
      const cleanEmail = (data.email || '').trim().toLowerCase();
      const cleanPass = (data.pass || '').trim();
      const cleanClass = data.class || '1st Year';
      const cleanSection = data.section || 'CB1';

      if (!cleanName || !cleanRoll || !cleanMobile || !cleanPass) {
        return res.status(400).json({
          success: false,
          message: 'Student Name, Roll Number, Mobile Number, and Password are required.'
        });
      }

      const cleanDigits = cleanMobile.replace(/[^0-9]/g, '');
      if (cleanDigits.length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid mobile number with at least 10 digits.'
        });
      }

      // Check duplicate Roll
      const existingRoll = students.find(s => s.roll.toLowerCase() === cleanRoll.toLowerCase());
      if (existingRoll) {
        if (existingRoll.status === 'pending') {
          return res.status(400).json({
            success: false,
            message: `A registration request for Roll Number "${cleanRoll}" is already pending Principal approval.`
          });
        }
        if (existingRoll.status === 'rejected') {
          return res.status(400).json({
            success: false,
            message: `Your account with Roll Number "${cleanRoll}" has not been approved by the Principal.`
          });
        }
        return res.status(400).json({
          success: false,
          message: `A student account with Roll Number "${cleanRoll}" already exists and is approved. Please sign in.`
        });
      }

      // Check duplicate Mobile
      const existingMobile = students.find(s => {
        const sDigits = (s.mobile || '').replace(/[^0-9]/g, '');
        return sDigits.length >= 10 && cleanDigits.length >= 10 && (sDigits === cleanDigits || sDigits.endsWith(cleanDigits));
      });
      if (existingMobile) {
        if (existingMobile.status === 'pending') {
          return res.status(400).json({
            success: false,
            message: `A registration request with Mobile Number "${cleanMobile}" is already pending Principal approval.`
          });
        }
        if (existingMobile.status === 'rejected') {
          return res.status(400).json({
            success: false,
            message: 'Your account has not been approved by the Principal.'
          });
        }
        return res.status(400).json({
          success: false,
          message: 'An account with this Mobile Number already exists. Please sign in.'
        });
      }

      const timestamp = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const approvalToken = `appr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const cardId = data.cardId || `KIPS-${cleanSection}-${cleanRoll.padStart(4, '0')}`;

      const newStudent: StudentRecord = {
        id: `std-${Date.now()}`,
        name: cleanName,
        father: cleanFather || 'Parent / Guardian',
        email: cleanEmail || `${cleanRoll.toLowerCase()}@kips.edu.pk`,
        pass: cleanPass,
        roll: cleanRoll,
        cardId,
        class: cleanClass,
        section: cleanSection,
        mobile: cleanMobile,
        status: 'pending',
        requestedAt: timestamp,
        approvalToken,
        attendance: 100,
        attendanceStatus: 'Present',
        photo: data.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        grade: 'Pending Enrollment',
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      students.unshift(newStudent);
      saveDatabase();

      // Dispatch real-time mobile notification to Principal
      const notifLog = await dispatchPrincipalMobileNotification(newStudent, req.get('host') || 'localhost:3000');

      return res.status(201).json({
        success: true,
        message: `Registration request submitted! Principal mobile notification sent to ${principalApprovalMobile}. Account status: Pending Approval.`,
        student: newStudent,
        notification: notifLog
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  });

  // API ROUTE: Student Login with Strict Status Checking
  app.post('/api/students/login', (req, res) => {
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
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
      return res.status(401).json({
        success: false,
        message: 'Incorrect student password.'
      });
    }

    // STRICT APPROVAL GATEWAY
    if (found.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message: 'Your account is currently Pending Approval. A notification has been sent to the Principal\'s mobile number. You cannot access the student portal until approval is granted.'
      });
    }

    if (found.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message: found.rejectionReason || 'Your account has not been approved by the Principal. Please contact the college administration office.'
      });
    }

    if (found.status === 'approved') {
      return res.json({
        success: true,
        status: 'approved',
        student: found
      });
    }

    return res.status(403).json({
      success: false,
      status: 'pending',
      message: 'Your account is pending Principal approval.'
    });
  });

  // API ROUTE: Get All Approval Requests
  app.get('/api/principal/approval-requests', (_req, res) => {
    const pending = students.filter(s => s.status === 'pending');
    const approved = students.filter(s => s.status === 'approved');
    const rejected = students.filter(s => s.status === 'rejected');

    res.json({
      success: true,
      principalMobile: principalApprovalMobile,
      counts: {
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        total: students.length
      },
      requests: {
        pending,
        approved,
        rejected,
        all: students
      }
    });
  });

  // API ROUTE: Principal Approve
  app.post('/api/principal/approve', (req, res) => {
    const { studentId, token } = req.body;
    const target = students.find(s => s.id === studentId || s.roll === studentId || s.cardId === studentId || (token && s.approvalToken === token) || s.approvalToken === studentId);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Student request not found.' });
    }

    const approvalTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    target.status = 'approved';
    target.approvedAt = approvalTime;
    target.rejectionReason = undefined;

    saveDatabase();

    return res.json({
      success: true,
      message: `Student "${target.name}" approved successfully! Account is now Active and can log in.`,
      student: target
    });
  });

  // API ROUTE: Principal Reject
  app.post('/api/principal/reject', (req, res) => {
    const { studentId, token, reason } = req.body;
    const target = students.find(s => s.id === studentId || s.roll === studentId || s.cardId === studentId || (token && s.approvalToken === token) || s.approvalToken === studentId);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Student request not found.' });
    }

    const rejectionTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    target.status = 'rejected';
    target.rejectedAt = rejectionTime;
    target.rejectionReason = reason || 'Your account has not been approved by the Principal.';

    saveDatabase();

    return res.json({
      success: true,
      message: `Student "${target.name}" registration request has been rejected.`,
      student: target
    });
  });

  // API ROUTE: Get Dispatched Notification Logs
  app.get('/api/notifications/log', (_req, res) => {
    res.json({
      success: true,
      logs: notificationLogs
    });
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
    console.log(`[GIPS College Portal] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
