
import React, { useState, useEffect, useCallback } from 'react';
import { Student, ClubWithStudentStatus, ClubCategory, AIRecommendation, Announcement, AnnouncementType } from '../types';
import { getClubsForStudent, registerForClub, cancelRegistration, getAIClubRecommendations, getAnnouncements } from '../services/api';
import ClubCard from './ClubCard';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import { SYSTEM_CONFIG } from '../data/mockData';

interface StudentDashboardProps {
  student: Student;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student: initialStudent }) => {
  const { user, updateUser } = useAuth();
  const student = user as Student;

  const [clubs, setClubs] = useState<ClubWithStudentStatus[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<ClubWithStudentStatus[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Security Verification State
  const [pendingAction, setPendingAction] = useState<{ type: 'REGISTER' | 'CANCEL', clubId?: string, clubName?: string } | null>(null);
  const [verificationId, setVerificationId] = useState('');
  const [verifyError, setVerifyError] = useState('');


  // AI Logic
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [studentInterests, setStudentInterests] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [clubsData, announcementsData] = await Promise.all([
          getClubsForStudent(student.id),
          getAnnouncements()
      ]);
      setClubs(clubsData);
      setAnnouncements(announcementsData);
    } catch (err: any) {
      setError('ไม่สามารถโหลดข้อมูลชุมนุมได้');
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedCategory === 'ALL') {
        setFilteredClubs(clubs);
    } else {
        setFilteredClubs(clubs.filter(c => c.category === selectedCategory));
    }
  }, [clubs, selectedCategory]);

  const handleConfirmAction = async () => {
      if (!pendingAction) return;
      if (!verificationId.trim()) {
          setVerifyError('กรุณากรอกเลขประจำตัวประชาชน หรือ G-ID');
          return;
      }

      setVerifyError('');
      const actionType = pendingAction.type;
      const targetClubId = pendingAction.clubId;
      
      // Temporary loading state for modal
      // We use actionLoading to show spinner on card, but here we are in modal
      // Let's just use existing actionLoading logic for card, but wait for promise here
      if (targetClubId) setActionLoading(targetClubId);
      else if (student.registeredClubId) setActionLoading(student.registeredClubId);

      try {
          if (actionType === 'REGISTER' && targetClubId) {
             const updatedStudent = await registerForClub(student.id, targetClubId, verificationId);
             updateUser(updatedStudent);
          } else if (actionType === 'CANCEL') {
             const updatedStudent = await cancelRegistration(student.id, verificationId);
             updateUser(updatedStudent);
          }
          await fetchData();
          closeVerificationModal();
      } catch (err: any) {
          setVerifyError(err.message || 'รหัสยืนยันไม่ถูกต้อง หรือเกิดข้อผิดพลาด');
      } finally {
          setActionLoading(null);
      }
  };

  const closeVerificationModal = () => {
      setPendingAction(null);
      setVerificationId('');
      setVerifyError('');
  };

  const openRegisterModal = (club: ClubWithStudentStatus) => {
      setPendingAction({ type: 'REGISTER', clubId: club.id, clubName: club.name });
  };
  
  const openCancelModal = () => {
      const currentClub = clubs.find(c => c.id === student.registeredClubId);
      setPendingAction({ type: 'CANCEL', clubName: currentClub?.name || 'ชุมนุมปัจจุบัน' });
  };

  const isNewStudent = student.className.includes('ม.1') || student.className.includes('ม.4');

  const handleAiAnalyze = async () => {
    if (!studentInterests.trim()) return;
    setIsAiLoading(true);
    try {
        const recommendations = await getAIClubRecommendations(studentInterests, student.className);
        setAiRecommendations(recommendations);
        setIsAiModalOpen(false); // Close input modal
        // Filter to show recommended clubs
    } catch (e) {
        alert('เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่');
    } finally {
        setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-teal-700">สวัสดี, {student.name}</h1>
        <div className="mt-2 text-sm text-slate-500 flex flex-wrap gap-4">
             <span>รหัส: {student.studentId}</span>
             <span>ชั้น: {student.className}</span>
             <span>ที่ปรึกษา: {student.advisor}</span>
        </div>
        
        <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <p className="text-sm text-teal-800">
                    สิทธิ์การยกเลิกคงเหลือ: <span className="font-bold text-lg">{student.cancellationsLeft}</span> ครั้ง
                </p>
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    สิ้นสุดการลงทะเบียน: {new Date(SYSTEM_CONFIG.registrationDeadline).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
                </p>
             </div>
             {isNewStudent && !student.registeredClubId && (
                 <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                     ช่วยเลือกชุมนุมด้วย AI
                 </button>
             )}
        </div>
      </div>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-amber-400">
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-semibold text-amber-800">ข่าวประชาสัมพันธ์</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto">
                  {announcements.map(ann => (
                      <div key={ann.id} className="p-3 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded text-white mr-2 flex-shrink-0 ${ann.type === AnnouncementType.ALERT ? 'bg-red-500' : ann.type === AnnouncementType.SUCCESS ? 'bg-green-500' : 'bg-blue-500'}`}>
                                  {ann.type === AnnouncementType.ALERT ? '!' : ann.type === AnnouncementType.SUCCESS ? '★' : 'i'}
                              </span>
                              <div className="flex-grow">
                                  <p className="text-sm text-gray-800 font-medium">[{ann.clubName}] {ann.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{new Date(ann.timestamp).toLocaleDateString()} โดย {ann.teacherName}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
      
      {error && <div className="p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}

      <div className="sticky top-16 z-10 bg-slate-100 pb-2 pt-2 -mx-4 px-4 md:static md:bg-transparent md:mx-0 md:p-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'ALL' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
                >
                    ทั้งหมด
                </button>
                {Object.values(ClubCategory).map(cat => (
                     <button 
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
                 >
                     {cat}
                 </button>
                ))}
          </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => {
              const recommendation = aiRecommendations.find(r => r.clubId === club.id);
              return (
                <ClubCard 
                key={club.id} 
                club={club} 
                student={student}
                onRegister={() => openRegisterModal(club)}
                onCancel={openCancelModal}
                isLoading={actionLoading === club.id}
                recommendedReason={recommendation?.reason}
                />
              );
          })}
          {filteredClubs.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                  ไม่พบชุมนุมในหมวดหมู่นี้
              </div>
          )}
        </div>
      )}

       {/* Security Verification Modal */}
       <Modal
        isOpen={pendingAction !== null}
        onClose={closeVerificationModal}
        onConfirm={handleConfirmAction}
        title={pendingAction?.type === 'REGISTER' ? 'ยืนยันการลงทะเบียน' : 'ยืนยันการยกเลิก'}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <div className="space-y-4">
             <p>
                 {pendingAction?.type === 'REGISTER' 
                    ? `คุณต้องการลงทะเบียน "${pendingAction?.clubName}" ใช่หรือไม่?` 
                    : `คุณต้องการยกเลิกการลงทะเบียนชุมนุมเดิม ใช่หรือไม่? (สิทธิ์คงเหลือ ${student.cancellationsLeft - 1} ครั้ง)`}
             </p>
             <div className="pt-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                     กรุณากรอกเลขประจำตัวประชาชน หรือ G-ID เพื่อยืนยัน
                 </label>
                 <input 
                    type="password"
                    value={verificationId}
                    onChange={(e) => setVerificationId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="เลข 13 หลัก"
                 />
                 <p className="text-xs text-gray-500 mt-1">* เพื่อป้องกันการแอบอ้างสิทธิ์โดยผู้อื่น</p>
                 
                 {/* Hint for Demo Testing */}
                 <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
                     <span className="font-bold">💡 สำหรับทดสอบ:</span> เลขประชาชนของคุณคือ <code className="bg-white px-1 rounded border border-blue-200 select-all">{student.id}</code>
                 </div>

                 {verifyError && (
                     <p className="text-sm text-red-600 mt-2">{verifyError}</p>
                 )}
             </div>
        </div>
      </Modal>

      {/* AI Interest Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h3 className="text-xl font-bold">🎯 ค้นหาชุมนุมที่ใช่ด้วย AI</h3>
                    <p className="text-indigo-100 text-sm mt-1">บอกความสนใจของคุณ เราจะช่วยแนะนำชุมนุมที่เหมาะสมให้</p>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">คุณสนใจเรื่องอะไรเป็นพิเศษ? (เช่น กีฬา, คอมพิวเตอร์, วาดรูป)</label>
                    <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 resize-none"
                        placeholder="หนูชอบเล่นดนตรีค่ะ และอยากลองทำอาหารด้วย..."
                        value={studentInterests}
                        onChange={(e) => setStudentInterests(e.target.value)}
                    ></textarea>
                    
                    <div className="mt-6 flex justify-end gap-3">
                         <button 
                            onClick={() => setIsAiModalOpen(false)}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            onClick={handleAiAnalyze}
                            disabled={!studentInterests.trim() || isAiLoading}
                            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2"
                        >
                            {isAiLoading ? (
                                <>
                                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังวิเคราะห์...
                                </>
                            ) : 'วิเคราะห์ข้อมูล'}
                        </button>
                    </div>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
