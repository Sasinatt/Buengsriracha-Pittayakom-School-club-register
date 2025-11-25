
import { mockUsers, mockClubs, mockRegistrations, mockWeeklyReports, mockAttendance, mockGrading, mockAnnouncements } from '../data/mockData';
import { User, Club, ClubWithStudentStatus, Student, ClubRoster, UserRole, AttendanceStatus, AttendanceRecord, WeeklyReport, Teacher, AcademicStaff, GradingRecord, AIRecommendation, Announcement } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

const LATENCY = 500; // ms

export type LoginCredentials = 
    | { role: 'student'; studentId: string; className: string; } 
    | { role: 'teacher'; teacherId: string; };


// --- AUTH ---
export const apiLogin = (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let user: User | undefined;
      
      switch (credentials.role) {
        case 'student':
          user = mockUsers.find(u => 
            u.role === UserRole.STUDENT && 
            (u as Student).studentId === credentials.studentId && 
            (u as Student).className === credentials.className
          );
           if (!user) {
             reject(new Error('ไม่พบข้อมูลนักเรียน กรุณาตรวจสอบรหัสนักเรียน และห้องเรียน'));
             return;
           }
          break;
        case 'teacher':
           user = mockUsers.find(u => 
            (u.role === UserRole.TEACHER || u.role === UserRole.ACADEMIC) &&
            (u as Teacher | AcademicStaff).teacherId === credentials.teacherId
          );
           if (!user) {
             reject(new Error('ไม่พบข้อมูลผู้ใช้ กรุณาตรวจสอบรหัสครู'));
             return;
           }
          break;
        default:
          reject(new Error('Invalid role specified for login.'));
          return;
      }

      if (user.role === UserRole.STUDENT) {
          const registration = mockRegistrations.find(r => r.studentId === user!.id);
          resolve({ ...user, registeredClubId: registration?.clubId || null });
      } else {
          resolve(user);
      }
    }, LATENCY);
  });
};

export const apiLogout = (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, LATENCY / 2);
    });
};


// --- STUDENT ---
const extractGradeLevel = (className: string): number => {
    // Expect "ม.1/1" -> returns 1
    const match = className.match(/ม\.(\d+)/);
    return match ? parseInt(match[1]) : 0;
};

export const getClubsForStudent = (studentId: string): Promise<ClubWithStudentStatus[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const student = mockUsers.find(u => u.id === studentId) as Student;
            const studentGrade = extractGradeLevel(student.className);
            const studentRegistration = mockRegistrations.find(r => r.studentId === studentId);
            
            const clubsWithStatus: ClubWithStudentStatus[] = mockClubs.map(club => {
                const currentSeats = mockRegistrations.filter(r => r.clubId === club.id).length;
                const isAllowedGrade = club.allowedGrades.includes(studentGrade);
                
                return {
                    ...club,
                    currentSeats,
                    isRegistered: club.id === studentRegistration?.clubId,
                    isFull: currentSeats >= club.maxSeats,
                    isAllowedGrade: isAllowedGrade,
                };
            });
            resolve(clubsWithStatus);
        }, LATENCY);
    });
};

export const registerForClub = (studentId: string, clubId: string, personalId: string): Promise<Student> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const student = mockUsers.find(u => u.id === studentId && u.role === UserRole.STUDENT) as Student | undefined;
            if (!student) return reject(new Error("Student not found."));

            // Verify Personal ID
            if (student.id !== personalId) {
                return reject(new Error("เลขประจำตัวประชาชน หรือ G-ID ไม่ถูกต้อง"));
            }

            const existingRegistration = mockRegistrations.find(r => r.studentId === studentId);
            if (existingRegistration) return reject(new Error("นักเรียนได้ลงทะเบียนชุมนุมอื่นแล้ว กรุณายกเลิกก่อน"));

            const club = mockClubs.find(c => c.id === clubId);
            if (!club) return reject(new Error("Club not found."));

            // Check Grade Level
            const studentGrade = extractGradeLevel(student.className);
            if (!club.allowedGrades.includes(studentGrade)) {
                return reject(new Error(`ชุมนุมนี้ไม่เปิดรับนักเรียนชั้น ม.${studentGrade}`));
            }

            const currentSeats = mockRegistrations.filter(r => r.clubId === clubId).length;
            if (currentSeats >= club.maxSeats) return reject(new Error("ชุมนุมนี้เต็มแล้ว"));

            mockRegistrations.push({ studentId, clubId });
            const updatedStudent: Student = { ...student, registeredClubId: clubId };

            // Update student in mockUsers array
            const userIndex = mockUsers.findIndex(u => u.id === studentId);
            mockUsers[userIndex] = updatedStudent;

            resolve(updatedStudent);
        }, LATENCY);
    });
};

