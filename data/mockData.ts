
import { User, Club, UserRole, WeeklyReport, AttendanceRecord, AttendanceStatus, GradingRecord, ClubCategory, Announcement, AnnouncementType, GradingStatus } from '../types';

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
    teacherImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    description: 'เรียนรู้เกี่ยวกับการสร้าง AI และการเขียนโปรแกรมเบื้องต้น', 
    location: 'อาคาร 3 ห้องคอมพิวเตอร์ 1', 
    maxSeats: 25, 
    currentSeats: 1,
    category: ClubCategory.TECHNOLOGY,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'เพื่อให้ผู้เรียนมีความรู้ความเข้าใจเกี่ยวกับเทคโนโลยีปัญญาประดิษฐ์ (AI) และสามารถสร้างนวัตกรรมเบื้องต้นได้',
    benefits: 'ทักษะการเขียนโปรแกรม (Coding), ความคิดสร้างสรรค์เชิงนวัตกรรม, การรู้เท่าทันเทคโนโลยี',
    reportSubmitted: true,
    reportSubmissionDate: '2025-03-01T10:00:00Z'
  },
  { 
    id: 'C002', 
    name: 'ชุมนุมศิลปะสร้างสรรค์', 
    teacherName: 'ครูศิลปะ วาดสวย', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกฝนทักษะการวาดภาพและสร้างสรรค์ผลงานศิลปะหลากหลายรูปแบบ', 
    location: 'อาคารศิลปะ ห้อง 201', 
    maxSeats: 25, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [1, 2, 3], // ม.ต้น
    objectives: 'ส่งเสริมจินตนาการและความคิดสร้างสรรค์ผ่านงานศิลปะรูปแบบต่างๆ',
    benefits: 'สมาธิ, ทักษะทางศิลปะ, การผ่อนคลายความเครียด, ผลงานสะสม (Portfolio)',
    reportSubmitted: false
  },
  { 
    id: 'C003', 
    name: 'ชุมนุมกีฬาฟุตซอล', 
    teacherName: 'ครูพละ แข็งแรง', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    description: 'พัฒนาทักษะการเล่นกีฬาฟุตซอลและทำงานเป็นทีม', 
    location: 'สนามฟุตซอล', 
    maxSeats: 25, 
    currentSeats: 25,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'เพื่อพัฒนาทักษะทางกีฬาฟุตซอลและเสริมสร้างสมรรถภาพทางกาย',
    benefits: 'ร่างกายแข็งแรง, น้ำใจนักกีฬา, ทักษะการทำงานเป็นทีม (Teamwork)',
    reportSubmitted: false
  },
  { 
    id: 'C004', 
    name: 'ชุมนุมดนตรีสากล', 
    teacherName: 'ครูเมโลดี้', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=200&auto=format&fit=crop',
    description: 'เรียนรู้การเล่นเครื่องดนตรีสากลและร่วมวงดนตรี', 
    location: 'ห้องดนตรีสากล', 
    maxSeats: 25, 
    currentSeats: 10,
    category: ClubCategory.ARTS,
    allowedGrades: [4, 5, 6], // ม.ปลาย
    objectives: 'ฝึกทักษะการเล่นดนตรีสากลและการรวมวงดนตรี',
    benefits: 'ความสุนทรียทางดนตรี, การแสดงออกอย่างสร้างสรรค์, การใช้เวลาว่างให้เป็นประโยชน์',
    reportSubmitted: false
  },
  { 
    id: 'C005', 
    name: 'ชุมนุมภาษาไทย', 
    teacherName: 'ครูภาษาไทย รักชาติ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    description: 'เรียนรู้หลักภาษาไทยและการแต่งคำประพันธ์', 
    location: 'อาคาร 4 ห้อง 401', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'เพื่ออนุรักษ์ภาษาไทยและส่งเสริมทักษะการใช้ภาษาไทยที่ถูกต้อง',
    benefits: 'ทักษะการสื่อสาร, การแต่งคำประพันธ์, ความรักและความภูมิใจในความเป็นไทย',
    presidentId: '6666666666666',
    vicePresidentId: '5555555555555',
    reportSubmitted: false
  },
  { 
    id: 'C006', 
    name: 'ชุมนุมอาสาพัฒนาชุมชน', 
    teacherName: 'ครูจิตอาสา ใจดี', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop',
    description: 'ร่วมกันทำกิจกรรมบำเพ็ญประโยชน์ พัฒนาโรงเรียนและชุมชนรอบข้าง', 
    location: 'อาคารกิจกรรม', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.SOCIAL,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'ปลูกฝังจิตสาธารณะและการเสียสละเพื่อส่วนรวม',
    benefits: 'การรู้จักให้และแบ่งปัน, ความภาคภูมิใจในตนเอง, เพื่อนใหม่ต่างระดับชั้น',
    reportSubmitted: false
  },
  { 
    id: 'C007', 
    name: 'ชุมนุมอาหารและเครื่องดื่ม', 
    teacherName: 'ครูรสริน หวานเจี๊ยบ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกการทำอาหารว่าง ขนมไทย และเครื่องดื่มประเภทต่างๆ', 
    location: 'อาคารคหกรรม ห้อง 1', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'ฝึกทักษะการประกอบอาหารเบื้องต้นและการจัดตกแต่งจาน',
    benefits: 'สามารถทำอาหารทานเองได้, ทักษะอาชีพพื้นฐาน, ความละเอียดรอบคอบ',
    reportSubmitted: false
  },
  { 
    id: 'C008', 
    name: 'ชุมนุมงานประดิษฐ์ DIY', 
    teacherName: 'ครูสร้างสรรค์ งานฝีมือ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop',
    description: 'ประดิษฐ์ของใช้ของตกแต่งจากวัสดุเหลือใช้และวัสดุธรรมชาติ', 
    location: 'ห้องงานบ้าน', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3], // ม.ต้น
    objectives: 'ส่งเสริมความคิดสร้างสรรค์และการนำวัสดุเหลือใช้มาให้เกิดประโยชน์',
    benefits: 'ลดขยะ, ได้ของใช้ฝีมือตนเอง, ความภาคภูมิใจ, ทักษะงานฝีมือ',
    reportSubmitted: false
  },
  // --- New Clubs ---
  { 
    id: 'C009', 
    name: 'ชมรม E-Sports', 
    teacherName: 'ครูเกมเมอร์ ไซเบอร์', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกฝนทักษะการเล่นเกมอย่างมีระบบ วางแผนทีม และการเป็นนักกีฬา E-Sports', 
    location: 'ห้องคอมพิวเตอร์ 2', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.TECHNOLOGY,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'เรียนรู้กติกา มารยาท และทักษะการเป็นนักกีฬา E-Sports มืออาชีพ',
    benefits: 'การวางแผนและกลยุทธ์, การทำงานเป็นทีม, การจัดการเวลา',
    reportSubmitted: false
  },
  { 
    id: 'C010', 
    name: 'ชุมนุมหุ่นยนต์ (Robotics)', 
    teacherName: 'ครูโรบอท ยอดอัจฉริยะ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    description: 'เรียนรู้การประกอบและเขียนโปรแกรมควบคุมหุ่นยนต์เบื้องต้น', 
    location: 'ห้องปฏิบัติการวิทยาศาสตร์ 1', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.TECHNOLOGY,
    allowedGrades: [1, 2, 3],
    objectives: 'ส่งเสริมทักษะทางวิศวกรรมและการเขียนโปรแกรมควบคุมหุ่นยนต์',
    benefits: 'พื้นฐานวิศวกรรม, การแก้ปัญหาเชิงตรรกะ, ความคิดสร้างสรรค์',
    reportSubmitted: false
  },
  { 
    id: 'C011', 
    name: 'วิทยาศาสตร์หรรษา', 
    teacherName: 'ครูวิทย์ คิดสนุก', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    description: 'ทดลองวิทยาศาสตร์สนุกๆ ที่ไม่มีในบทเรียน', 
    location: 'ห้องปฏิบัติการวิทยาศาสตร์ 2', 
    maxSeats: 25, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [1, 2, 3],
    objectives: 'กระตุ้นความสนใจในวิทยาศาสตร์ผ่านการทดลองที่สนุกสนาน',
    benefits: 'ทักษะกระบวนการทางวิทยาศาสตร์, การสังเกตและตั้งสมมติฐาน',
    reportSubmitted: false
  },
  { 
    id: 'C012', 
    name: 'คณิตศาสตร์แฟนซี', 
    teacherName: 'ครูคณิต คิดเร็ว', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop',
    description: 'เกมคณิตศาสตร์ ซูโดกุ และการแก้ปัญหาเชาวน์', 
    location: 'ห้อง 305', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'พัฒนาทักษะการคิดคำนวณและการแก้โจทย์ปัญหาผ่านเกม',
    benefits: 'ไหวพริบ, การคิดวิเคราะห์, ความสนุกสนานคู่ความรู้',
    reportSubmitted: false
  },
  { 
    id: 'C013', 
    name: 'English Debate Club', 
    teacherName: 'Teacher John Doe', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกทักษะการโต้วาทีและพูดสุนทรพจน์เป็นภาษาอังกฤษ', 
    location: 'Sound Lab', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.ACADEMIC,
    allowedGrades: [4, 5, 6],
    objectives: 'To improve public speaking and critical thinking skills in English.',
    benefits: 'English fluency, confidence in public speaking, critical thinking.',
    reportSubmitted: false
  },
  { 
    id: 'C014', 
    name: 'บาสเกตบอล', 
    teacherName: 'ครูชู้ต แม่นยำ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกพื้นฐานการเล่นบาสเกตบอลและการเล่นทีม', 
    location: 'สนามบาสเกตบอล', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'ส่งเสริมสุขภาพและทักษะกีฬาบาสเกตบอล',
    benefits: 'ความสูงและสมรรถภาพทางกาย, ทักษะกีฬา, ความสามัคคี',
    reportSubmitted: false
  },
  { 
    id: 'C015', 
    name: 'วอลเลย์บอล', 
    teacherName: 'ครูตบ หนักหน่วง', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกทักษะวอลเลย์บอล เสิร์ฟ รับ ตบ', 
    location: 'โรงยิม', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'พัฒนาทักษะพื้นฐานกีฬาวอลเลย์บอล',
    benefits: 'ร่างกายแข็งแรง, การเคลื่อนไหวที่คล่องแคล่ว, การเล่นเป็นทีม',
    reportSubmitted: false
  },
  { 
    id: 'C016', 
    name: 'แบดมินตัน', 
    teacherName: 'ครูแบด ว่องไว', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop',
    description: 'ออกกำลังกายด้วยกีฬาแบดมินตัน (ต้องเตรียมไม้มาเอง)', 
    location: 'หอประชุม', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'ส่งเสริมการออกกำลังกายด้วยกีฬาแบดมินตัน',
    benefits: 'ความว่องไว, สายตาที่ดี, สุขภาพแข็งแรง',
    reportSubmitted: false
  },
  { 
    id: 'C017', 
    name: 'เทเบิลเทนนิส (ปิงปอง)', 
    teacherName: 'ครูปิงปอง สปิน', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกทักษะการตีปิงปอง', 
    location: 'ใต้ถุนอาคาร 4', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.SPORTS,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'ฝึกสมาธิและความรวดเร็วในการโต้ตอบผ่านกีฬาปิงปอง',
    benefits: 'สมาธิ, การประสานงานระหว่างสายตากับมือ, ความคล่องตัว',
    reportSubmitted: false
  },
  { 
    id: 'C018', 
    name: 'นาฏศิลป์ไทย', 
    teacherName: 'ครูรำไทย อ่อนช้อย', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    description: 'อนุรักษ์ศิลปวัฒนธรรมไทย ฝึกรำไทยชุดต่างๆ', 
    location: 'ห้องนาฏศิลป์', 
    maxSeats: 25, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'สืบสานและอนุรักษ์ศิลปะการแสดงของไทย',
    benefits: 'บุคลิกภาพที่ดี, ความอ่อนช้อย, การอนุรักษ์วัฒนธรรม',
    reportSubmitted: false
  },
  { 
    id: 'C019', 
    name: 'ชุมนุมถ่ายภาพ', 
    teacherName: 'ครูชัตเตอร์ โฟกัส', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    description: 'เทคนิคการถ่ายภาพด้วยกล้องดิจิทัลและมือถือ', 
    location: 'ห้องโสตทัศนศึกษา', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [4, 5, 6],
    objectives: 'เรียนรู้เทคนิคการถ่ายภาพและการจัดองค์ประกอบภาพ',
    benefits: 'ทักษะการถ่ายภาพ, มุมมองทางศิลปะ, การบันทึกความทรงจำ',
    reportSubmitted: false
  },
  { 
    id: 'C020', 
    name: 'หนังสั้นและการแสดง', 
    teacherName: 'ครูผู้กำกับ ตัดต่อ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    description: 'เรียนรู้กระบวนการทำหนังสั้น ตั้งแต่เขียนบทจนถึงตัดต่อ', 
    location: 'ห้องคอมพิวเตอร์กราฟิก', 
    maxSeats: 20, 
    currentSeats: 0,
    category: ClubCategory.ARTS,
    allowedGrades: [3, 4, 5, 6],
    objectives: 'ผลิตสื่อภาพยนตร์สั้นอย่างสร้างสรรค์และทำงานเป็นทีม',
    benefits: 'ทักษะการเล่าเรื่อง (Storytelling), การตัดต่อวิดีโอ, การแสดง',
    reportSubmitted: false
  },
  { 
    id: 'C021', 
    name: 'Board Game Club', 
    teacherName: 'ครูวางแผน กลยุทธ์', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop',
    description: 'ฝึกทักษะการคิดวิเคราะห์ผ่านการเล่นบอร์ดเกม', 
    location: 'ห้องสมุดโซนกิจกรรม', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'พัฒนาทักษะการวางแผนและการเจรจาต่อรองผ่านบอร์ดเกม',
    benefits: 'ทักษะสังคม, การคิดเชิงกลยุทธ์, การรู้แพ้รู้ชนะ',
    reportSubmitted: false
  },
  { 
    id: 'C022', 
    name: 'เกษตรพอเพียง', 
    teacherName: 'ครูดิน ปลูกผัก', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=200&auto=format&fit=crop',
    description: 'เรียนรู้การปลูกผักสวนครัวและการทำปุ๋ยหมัก', 
    location: 'แปลงเกษตรหลังโรงเรียน', 
    maxSeats: 30, 
    currentSeats: 0,
    category: ClubCategory.SOCIAL,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'เรียนรู้วิถีเกษตรพอเพียงและการพึ่งพาตนเอง',
    benefits: 'ความรู้เรื่องการเกษตร, ผลผลิตปลอดสารพิษ, ความอดทน',
    reportSubmitted: false
  },
  { 
    id: 'C023', 
    name: 'รักการอ่าน', 
    teacherName: 'ครูหนอนหนังสือ', 
    teacherImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
    description: 'ส่งเสริมนิสัยรักการอ่าน และกิจกรรมรีวิวหนังสือ', 
    location: 'ห้องสมุด', 
    maxSeats: 40, 
    currentSeats: 0,
    category: ClubCategory.GENERAL,
    allowedGrades: [1, 2, 3, 4, 5, 6],
    objectives: 'ปลูกฝังนิสัยรักการอ่านและการเรียนรู้ตลอดชีวิต',
    benefits: 'ความรอบรู้, ทักษะการอ่านจับใจความ, สมาธิ',
    reportSubmitted: false
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

// Generate 18 weeks of reports for C005
const c005Reports: WeeklyReport[] = [];
const startRDate = new Date('2025-11-11');
const reportTopics = [
    { topic: 'ปฐมนิเทศและละลายพฤติกรรม', detail: 'ชี้แจงวัตถุประสงค์ชุมนุม กติกาการอยู่ร่วมกัน และกิจกรรม Ice Breaking', img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'พื้นฐานการแต่งคำประพันธ์', detail: 'เรียนรู้ฉันทลักษณ์ของกลอนสุภาพ และฝึกแต่งกลอนบทนำเกี่ยวกับการแนะนำตัว', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop' },
    { topic: 'ศิลปะการอ่านออกเสียง', detail: 'ฝึกการอ่านออกเสียงร้อยแก้วและร้อยกรองให้ถูกต้องตามอักขรวิธี', img: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'การแต่งกลอนแปด (ตอนที่ 1)', detail: 'ฝึกแต่งกลอนแปดหัวข้อ "โรงเรียนของฉัน" เน้นการสัมผัส', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop' },
    { topic: 'การแต่งกลอนแปด (ตอนที่ 2)', detail: 'วิจารณ์ผลงานเพื่อน และปรับแก้บทกลอนให้ไพเราะยิ่งขึ้น', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'วรรณคดีไทยน่ารู้', detail: 'ศึกษาวรรณคดีไทยเรื่องพระอภัยมณี และวิเคราะห์ตัวละคร', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2096&auto=format&fit=crop' },
    { topic: 'เตรียมกิจกรรมส่งท้ายปีเก่า', detail: 'วางแผนจัดกิจกรรมแลกเปลี่ยนของขวัญและทำการ์ดอวยพรด้วยคำประพันธ์', img: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'วันหยุดพิเศษ (ส่งท้ายปีเก่า)', detail: 'งดการเรียนการสอนเนื่องในเทศกาลปีใหม่', img: undefined }, // Week 8 - Dec 30
    { topic: 'ทบทวนบทเรียนและกิจกรรมปีใหม่', detail: 'ทบทวนความรู้เดิมและกิจกรรมสังสรรค์ปีใหม่ย้อนหลัง', img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'คำราชาศัพท์ในชีวิตประจำวัน', detail: 'เรียนรู้คำราชาศัพท์ที่ควรรู้และมักใช้ผิดในข่าวพระราชสำนัก', img: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1974&auto=format&fit=crop' },
    { topic: 'การพูดในที่ชุมชน (ตอนที่ 1)', detail: 'หลักการพูดแนะนำตัวและการพูดโน้มน้าวใจ', img: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=2069&auto=format&fit=crop' }, // Fixed URL
    { topic: 'การพูดในที่ชุมชน (ตอนที่ 2)', detail: 'ฝึกปฏิบัติการพูดหน้าชั้นเรียน หัวข้อ "ความภูมิใจของฉัน"', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'ภาษาถิ่นทั่วไทย', detail: 'เรียนรู้คำภาษาถิ่น เหนือ อีสาน ใต้ และเปรียบเทียบกับภาษาไทยมาตรฐาน', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop' },
    { topic: 'สำนวนไทยสอนใจ', detail: 'ทายภาพปริศนาสำนวนไทย และเรียนรู้ที่มาของสำนวนต่าง ๆ', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop' }, // Fixed URL
    { topic: 'การเขียนโครงการ (Project)', detail: 'แบ่งกลุ่มระดมสมองทำโครงงานส่งเสริมภาษาไทยในโรงเรียน', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'เตรียมนำเสนอโครงงาน', detail: 'แต่ละกลุ่มจัดทำสื่อนำเสนอและฝึกซ้อมการนำเสนอ', img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'นำเสนอผลงานโครงงาน', detail: 'นำเสนอผลงานโครงงานของแต่ละกลุ่ม และสรุปผลการเรียนรู้', img: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop' },
    { topic: 'ปัจฉิมนิเทศ', detail: 'สรุปผลการดำเนินงานชุมนุมตลอดภาคเรียน และมอบเกียรติบัตร', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop' },
];

for(let i=0; i<18; i++) {
    const d = new Date(startRDate);
    d.setDate(startRDate.getDate() + (i * 7));
    const dateStr = d.toISOString().split('T')[0];
    const content = reportTopics[i] || { topic: `สัปดาห์ที่ ${i+1}`, detail: 'กิจกรรมตามหลักสูตร', img: undefined };

    c005Reports.push({
        id: `WR005_${i+1}`,
        clubId: 'C005',
        week: i+1,
        date: dateStr,
        topic: content.topic,
        details: content.detail,
        imageUrl: content.img
    });
}

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
    ...c005Reports
];

// Generate attendance for C005
// Start date: Tuesday 11 Nov 2025 (2568 BE)
const startDate = new Date('2025-11-11');
const c005Students = ['3333333333333', '4444444444444', '5555555555555', '6666666666666', '7777777777777', '8888888888888'];
const c005Attendance: AttendanceRecord[] = [];

for(let i=0; i<18; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (i * 7));
    const dateString = currentDate.toISOString().split('T')[0];

    // Check if it is the holiday week (Dec 30, 2025)
    // Week 8 corresponds to index 7
    if (i === 7) { 
        // Skip attendance generation for holiday
        continue; 
    }

    c005Students.forEach(sid => {
        let status = AttendanceStatus.PRESENT;
        // Student 777... fails attendance (absent last 8 weeks)
        // Simulate absence starting from week 10 (i=9)
        if (sid === '7777777777777' && i >= 10) status = AttendanceStatus.ABSENT;
        
        // Random late/sick for others, but ensure 333... passes nicely
        if (sid !== '7777777777777' && Math.random() > 0.9) status = AttendanceStatus.LATE;
        if (sid !== '7777777777777' && Math.random() > 0.95) status = AttendanceStatus.SICK;
        
        c005Attendance.push({ studentId: sid, clubId: 'C005', date: dateString, status });
    });
}

export const mockAttendance: AttendanceRecord[] = [
    { studentId: '1111111111111', clubId: 'C001', date: '2024-05-10', status: AttendanceStatus.PRESENT },
    { studentId: '2222222222222', clubId: 'C001', date: '2024-05-10', status: AttendanceStatus.LATE },
    ...c005Attendance
];

export const mockGrading: GradingRecord[] = [
    { studentId: '3333333333333', clubId: 'C005', status: GradingStatus.PASS },
    { studentId: '4444444444444', clubId: 'C005', status: GradingStatus.PASS },
    { studentId: '5555555555555', clubId: 'C005', status: GradingStatus.PASS },
    { studentId: '6666666666666', clubId: 'C005', status: GradingStatus.PASS },
    { studentId: '7777777777777', clubId: 'C005', status: GradingStatus.FAIL, failureReasons: ['เวลาเรียนไม่ครบ 80%'] },
    { studentId: '8888888888888', clubId: 'C005', status: GradingStatus.FAIL, failureReasons: ['ไม่ส่งชิ้นงาน/ผลงาน'] },
];

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

export const SYSTEM_CONFIG = {
    registrationDeadline: new Date(new Date().getFullYear(), 5, 15, 16, 30).toISOString() // June 15th of current year, 16:30
};
