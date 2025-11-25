
import React from 'react';
import { ClubWithStudentStatus, Student } from '../types';

interface ClubCardProps {
  club: ClubWithStudentStatus;
  student: Student;
  onRegister: (clubId: string) => void;
  onCancel: (clubId: string) => void;
  isLoading: boolean;
  recommendedReason?: string;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, student, onRegister, onCancel, isLoading, recommendedReason }) => {
  const seatsLeft = club.maxSeats - club.currentSeats;

  const renderActionButton = () => {
    if (isLoading) {
      return (
        <button disabled className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-slate-400 rounded-lg flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          กำลังดำเนินการ...
        </button>
      );
    }
    
    if (club.isRegistered) {
      return (
        <button 
          onClick={() => onCancel(club.id)}
          disabled={student.cancellationsLeft <= 0}
          className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm"
        >
          {student.cancellationsLeft > 0 ? 'ยกเลิกการลงทะเบียน' : 'ไม่สามารถยกเลิกได้แล้ว'}
        </button>
      );
    }

    if (student.registeredClubId) {
      return (
        <div className="flex flex-col items-center w-full">
            <button disabled className="w-full mt-4 px-4 py-3 text-sm font-medium text-slate-500 bg-slate-200 rounded-lg cursor-not-allowed">
            ลงทะเบียนแล้ว
            </button>
            <p className="text-xs text-red-500 mt-2 font-medium">
                * สามารถลงทะเบียนได้สูงสุด 1 ชุมนุม
            </p>
        </div>
      );
    }

    if (!club.isAllowedGrade) {
        return (
            <button disabled className="w-full mt-4 px-4 py-3 text-sm font-medium text-slate-500 bg-slate-200 rounded-lg cursor-not-allowed">
              ไม่เปิดรับชั้นของคุณ
            </button>
          );
    }

    if (club.isFull) {
      return (
        <button disabled className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg cursor-not-allowed shadow-sm">
          เต็มแล้ว
        </button>
      );
    }

    return (
      <button 
        onClick={() => onRegister(club.id)}
        className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm active:transform active:scale-95"
      >
        ลงทะเบียน
      </button>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all flex flex-col relative ${club.isRegistered ? 'border-2 border-teal-500 ring-4 ring-teal-100' : ''} ${recommendedReason ? 'ring-2 ring-indigo-400' : ''}`}>
      
      {recommendedReason && (
          <div className="bg-indigo-100 text-indigo-800 text-xs px-3 py-2 font-bold flex items-center">
              <span className="mr-1">✨</span> แนะนำโดย AI: {recommendedReason}
          </div>
      )}

      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
             <span className="inline-block px-2 py-1 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-100 rounded-md">
                {club.category}
             </span>
             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${seatsLeft > 5 ? 'bg-green-100 text-green-800' : seatsLeft > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {club.isFull ? 'เต็ม' : `ว่าง ${seatsLeft}`}
            </span>
        </div>
       
        <h3 className="block mt-1 text-lg leading-tight font-bold text-gray-900">{club.name}</h3>
        <p className="text-sm text-teal-600 font-medium mb-2">{club.teacherName}</p>
        <p className="mt-2 text-slate-500 text-sm line-clamp-2">{club.description}</p>
        
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center text-sm text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{club.location}</span>
            </div>
            <div className="flex items-center text-sm text-slate-600">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>รับ ม.{club.allowedGrades.join(', ')}</span>
            </div>
        </div>
      </div>
      <div className="p-5 pt-0 mt-auto">
          {renderActionButton()}
      </div>
    </div>
  );
};

export default ClubCard;