export const cancelRegistration = (studentId: string, personalId: string): Promise<Student> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const student = mockUsers.find(u => u.id === studentId && u.role === UserRole.STUDENT) as Student | undefined;
            if (!student) return reject(new Error("Student not found."));

             // Verify Personal ID
             if (student.id !== personalId) {
                return reject(new Error("เลขประจำตัวประชาชน หรือ G-ID ไม่ถูกต้อง"));
            }

            if (student.cancellationsLeft <= 0) return reject(new Error("คุณใช้สิทธิ์ยกเลิกครบจำนวนแล้ว"));

            const registrationIndex = mockRegistrations.findIndex(r => r.studentId === studentId);
            if (registrationIndex === -1) return reject(new Error("Student not registered in any club."));
            
            mockRegistrations.splice(registrationIndex, 1);
            
            const updatedStudent: Student = { 
                ...student, 
                registeredClubId: null, 
                cancellationsLeft: student.cancellationsLeft - 1 
            };
            
            const userIndex = mockUsers.findIndex(u => u.id === studentId);
            mockUsers[userIndex] = updatedStudent;

            resolve(updatedStudent);
        }, LATENCY);
    });
};

// --- ANNOUNCEMENTS ---
export const getAnnouncements = (): Promise<Announcement[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Sort by latest
            const sorted = [...mockAnnouncements].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            resolve(sorted);
        }, LATENCY);
    });
};

export const createAnnouncement = (announcement: Omit<Announcement, 'id' | 'timestamp'>): Promise<Announcement> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newAnnouncement: Announcement = {
                ...announcement,
                id: `A${Date.now()}`,
                timestamp: new Date().toISOString()
            };
            mockAnnouncements.push(newAnnouncement);
            resolve(newAnnouncement);
        }, LATENCY);
    });
};


// --- AI RECOMMENDATION ---
export const getAIClubRecommendations = async (interests: string, grade: string): Promise<AIRecommendation[]> => {
    // If no API key is set, return a mock response to prevent crash in demo
    if (!process.env.API_KEY) {
        console.warn("API_KEY not found. Returning mock AI recommendations.");
        // Simple mock logic based on interests keywords
        const keywords = interests.toLowerCase();
        let recommendedIds = [];
        if (keywords.includes('sport') || keywords.includes('กีฬา')) recommendedIds = ['C003'];
        else if (keywords.includes('tech') || keywords.includes('คอม') || keywords.includes('ai')) recommendedIds = ['C001'];
        else if (keywords.includes('art') || keywords.includes('ศิลปะ') || keywords.includes('วาด')) recommendedIds = ['C002'];
        else recommendedIds = ['C005', 'C001', 'C002']; // Fallback

        return recommendedIds.map(id => ({
            clubId: id,
            reason: "ระบบแนะนำตามคีย์เวิร์ดความสนใจของคุณ (Mock Data due to missing API Key)"
        }));
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Filter clubs available for the grade first
    const studentGradeNum = extractGradeLevel(grade);
    const availableClubs = mockClubs.filter(c => c.allowedGrades.includes(studentGradeNum));
    
    const clubListString = JSON.stringify(availableClubs.map(c => ({ id: c.id, name: c.name, description: c.description, category: c.category })));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Act as a school counselor AI.
                Analyze the student's interests and recommend the top 3 clubs from the provided list.
                
                Student Grade: ${grade}
                Student Interests: "${interests}"
                
                Available Clubs: ${clubListString}
                
                Return the result strictly in JSON format matching the schema.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            clubId: { type: Type.STRING },
                            reason: { type: Type.STRING, description: "เหตุผลสั้นๆ ภาษาไทย ว่าทำไมชุมนุมนี้ถึงเหมาะกับนักเรียน" }
                        },
                        required: ["clubId", "reason"]
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const recommendations = JSON.parse(jsonStr) as AIRecommendation[];
        return recommendations;

    } catch (error) {
        console.error("AI Recommendation Error:", error);
        throw new Error("ไม่สามารถประมวลผลคำแนะนำได้ในขณะนี้");
    }
};


