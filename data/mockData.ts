
import { User, Club, UserRole, WeeklyReport, AttendanceRecord, AttendanceStatus, GradingRecord, ClubCategory, Announcement, AnnouncementType } from '../types';

export const mockUsers: User[] = [
  // Students (Registered)
  { id: '1111111111111', name: 'นายสมชาย รักเรียน', role: UserRole.STUDENT, studentId: '65001', className: 'ม.4/1', advisor: 'ครูสมศรี', cancellationsLeft: 2 },
  { id: '2222222222222', name: 'นางสาวสมหญิง ใฝ่รู้', role: UserRole.STUDENT, studentId: '65002', className: 'ม.4/2', advisor: 'ครูสมศักดิ์', cancellationsLeft: 2 },
  { id: '3333333333333', name: 'เด็กชายมานะ เพียรศึกษา', role: UserRole.STUDENT, studentId: '66001', className: 'ม.1/3', advisor: 'ครูวิชัย', cancellationsLeft: 2 },
  { id: '4444444444444', name: 'เด็กหญิงปิติ ยินดี', role: UserRole.STUDENT, studentId: '66002', className: 'ม.1/1', advisor: 'ครูพรทิพย์', cancellationsLeft: 2 },
  { id: '5555555555555', name: 'ด.ช.รักไทย ใจกล้า', role: UserRole.STUDENT, studentId: '66003', className: 'ม.2/1', advisor: 'ครูสมชาย', cancellationsLeft: 2 },
  { id: '6666666666666', name: 'ด.ญ.วรรณคดี มีสุข', role: UserRole.STUDENT, studentId: '66004', className: 'ม.2/2', advisor: 'ครูสมหญิง', cancellationsLeft: 2 },
  { id: '7777777777777', name: 'นายกวี ศรีปราชญ์', role: UserRole.STUDENT, studentId: '65003', className: 'ม.5/1', advisor: 'ครูสุนทร', cancellationsLeft: 2 },
  { id: '8888888888888', name: 'น.ส.กาพย์กลอน อ่อนหวาน', role: UserRole.STUDENT, studentId: '65004', className: 'ม.5/2', advisor: 'ครูภู่', cancellationsLeft: 2 },
  
  // New Students (Unregistered) for testing Auto-Assign
  { id: 'UNREG001', name: 'ด.ช.หนึ่ง นามสมมติ', role: UserRole.STUDENT, studentId: '66101', className: 'ม.1/2', advisor: 'ครูสมร', cancellationsLeft: 2 },
  { id: 'UNREG002', name: 'ด.ญ.สอง ส่องแสง', role: UserRole.STUDENT, studentId: '66102', className: 'ม.1/4', advisor: 'ครูสมร', cancellationsLeft: 2 },
  { id: 'UNREG003', name: 'นายสาม สามัคคี', role: UserRole.STUDENT, studentId: '65103', className: 'ม.4/3', advisor: 'ครูไพศาล', cancellationsLeft: 2 },
  { id: 'UNREG004', name: 'น.ส.สี่ สีสัน', role: UserRole.STUDENT, studentId: '65104', className: 'ม.4/4', advisor: 'ครูไพศาล', cancellationsLeft: 2 },
  { id: 'UNREG005', name: 'ด.ช.ห้า หากล้า', role: UserRole.STUDENT, studentId: '66205', className: 'ม.2/3', advisor: 'ครูอำนาจ', cancellationsLeft: 2 },
  { id: 'UNREG006', name: 'ด.ญ.หก หรรษา', role: UserRole.STUDENT, studentId: '66206', className: 'ม.3/1', advisor: 'ครูอำนาจ', cancellationsLeft: 2 },
  { id: 'UNREG007', name: 'นายเจ็ด เจตนา', role: UserRole.STUDENT, studentId: '64007', className: 'ม.6/1', advisor: 'ครูวิไล', cancellationsLeft: 2 },
  { id: 'UNREG008', name: 'น.ส.แปด แปลกใหม่', role: UserRole.STUDENT, studentId: '64008', className: 'ม.6/2', advisor: 'ครูวิไล', cancellationsLeft: 2 },
  { id: 'UNREG009', name: 'ด.ช.เก้า ก้าวหน้า', role: UserRole.STUDENT, studentId: '66309', className: 'ม.3/2', advisor: 'ครูมาลี', cancellationsLeft: 2 },
  { id: 'UNREG010', name: 'ด.ญ.สิบ สุขใจ', role: UserRole.STUDENT, studentId: '66310', className: 'ม.2/5', advisor: 'ครูมาลี', cancellationsLeft: 2 },

  // Teachers
  { id: '9999999999999', name: 'ครูวิชาการ สอนดี', role: UserRole.TEACHER, assignedClubId: 'C001', teacherId: 'AC001' },
  { id: '8888888888880', name: 'ครูศิลปะ วาดสวย', role: UserRole.TEACHER, assignedClubId: 'C002', teacherId: 'AR001' },
  { id: '7777777777770', name: 'ครูพละ แข็งแรง', role: UserRole.TEACHER, assignedClubId: 'C003', teacherId: 'PE001' },
  { id: '6666666666660', name: 'ครูภาษาไทย รักชาติ', role: UserRole.TEACHER, assignedClubId: 'C005', teacherId: 'TH001' },
  { id: '5555555555501', name: 'ครูจิตอาสา ใจดี', role: UserRole.TEACHER, assignedClubId: 'C006', teacherId: 'VOL001' },
  { id: '5555555555502', name: 'ครูรสริน หวานเจี๊ยบ', role: UserRole.TEACHER, assignedClubId: 'C007', teacherId: 'CK001' },
  { id: '5555555555503', name: 'ครูสร้างสรรค์ งานฝีมือ', role: UserRole.TEACHER, assignedClubId: 'C008', teacherId: 'CR001' },
  
  // Additional Teachers for new clubs
  { id: 'T009', name: 'ครูเกมเมอร์ ไซเบอร์', role: UserRole.TEACHER, assignedClubId: 'C009', teacherId: 'TE002' },
  { id: 'T010', name: 'ครูโรบอท ยอดอัจฉริยะ', role: UserRole.TEACHER, assignedClubId: 'C010', teacherId: 'SC001' },
  { id: 'T011', name: 'ครูวิทย์ คิดสนุก', role: UserRole.TEACHER, assignedClubId: 'C011', teacherId: 'SC002' },
  { id: 'T012', name: 'ครูคณิต คิดเร็ว', role: UserRole.TEACHER, assignedClubId: 'C012', teacherId: 'MA001' },
  { id: 'T013', name: 'Teacher John Doe', role: UserRole.TEACHER, assignedClubId: 'C013', teacherId: 'EN001' },
  { id: 'T014', name: 'ครูชู้ต แม่นยำ', role: UserRole.TEACHER, assignedClubId: 'C014', teacherId: 'PE002' },
  { id: 'T015', name: 'ครูตบ หนักหน่วง', role: UserRole.TEACHER, assignedClubId: 'C015', teacherId: 'PE003' },
  { id: 'T016', name: 'ครูแบด ว่องไว', role: UserRole.TEACHER, assignedClubId: 'C016', teacherId: 'PE004' },
  { id: 'T017', name: 'ครูปิงปอง สปิน', role: UserRole.TEACHER, assignedClubId: 'C017', teacherId: 'PE005' },
  { id: 'T018', name: 'ครูรำไทย อ่อนช้อย', role: UserRole.TEACHER, assignedClubId: 'C018', teacherId: 'AR002' },
  { id: 'T019', name: 'ครูชัตเตอร์ โฟกัส', role: UserRole.TEACHER, assignedClubId: 'C019', teacherId: 'AR003' },
  { id: 'T020', name: 'ครูผู้กำกับ ตัดต่อ', role: UserRole.TEACHER, assignedClubId: 'C020', teacherId: 'AR004' },
  { id: 'T021', name: 'ครูวางแผน กลยุทธ์', role: UserRole.TEACHER, assignedClubId: 'C021', teacherId: 'GE001' },
  { id: 'T022', name: 'ครูดิน ปลูกผัก', role: UserRole.TEACHER, assignedClubId: 'C022', teacherId: 'GE002' },
  { id: 'T023', name: 'ครูหนอนหนังสือ', role: UserRole.TEACHER, assignedClubId: 'C023', teacherId: 'GE003' },

  // Academic Staff / Admins
  { id: '1000000000000', name: 'ฝ่ายวิชาการ (หัวหน้า)', role: UserRole.ACADEMIC, teacherId: 'AD001' },
  { id: '1000000000001', name: 'ผู้ดูแลระบบ 1', role: UserRole.ACADEMIC, teacherId: 'admin01' },
  { id: '1000000000002', name: 'ผู้ดูแลระบบ 2', role: UserRole.ACADEMIC, teacherId: 'admin02' },
  { id: '1000000000003', name: 'ผู้ดูแลระบบ 3', role: UserRole.ACADEMIC, teacherId: 'admin03' },
  { id: '1000000000004', name: 'ผู้ดูแลระบบ 4', role: UserRole.ACADEMIC, teacherId: 'admin04' },
];

