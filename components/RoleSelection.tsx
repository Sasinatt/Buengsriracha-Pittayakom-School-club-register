
import React from 'react';

interface RoleSelectionProps {
    onSelect: (role: 'student' | 'teacher') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center pt-10 md:pt-20 animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-teal-600">ระบบลงทะเบียนชุมนุม</h1>
                <p className="text-slate-500 mt-2">โรงเรียนบึงศรีราชาพิทยาคม</p>
                <h2 className="text-xl font-semibold text-slate-700 mt-8">กรุณาเลือกประเภทผู้ใช้งาน</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                {/* Student Card */}
                <div 
                    onClick={() => onSelect('student')} 
                    className="group cursor-pointer p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all text-center flex flex-col items-center"
                    aria-label="เข้าสู่ระบบสำหรับนักเรียน"
                    role="button"
                >
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-teal-700 mt-6">นักเรียน</h3>
                    <p className="text-slate-500 mt-2">สำหรับลงทะเบียน, ยกเลิก, และดูข้อมูลชุมนุม</p>
                </div>
                {/* Teacher/Staff Card */}
                <div 
                    onClick={() => onSelect('teacher')} 
                    className="group cursor-pointer p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all text-center flex flex-col items-center"
                    aria-label="เข้าสู่ระบบสำหรับครูและบุคลากร"
                    role="button"
                >
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-700 mt-6">ครูและบุคลากร</h3>
                    <p className="text-slate-500 mt-2">สำหรับจัดการชุมนุม, เช็คชื่อ, และดูรายงาน</p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
