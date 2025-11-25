
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ACADEMIC = 'ACADEMIC',
}

export interface BaseUser {
  id: string; // National ID or G-ID
  name: string;
  role: UserRole;
}

export interface Student extends BaseUser {
  role: UserRole.STUDENT;
  studentId: string;
  className: string;
  advisor: string;
  cancellationsLeft: number;
  registeredClubId?: string | null;
}

export interface Teacher extends BaseUser {
  role: UserRole.TEACHER;
  assignedClubId: string;
  teacherId: string;
}

export interface AcademicStaff extends BaseUser {
  role: UserRole.ACADEMIC;
  teacherId: string;
}

export type User = Student | Teacher | AcademicStaff;

export enum ClubCategory {
  ACADEMIC = 'วิชาการ',
  SPORTS = 'กีฬา',
  ARTS = 'ศิลปะและดนตรี',
  SOCIAL = 'บำเพ็ญประโยชน์/สังคม',
  TECHNOLOGY = 'เทคโนโลยี',
  GENERAL = 'ทั่วไป'
}

export interface Club {
  id: string;
  name: string;
  teacherName: string;
  teacherImageUrl?: string;
  description: string;
  location: string;
  maxSeats: number;
  currentSeats: number;
  category: ClubCategory;
  allowedGrades: number[]; // e.g., [1, 2, 3] for Junior High, [4, 5, 6] for Senior High
  objectives?: string;
  benefits?: string;
  presidentId?: string;
  vicePresidentId?: string;
  reportSubmitted?: boolean;
  reportSubmissionDate?: string;
}

export interface ClubWithStudentStatus extends Club {
  isRegistered: boolean;
  isFull: boolean;
  isAllowedGrade: boolean;
}

export interface ClubRoster extends Club {
    students: Pick<Student, 'id' | 'studentId' | 'name' | 'className'>[];
}

export enum AttendanceStatus {
  PRESENT = 'มาเรียน',
  ABSENT = 'ขาดเรียน',
  LATE = 'มาสาย',
  SICK = 'ลาป่วย',
  PERSONAL = 'ลากิจ',
}

export interface AttendanceRecord {
  studentId: string;
  clubId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface WeeklyReport {
  id: string;
  clubId: string;
  week: number;
  date: string; // YYYY-MM-DD
  topic: string;
  details: string;
  imageUrl?: string;
}

export enum GradingStatus {
  PENDING = 'PENDING',
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export interface GradingRecord {
  studentId: string;
  clubId: string;
  status: GradingStatus;
  failureReasons?: string[];
}

export interface AIRecommendation {
  clubId: string;
  reason: string;
}

export enum AnnouncementType {
  INFO = 'INFO',
  ALERT = 'ALERT', // e.g., Location change
  SUCCESS = 'SUCCESS', // e.g., Seats added
}

export interface Announcement {
  id: string;
  clubId: string;
  clubName: string;
  teacherName: string;
  message: string;
  timestamp: string; // ISO string
  type: AnnouncementType;
}
