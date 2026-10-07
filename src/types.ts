export interface BrandingInfo {
  title: string;
  logoUrl: string;
}

export interface AdminAuth {
  adminUser: string;
  adminPass: string;
}

export interface PrincipalInfo {
  name: string;
  designation: string;
  qualifications: string;
  photo: string;
  message: string;
  phone: string;
  email: string;
  approvalMobileNumber?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  admissionEmail: string;
  hours: string;
  emergencyHelpline: string;
  locationMapUrl?: string;
}

export interface SectionItem {
  id: string;
  name: string; // e.g. CB1, CB2
  room: string;
  incharge: string;
  capacity: number;
}

export type StudentApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface StudentItem {
  id: string;
  name: string;
  father: string;
  email: string;
  pass: string;
  roll: string;
  cardId: string;
  class: string;
  section: string; // e.g. CB1 or CB2
  mobile: string;
  status: StudentApprovalStatus;
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

export interface NotificationLogItem {
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

export interface TeacherItem {
  id: string;
  name: string;
  email: string;
  pass: string;
  subject: string; // e.g. "Head of Mathematics", "Calculus & Geometry", "ICS Computer Science"
  inchargeSection: string; // "CB1", "CB2", or "None"
  photo: string;
  qualification?: string;
  experience?: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  type: 'PDF' | 'Image' | 'Video';
  section: string; // "CB1", "CB2", or "All"
  fileUrl?: string;
  videoUrl?: string;
  date: string;
  uploader: string;
  description?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  priority: 'Urgent' | 'Important' | 'General';
  desc: string;
  photo?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Labs' | 'Maths' | 'Events' | 'Sports';
  url: string;
  description?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  program?: string;
  date: string;
  status: 'New' | 'Replied' | 'Pending';
}

export interface LocationItem {
  id: string;
  title: string;
  address: string;
  landmark?: string;
  mapUrl: string;
  phone?: string;
  isPrimary?: boolean;
}

export interface StudentApplication {
  id: string; // e.g. APP-2026-001
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

export interface AdminNotification {
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

export interface StudentNotification {
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

export interface ContentViewRecord {
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

export interface TeacherContentItem {
  id: string;
  fileUrl?: string;
  fileType: 'PDF' | 'Image' | 'Video' | 'Notes' | 'Assignment' | 'Announcement' | 'Picture' | 'Study Material';
  title: string;
  description?: string;
  teacherName: string;
  teacherId: string;
  uploadDate: string;
  targetClass: string;
  targetSection: string; // "All" | "CB1" | "CB2" | "CB1 + CB2"
  targetStudents?: string[] | string;
  totalViews: number;
  uniqueViewers: number | string[];
  downloadCount: number;
  isHidden?: boolean;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  role: 'Super Admin' | 'Admin' | 'Teacher' | 'Student' | 'System';
  action: string;
  relatedRecord: string;
  date: string;
  time: string;
  details?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'Super Admin' | 'Admin';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  status?: 'active' | 'suspended';
}

export interface UserSession {
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

export interface CollegeSettings {
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

export interface CollegeDatabase {
  branding: BrandingInfo;
  auth: AdminAuth;
  principal: PrincipalInfo;
  contact: ContactInfo;
  sections: SectionItem[];
  students: StudentItem[];
  teachers: TeacherItem[];
  materials: MaterialItem[];
  announcements: AnnouncementItem[];
  gallery: GalleryItem[];
  inquiries: InquiryItem[];
  locations?: LocationItem[];
  notificationLogs?: NotificationLogItem[];
  applications?: StudentApplication[];
  adminNotifications?: AdminNotification[];
  studentNotifications?: StudentNotification[];
  contentViews?: ContentViewRecord[];
  teacherContents?: TeacherContentItem[];
  auditLogs?: AuditLogEntry[];
  adminUsers?: AdminUser[];
  activeSessions?: UserSession[];
  systemSettings?: CollegeSettings;
}