// --- TEACHER ---
export const getTeacherClubData = (clubId: string): Promise<ClubRoster> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const club = mockClubs.find(c => c.id === clubId);
            if (!club) return reject(new Error("Club not found."));

            const registeredStudentIds = mockRegistrations
                .filter(r => r.clubId === clubId)
                .map(r => r.studentId);
            
            const students = mockUsers.filter(u => u.role === UserRole.STUDENT && registeredStudentIds.includes(u.id)) as Student[];
            
            const roster: ClubRoster = {
                ...club,
                students: students.map(({ id, studentId, name, className }) => ({ id, studentId, name, className })),
            };
            resolve(roster);
        }, LATENCY);
    });
};

export const updateClubLeaders = (clubId: string, presidentId: string | null, vicePresidentId: string | null): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const club = mockClubs.find(c => c.id === clubId);
            if (!club) return reject(new Error("Club not found"));

            club.presidentId = presidentId || undefined;
            club.vicePresidentId = vicePresidentId || undefined;
            resolve();
        }, LATENCY);
    });
};

export const getClubAttendance = (clubId: string, date: string): Promise<Map<string, AttendanceStatus>> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const records = mockAttendance.filter(a => a.clubId === clubId && a.date === date);
            const attendanceMap = new Map<string, AttendanceStatus>();
            records.forEach(r => attendanceMap.set(r.studentId, r.status));
            resolve(attendanceMap);
        }, LATENCY / 2);
    });
};

export const getAllClubAttendance = (clubId: string): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const records = mockAttendance.filter(a => a.clubId === clubId);
            resolve(records);
        }, LATENCY);
    });
};

export const saveClubAttendance = (clubId: string, date: string, attendanceData: Map<string, AttendanceStatus>): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Remove old records for this date and club
            for (let i = mockAttendance.length - 1; i >= 0; i--) {
                if (mockAttendance[i].clubId === clubId && mockAttendance[i].date === date) {
                    mockAttendance.splice(i, 1);
                }
            }
            // Add new records
            attendanceData.forEach((status, studentId) => {
                mockAttendance.push({ clubId, studentId, date, status });
            });
            resolve();
        }, LATENCY);
    });
};


export const getWeeklyReports = (clubId: string): Promise<WeeklyReport[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const reports = mockWeeklyReports.filter(r => r.clubId === clubId).sort((a, b) => b.week - a.week);
            resolve(reports);
        }, LATENCY);
    });
};

export const saveWeeklyReport = (reportData: Omit<WeeklyReport, 'id'>): Promise<WeeklyReport> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newReport: WeeklyReport = {
                ...reportData,
                id: `WR00${mockWeeklyReports.length + 1}`,
            };
            mockWeeklyReports.push(newReport);
            resolve(newReport);
        }, LATENCY);
    });
};

export const updateWeeklyReport = (report: WeeklyReport): Promise<WeeklyReport> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockWeeklyReports.findIndex(r => r.id === report.id);
            if (index === -1) return reject(new Error("Report not found"));
            mockWeeklyReports[index] = report;
            resolve(report);
        }, LATENCY);
    });
};

export const submitClubSummary = (clubId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const club = mockClubs.find(c => c.id === clubId);
            if (!club) return reject(new Error("Club not found"));

            club.reportSubmitted = true;
            club.reportSubmissionDate = new Date().toISOString();
            resolve();
        }, LATENCY);
    });
};

// --- GRADING ---
export const getClubGrading = (clubId: string): Promise<GradingRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const grading = mockGrading.filter(g => g.clubId === clubId);
            resolve(grading);
        }, LATENCY);
    });
};

