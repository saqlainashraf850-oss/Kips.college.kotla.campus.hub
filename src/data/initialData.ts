import { CollegeDatabase } from '../types';

export const INITIAL_COLLEGE_DB: CollegeDatabase = {
  branding: {
    title: "KIPS COLLEGE KOTLA",
    logoUrl: ""
  },
  auth: {
    adminUser: "Kips.edu",
    adminPass: "0852"
  },
  principal: {
    name: "Prof. Muhammad Tariq",
    designation: "Principal, KIPS College Kotla",
    qualifications: "M.Sc Mathematics (Gold Medalist), M.Phil Education (PU)",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    message: "Welcome to KIPS College Kotla Arab Ali Khan. We emphasize conceptual learning, dedicated Mathematics problem-solving workshops, personalized mentoring, and systematic continuous assessment. Our campus is fully equipped to nurture future engineers, doctors, and tech pioneers.",
    phone: "+92 53 1234567",
    email: "principal@kips.edu.pk"
  },
  contact: {
    address: "KIPS College, Bhimber Road, Kotla Arab Ali Khan, Tehsil Kharian, District Gujrat, Punjab, Pakistan",
    phone: "+92 300 1234567, +92 53 7580000",
    whatsapp: "+92 301 7654321",
    email: "kotla@kips.edu.pk",
    admissionEmail: "admissions.kotla@kips.edu.pk",
    hours: "Mon – Sat: 7:45 AM – 3:30 PM (Friday: 7:45 AM – 12:30 PM)",
    emergencyHelpline: "+92 53 7580000",
    locationMapUrl: "https://maps.google.com/?q=KIPS+College+Kotla+Arab+Ali+Khan+Bhimber+Road+Gujrat"
  },
  sections: [
    {
      id: "sec-1",
      name: "CB1",
      room: "Hall 101 (Pre-Engineering & ICS)",
      incharge: "Engr. Hamza Nawaz (Head of Mathematics)",
      capacity: 65
    },
    {
      id: "sec-2",
      name: "CB2",
      room: "Hall 102 (Pre-Medical & Gen. Science)",
      incharge: "Prof. Sara Malik (ICS Computer Science)",
      capacity: 60
    }
  ],
  students: [
    {
      id: "std-1",
      name: "Ahmed Khan",
      father: "Tariq Mahmood Khan",
      email: "ahmed@gmail.com",
      pass: "1234",
      roll: "001",
      cardId: "KIPS-CB1-00125",
      class: "1st Year (F.Sc Pre-Eng)",
      section: "CB1",
      attendance: 94,
      attendanceStatus: "Present",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      grade: "A+ (92% marks)",
      joinedDate: "15 Aug 2025"
    },
    {
      id: "std-2",
      name: "Sara Naveed",
      father: "Malik Naveed",
      email: "sara.std@gmail.com",
      pass: "1234",
      roll: "002",
      cardId: "KIPS-CB1-00126",
      class: "1st Year (ICS Maths/CS)",
      section: "CB1",
      attendance: 98,
      attendanceStatus: "Present",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      grade: "A+ (95% marks)",
      joinedDate: "16 Aug 2025"
    },
    {
      id: "std-3",
      name: "Usman Ali",
      father: "Muhammad Ali",
      email: "usman@gmail.com",
      pass: "1234",
      roll: "003",
      cardId: "KIPS-CB2-00127",
      class: "1st Year (F.Sc Pre-Med)",
      section: "CB2",
      attendance: 91,
      attendanceStatus: "Present",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      grade: "A (88% marks)",
      joinedDate: "20 Aug 2025"
    },
    {
      id: "std-4",
      name: "Zainab Fatima",
      father: "Chaudhry Arshad",
      email: "zainab@gmail.com",
      pass: "1234",
      roll: "004",
      cardId: "KIPS-CB2-00128",
      class: "1st Year (Pre-Medical)",
      section: "CB2",
      attendance: 96,
      attendanceStatus: "Present",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      grade: "A+ (94% marks)",
      joinedDate: "22 Aug 2025"
    }
  ],
  teachers: [
    {
      id: "t-1",
      name: "Engr. Hamza Nawaz",
      email: "hamza@gmail.com",
      pass: "1234",
      subject: "Head of Mathematics (Calculus, Trigonometry & ECAT)",
      inchargeSection: "CB1",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      qualification: "M.S. Applied Mathematics & Engineering",
      experience: "9+ Years in KIPS Entry Test & Board Coaching"
    },
    {
      id: "t-2",
      name: "Prof. Sara Malik",
      email: "sara@gmail.com",
      pass: "1234",
      subject: "Computer Science & ICS Programming",
      inchargeSection: "CB2",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      qualification: "M.Phil Computer Science (NUST)",
      experience: "7+ Years Academic Teaching"
    },
    {
      id: "t-3",
      name: "Prof. Farhan Qasim",
      email: "farhan@gmail.com",
      pass: "1234",
      subject: "Senior Mathematics Specialist (Algebra & Analytical Geometry)",
      inchargeSection: "None",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      qualification: "M.Sc Pure Mathematics (PU)",
      experience: "11+ Years Board Top Scorers Mentor"
    },
    {
      id: "t-4",
      name: "Prof. Dr. Noman Rauf",
      email: "noman@gmail.com",
      pass: "1234",
      subject: "Physics & Applied Mechanics",
      inchargeSection: "None",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      qualification: "Ph.D. Physics (QAU)",
      experience: "12+ Years Teaching Experience"
    }
  ],
  materials: [
    {
      id: "mat-1",
      title: "Unit 1: Functions and Limits - Quick Formula Sheet & Board Questions",
      type: "PDF",
      section: "CB1",
      fileUrl: "",
      videoUrl: "",
      date: "Today",
      uploader: "Engr. Hamza Nawaz (Maths)",
      description: "Comprehensive notes for 1st Year Pre-Engineering & ICS mathematics covering all limits theorems and exercise 1.1 - 1.4."
    },
    {
      id: "mat-2",
      title: "Whiteboard Formulas Snapshot: Derivatives of Trigonometric Functions",
      type: "Image",
      section: "CB1",
      fileUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
      videoUrl: "",
      date: "Yesterday",
      uploader: "Engr. Hamza Nawaz (Maths)",
      description: "Classroom whiteboard diagram detailing chain rule shortcuts and quotient rule derivations."
    },
    {
      id: "mat-3",
      title: "Full Video Lecture: Integration by Parts & Definite Integrals",
      type: "Video",
      section: "CB1",
      fileUrl: "",
      videoUrl: "https://www.youtube.com/watch?v=2rJjtMMf0fE",
      date: "2 Days ago",
      uploader: "Engr. Hamza Nawaz (Maths)",
      description: "Step-by-step masterclass covering board exam repeating problems and ECAT shortcut techniques."
    },
    {
      id: "mat-4",
      title: "Biology Chapter 14: Transport System Summary Notes",
      type: "PDF",
      section: "CB2",
      fileUrl: "",
      videoUrl: "",
      date: "3 Days ago",
      uploader: "Prof. Sara Malik",
      description: "Key diagrams and definitions for Pre-Medical students preparing for monthly assessments."
    }
  ],
  announcements: [
    {
      id: "an-1",
      title: "Mathematics Grand Mock Exam for CB1 & CB2 Sections",
      date: "16 Oct 2026",
      priority: "Urgent",
      desc: "Special 100-marks Mathematics mock examination will be conducted in Main Examination Hall. Carrying original college student cards is mandatory for entry.",
      photo: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "an-2",
      title: "Admissions Open 2026–27: Pre-Engineering, Pre-Medical & ICS",
      date: "12 Oct 2026",
      priority: "Important",
      desc: "Merit lists for Section CB1 and CB2 have been published. Selected candidates are requested to submit fee vouchers and document verification by Friday.",
      photo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "an-3",
      title: "Annual Science & IT Innovation Exhibition Announced",
      date: "08 Oct 2026",
      priority: "General",
      desc: "Inter-college Mathematics models, robotics projects, and coding competitions will be hosted on the main campus ground.",
      photo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80"
    }
  ],
  gallery: [
    {
      id: "g-1",
      title: "Main Campus Academic Complex & Entrance",
      category: "Campus",
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
      description: "Scenic view of KIPS College Kotla Arab Ali Khan campus on Bhimber Road."
    },
    {
      id: "g-2",
      title: "Mathematics Masterclass & Analytical Drills",
      category: "Maths",
      url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
      description: "Senior faculty solving complex calculus, algebra, and ECAT entry test patterns."
    },
    {
      id: "g-3",
      title: "High-Tech Computer & Software Engineering Suite",
      category: "Labs",
      url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
      description: "Modern network workstations for ICS and computer programming students."
    },
    {
      id: "g-4",
      title: "Modern Physics & Optics Laboratory",
      category: "Labs",
      url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
      description: "Advanced apparatus for practical experiments and board exams preparation."
    },
    {
      id: "g-5",
      title: "Annual Distinction & Gold Medalist Ceremony",
      category: "Events",
      url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      description: "Celebrating top position holders and academic excellence in BISE Gujranwala."
    },
    {
      id: "g-6",
      title: "Interactive Classroom Session in Section CB1",
      category: "Campus",
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      description: "Group discussions and interactive conceptual coaching in air-conditioned halls."
    },
    {
      id: "g-7",
      title: "Inter-College Cricket & Sports Gala",
      category: "Sports",
      url: "https://images.unsplash.com/photo-1531415074868-036b1c575351?auto=format&fit=crop&w=1200&q=80",
      description: "Annual sports tournament promoting fitness, team spirit, and athletic vigor."
    },
    {
      id: "g-8",
      title: "Central Reference Library & Study Lounge",
      category: "Campus",
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
      description: "Quiet study cubicles and extensive collection of reference books and journals."
    },
    {
      id: "g-9",
      title: "Biology & MDCAT Preparation Suite",
      category: "Labs",
      url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
      description: "Microscopy and anatomical specimen analysis for Pre-Medical scholars in CB2."
    },
    {
      id: "g-10",
      title: "Mathematics Seminar on Differential Equations",
      category: "Maths",
      url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
      description: "Specialized weekend guest seminar by top mathematicians from Lahore & Gujrat."
    }
  ],
  inquiries: [
    {
      id: "inq-1",
      name: "Bilal Ahmad",
      phone: "+92 312 9876543",
      email: "bilal.ahmad@example.com",
      message: "I want to apply for F.Sc Pre-Engineering in Section CB1. Please guide me regarding the scholarship criteria and Mathematics entry test syllabus.",
      program: "F.Sc Pre-Engineering (CB1)",
      date: "02 Oct 2026",
      status: "New"
    }
  ],
  locations: [
    {
      id: "loc-1",
      title: "Main Academic Campus & Administrative Block",
      address: "KIPS College, Bhimber Road, Kotla Arab Ali Khan, Tehsil Kharian, District Gujrat, Punjab, Pakistan",
      landmark: "Near Kotla Bus Stand, Main Bhimber Road",
      mapUrl: "https://maps.google.com/?q=KIPS+College+Kotla+Arab+Ali+Khan+Bhimber+Road+Gujrat",
      phone: "+92 300 1234567",
      isPrimary: true
    },
    {
      id: "loc-2",
      title: "Science & Mathematics Laboratories Block",
      address: "Bhimber Road, West Wing, Kotla Arab Ali Khan, District Gujrat",
      landmark: "Adjacent to Main Academic Hall 101 (CB1)",
      mapUrl: "https://maps.google.com/?q=Kotla+Arab+Ali+Khan+Bhimber+Road",
      phone: "+92 53 7580000",
      isPrimary: false
    }
  ]
};