export const mockClubs: Club[] = [
  { 
    id: 'C001', 
    name: 'ชุมนุม AI และนวัตกรรม', 
    teacherName: 'ครูวิชาการ สอนดี', 
    description: 'เรียนรู้เกี่ยวกับการสร้าง AI และการเขียนโปรแกรมเบื้องต้น', 
    location: 'อาคาร 3 ห้องคอมพิวเตอร์ 1', 
    maxSeats: 25, 
    currentSeats: 1,
    category: ClubCategory.TECHNOLOGY,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C002', 
    name: 'ชุมนุมศิลปะสร้างสรรค์', 
    teacherName: 'ครูศิลปะ วาดสวย', 
    description: 'ฝึกฝนทักษะการวาดภาพและสร้างสรรค์ผลงานศิลปะหลากหลายรูปแบบ', 
    location: 'อาคารศิลปะ ห้อง 201', 
    maxSeats: 25, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [1, 2, 3] // ม.ต้น
  },
  { 
    id: 'C003', 
    name: 'ชุมนุมกีฬาฟุตซอล', 
    teacherName: 'ครูพละ แข็งแรง', 
    description: 'พัฒนาทักษะการเล่นกีฬาฟุตซอลและทำงานเป็นทีม', 
    location: 'สนามฟุตซอล', 
    maxSeats: 25, 
    currentSeats: 25,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C004', 
    name: 'ชุมนุมดนตรีสากล', 
    teacherName: 'ครูเมโลดี้', 
    description: 'เรียนรู้การเล่นเครื่องดนตรีสากลและร่วมวงดนตรี', 
    location: 'ห้องดนตรีสากล', 
    maxSeats: 25, 
    currentSeats: 10,
    category: ClubCategory.ARTS,
    allowedGrades: [4, 5, 6] // ม.ปลาย
  },
  { 
    id: 'C005', 
    name: 'ชุมนุมภาษาไทย', 
    teacherName: 'ครูภาษาไทย รักชาติ', 
    description: 'เรียนรู้หลักภาษาไทยและการแต่งคำประพันธ์', 
    location: 'อาคาร 4 ห้อง 401', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C006', 
    name: 'ชุมนุมอาสาพัฒนาชุมชน', 
    teacherName: 'ครูจิตอาสา ใจดี', 
    description: 'ร่วมกันทำกิจกรรมบำเพ็ญประโยชน์ พัฒนาโรงเรียนและชุมชนรอบข้าง', 
    location: 'อาคารกิจกรรม', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.SOCIAL,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C007', 
    name: 'ชุมนุมอาหารและเครื่องดื่ม', 
    teacherName: 'ครูรสริน หวานเจี๊ยบ', 
    description: 'ฝึกการทำอาหารว่าง ขนมไทย และเครื่องดื่มประเภทต่างๆ', 
    location: 'อาคารคหกรรม ห้อง 1', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C008', 
    name: 'ชุมนุมงานประดิษฐ์ DIY', 
    teacherName: 'ครูสร้างสรรค์ งานฝีมือ', 
    description: 'ประดิษฐ์ของใช้ของตกแต่งจากวัสดุเหลือใช้และวัสดุธรรมชาติ', 
    location: 'ห้องงานบ้าน', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3] // ม.ต้น
  },
  // --- New Clubs ---
  { 
    id: 'C009', 
    name: 'ชมรม E-Sports', 
    teacherName: 'ครูเกมเมอร์ ไซเบอร์', 
    description: 'ฝึกฝนทักษะการเล่นเกมอย่างมีระบบ วางแผนทีม และการเป็นนักกีฬา E-Sports', 
    location: 'ห้องคอมพิวเตอร์ 2', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.TECHNOLOGY,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C010', 
    name: 'ชุมนุมหุ่นยนต์ (Robotics)', 
    teacherName: 'ครูโรบอท ยอดอัจฉริยะ', 
    description: 'เรียนรู้การประกอบและเขียนโปรแกรมควบคุมหุ่นยนต์เบื้องต้น', 
    location: 'ห้องปฏิบัติการวิทยาศาสตร์ 1', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.TECHNOLOGY,
    allowedGrades: [1, 2, 3]
  },
  { 
    id: 'C011', 
    name: 'วิทยาศาสตร์หรรษา', 
    teacherName: 'ครูวิทย์ คิดสนุก', 
    description: 'ทดลองวิทยาศาสตร์สนุกๆ ที่ไม่มีในบทเรียน', 
    location: 'ห้องปฏิบัติการวิทยาศาสตร์ 2', 
    maxSeats: 25, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [1, 2, 3]
  },
  { 
    id: 'C012', 
    name: 'คณิตศาสตร์แฟนซี', 
    teacherName: 'ครูคณิต คิดเร็ว', 
    description: 'เกมคณิตศาสตร์ ซูโดกุ และการแก้ปัญหาเชาวน์', 
    location: 'ห้อง 305', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C013', 
    name: 'English Debate Club', 
    teacherName: 'Teacher John Doe', 
    description: 'ฝึกทักษะการโต้วาทีและพูดสุนทรพจน์เป็นภาษาอังกฤษ', 
    location: 'Sound Lab', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [4, 5, 6]
  },
  { 
    id: 'C014', 
    name: 'บาสเกตบอล', 
    teacherName: 'ครูชู้ต แม่นยำ', 
    description: 'ฝึกพื้นฐานการเล่นบาสเกตบอลและการเล่นทีม', 
    location: 'สนามบาสเกตบอล', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C015', 
    name: 'วอลเลย์บอล', 
    teacherName: 'ครูตบ หนักหน่วง', 
    description: 'ฝึกทักษะวอลเลย์บอล เสิร์ฟ รับ ตบ', 
    location: 'โรงยิม', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C016', 
    name: 'แบดมินตัน', 
    teacherName: 'ครูแบด ว่องไว', 
    description: 'ออกกำลังกายด้วยกีฬาแบดมินตัน (ต้องเตรียมไม้มาเอง)', 
    location: 'หอประชุม', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C017', 
    name: 'เทเบิลเทนนิส (ปิงปอง)', 
    teacherName: 'ครูปิงปอง สปิน', 
    description: 'ฝึกทักษะการตีปิงปอง', 
    location: 'ใต้ถุนอาคาร 4', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C018', 
    name: 'นาฏศิลป์ไทย', 
    teacherName: 'ครูรำไทย อ่อนช้อย', 
    description: 'อนุรักษ์ศิลปวัฒนธรรมไทย ฝึกรำไทยชุดต่างๆ', 
    location: 'ห้องนาฏศิลป์', 
    maxSeats: 25, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C019', 
    name: 'ชุมนุมถ่ายภาพ', 
    teacherName: 'ครูชัตเตอร์ โฟกัส', 
    description: 'เทคนิคการถ่ายภาพด้วยกล้องดิจิทัลและมือถือ', 
    location: 'ห้องโสตทัศนศึกษา', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [4, 5, 6]
  },
  { 
    id: 'C020', 
    name: 'หนังสั้นและการแสดง', 
    teacherName: 'ครูผู้กำกับ ตัดต่อ', 
    description: 'เรียนรู้กระบวนการทำหนังสั้น ตั้งแต่เขียนบทจนถึงตัดต่อ', 
    location: 'ห้องคอมพิวเตอร์กราฟิก', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [3, 4, 5, 6]
  },
  { 
    id: 'C021', 
    name: 'Board Game Club', 
    teacherName: 'ครูวางแผน กลยุทธ์', 
    description: 'ฝึกทักษะการคิดวิเคราะห์ผ่านการเล่นบอร์ดเกม', 
    location: 'ห้องสมุดโซนกิจกรรม', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C022', 
    name: 'เกษตรพอเพียง', 
    teacherName: 'ครูดิน ปลูกผัก', 
    description: 'เรียนรู้การปลูกผักสวนครัวและการทำปุ๋ยหมัก', 
    location: 'แปลงเกษตรหลังโรงเรียน', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.SOCIAL,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  },
  { 
    id: 'C023', 
    name: 'รักการอ่าน', 
    teacherName: 'ครูหนอนหนังสือ', 
    description: 'ส่งเสริมนิสัยรักการอ่าน และกิจกรรมรีวิวหนังสือ', 
    location: 'ห้องสมุด', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3, 4, 5, 6]
  }
];