export const saveClubGrading = (clubId: string, gradingData: GradingRecord[]): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
             gradingData.forEach(record => {
                 const index = mockGrading.findIndex(g => g.clubId === clubId && g.studentId === record.studentId);
                 if (index > -1) {
                     mockGrading[index] = record;
                 } else {
                     mockGrading.push(record);
                 }
             });
            resolve();
        }, LATENCY);
    });
};


// --- ACADEMIC ---
export const getAcademicOverview = (): Promise<{clubs: Club[], unregistered: Student[]}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
             const overview = mockClubs.map(club => ({
                ...club,
                currentSeats: mockRegistrations.filter(r => r.clubId === club.id).length,
            }));

            // Find unregistered students
            const registeredIds = mockRegistrations.map(r => r.studentId);
            const unregistered = mockUsers
                .filter(u => u.role === UserRole.STUDENT && !registeredIds.includes(u.id)) as Student[];

            resolve({ clubs: overview, unregistered });
        }, LATENCY);
    });
};

export const getClubDetailsForAdmin = (clubId: string): Promise<{ club: ClubRoster, teacher: Teacher }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const club = mockClubs.find(c => c.id === clubId);
            if (!club) return reject(new Error("Club not found"));

            // Get Teacher information
            // In mock data, we find teacher by assignedClubId
            const teacher = mockUsers.find(u => u.role === UserRole.TEACHER && (u as Teacher).assignedClubId === clubId) as Teacher;
            // Create a fallback teacher object if not found in users list (though mock data is consistent)
            const teacherObj = teacher || { 
                id: 'unknown', 
                name: club.teacherName, 
                role: UserRole.TEACHER, 
                assignedClubId: clubId, 
                teacherId: 'unknown' 
            } as Teacher;

            // Get Roster
            const registeredStudentIds = mockRegistrations
                .filter(r => r.clubId === clubId)
                .map(r => r.studentId);
            
            const students = mockUsers.filter(u => u.role === UserRole.STUDENT && registeredStudentIds.includes(u.id)) as Student[];
            
            const roster: ClubRoster = {
                ...club,
                students: students.map(({ id, studentId, name, className }) => ({ id, studentId, name, className })),
            };

            resolve({ club: roster, teacher: teacherObj });
        }, LATENCY);
    });
};

export const autoAssignStudents = (): Promise<{ assignedCount: number, failedCount: number }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Find unregistered students
            const registeredIds = mockRegistrations.map(r => r.studentId);
            const unregistered = mockUsers
                .filter(u => u.role === UserRole.STUDENT && !registeredIds.includes(u.id)) as Student[];
            
            let assignedCount = 0;
            let failedCount = 0;

            // Calculate current seats for all clubs locally
            const clubSeatCounts: {[key: string]: number} = {};
            mockClubs.forEach(club => {
                clubSeatCounts[club.id] = mockRegistrations.filter(r => r.clubId === club.id).length;
            });

            // Iterate and assign
            unregistered.forEach(student => {
                const studentGrade = extractGradeLevel(student.className);
                
                // Find suitable clubs: allowed grade, has seats
                const availableClubs = mockClubs.filter(club => {
                    const currentSeats = clubSeatCounts[club.id];
                    return club.allowedGrades.includes(studentGrade) && currentSeats < club.maxSeats;
                });

                if (availableClubs.length > 0) {
                    // Pick a random club from available options
                    const randomClub = availableClubs[Math.floor(Math.random() * availableClubs.length)];
                    
                    mockRegistrations.push({
                        studentId: student.id,
                        clubId: randomClub.id
                    });
                    
                    // Update stats
                    clubSeatCounts[randomClub.id]++;
                    assignedCount++;
                    
                    // Update student object (optional, but good for consistency)
                    const userIndex = mockUsers.findIndex(u => u.id === student.id);
                    if(userIndex !== -1) {
                        (mockUsers[userIndex] as Student).registeredClubId = randomClub.id;
                    }

                } else {
                    failedCount++;
                }
            });

            resolve({ assignedCount, failedCount });
        }, LATENCY * 2);
    });
};