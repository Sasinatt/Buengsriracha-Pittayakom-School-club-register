
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    role: 'student' | 'teacher';
    onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ role, onBack }) => {
  const [teacherId, setTeacherId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [className, setClassName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const classOptions = useMemo(() => {
    const options = [];
    for (let level = 1; level <= 6; level++) {
        let maxRooms = 0;
        if (level <= 2) {
            maxRooms = 12; // M.1-2 have 12 rooms
        } else if (level === 3) {
            maxRooms = 10; // M.3 has 10 rooms
        } else if (level <= 5) {
            maxRooms = 8; // M.4-5 have 8 rooms
        } else {
            maxRooms = 6; // M.6 has 6 rooms
        }
        
        for (let room = 1; room <= maxRooms; room++) {
            options.push(`ม.${level}/${room}`);
        }
    }
    return options;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        if (role === 'student') {
            if (!studentId.trim() || !className.trim()) {
                setError('กรุณากรอกรหัสนักเรียน และเลือกห้องเรียนให้ครบถ้วน');
                setLoading(false);
                return;
            }
            await login({ role: 'student', studentId, className });
        } else {
            if (!teacherId.trim()) {
                setError('กรุณากรอกรหัสผู้ใช้งาน');
                setLoading(false);
                return;
            }
            await login({ role: 'teacher', teacherId });
        }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const renderStudentForm = () => (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-600">เข้าสู่ระบบ (นักเรียน)</h1>
        <p className="text-slate-500 mt-2">ยืนยันตัวตนเพื่อเข้าใช้งานระบบ</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="student-id-input" className="block text-sm font-medium text-slate-700">
            รหัสนักเรียน
          </label>
          <input
            id="student-id-input"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="เช่น 65001"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="class-input" className="block text-sm font-medium text-slate-700">
            ห้องเรียน
          </label>
          <select
            id="class-input"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            disabled={loading}
          >
            <option value="">-- เลือกห้องเรียน --</option>
            {classOptions.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800">
             <span className="font-bold">💡 ข้อมูลจำลอง (Mock Data):</span><br/>
             นายสมชาย (65001) อยู่ห้อง <strong>ม.4/1</strong>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">{error}</p>}
        <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !studentId || !className}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </div>
      </form>
    </>
  );

  const renderTeacherForm = () => (
    <>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-600">เข้าสู่ระบบ</h1>
            <p className="text-slate-500 mt-2">สำหรับครูและผู้ดูแลระบบ (Admin)</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="teacher-id-input" className="block text-sm font-medium text-slate-700">
                รหัสผู้ใช้งาน
                </label>
                <input
                id="teacher-id-input"
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="เช่น TH001 หรือ admin01"
                disabled={loading}
                />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
                <button
                type="submit"
                disabled={loading || !teacherId}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                </button>
            </div>
        </form>
    </>
  );


  return (
    <div className="flex items-center justify-center pt-10 md:pt-20 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        {role === 'student' ? renderStudentForm() : renderTeacherForm()}
         <div className="text-center pt-4 mt-4 border-t border-slate-200">
            <button onClick={onBack} className="text-sm text-slate-500 hover:text-teal-600 hover:underline">
                กลับไปหน้าเลือกประเภทผู้ใช้
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
