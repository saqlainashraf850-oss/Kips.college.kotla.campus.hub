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
  attendance: number;
  attendanceStatus?: 'Present' | 'Absent' | 'Late';
  photo: string;
  grade?: string;
  joinedDate?: string;
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
}