interface Registration {
  studentId: string;
  clubId: string;
}

export const mockRegistrations: Registration[] = [
    { studentId: '1111111111111', clubId: 'C001'},
    { studentId: '2222222222222', clubId: 'C001'},
    // Add students to Thai Club (C005)
    { studentId: '3333333333333', clubId: 'C005'},
    { studentId: '4444444444444', clubId: 'C005'},
    { studentId: '5555555555555', clubId: 'C005'},
    { studentId: '6666666666666', clubId: 'C005'},
    { studentId: '7777777777777', clubId: 'C005'},
    { studentId: '8888888888888', clubId: 'C005'},
    
    // Club C003 is full
    ...Array.from({ length: 25 }, (_, i) => ({ studentId: `S_FULL_${i}`, clubId: 'C003' })),
];

export const mockWeeklyReports: WeeklyReport[] = [
    { 
        id: 'WR001', 
        clubId: 'C001', 
        week: 1, 
        date: '2024-05-10', 
        topic: 'แนะนำ AI และเครื่องมือที่ใช้', 
        details: 'แนะนำนักเรียนเกี่ยวกับประวัติของ AI และสาธิตการใช้งานเครื่องมือเบื้องต้น เช่น Teachable Machine',
        imageUrl: undefined
    },
];

export const mockAttendance: AttendanceRecord[] = [
    { studentId: '1111111111111', clubId: 'C001', date: '2024-05-10', status: AttendanceStatus.PRESENT },
    { studentId: '2222222222222', clubId: 'C001', date: '2024-05-10', status: AttendanceStatus.LATE },
];

export const mockGrading: GradingRecord[] = [];

export const mockAnnouncements: Announcement[] = [
    {
        id: 'A001',
        clubId: 'C001',
        clubName: 'ชุมนุม AI และนวัตกรรม',
        teacherName: 'ครูวิชาการ สอนดี',
        message: 'เปิดรับสมาชิกเพิ่มอีก 5 ที่นั่ง เนื่องจากมีการขยายห้องเรียน',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: AnnouncementType.SUCCESS
    },
    {
        id: 'A002',
        clubId: 'C003',
        clubName: 'ชุมนุมกีฬาฟุตซอล',
        teacherName: 'ครูพละ แข็งแรง',
        message: 'สัปดาห์หน้าย้ายสถานที่เรียนไปที่สนามฟุตบอล 2 ชั่วคราวครับ',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: AnnouncementType.ALERT
    }
];
