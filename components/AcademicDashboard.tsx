
import React, { useState, useEffect, useCallback } from 'react';
import { AcademicStaff, Club, Student } from '../types';
import { getAcademicOverview, autoAssignStudents } from '../services/api';
import Modal from './Modal';

interface AcademicDashboardProps {
  academic: AcademicStaff;
}

const AcademicDashboard: React.FC<AcademicDashboardProps> = ({ academic }) => {
  const [overview, setOverview] = useState<Club[]>([]);
  const [unregisteredStudents, setUnregisteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'unregistered'>('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Auto Assign State
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const fetchOverview = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true);
    setError('');
    try {
      const { clubs, unregistered } = await getAcademicOverview();
      setOverview(clubs);
      setUnregisteredStudents(unregistered);
      setLastUpdated(new Date());
    } catch (err: any) {
      if (!isAutoRefresh) setError('ไม่สามารถโหลดข้อมูลภาพรวมได้');
    } finally {
      if (!isAutoRefresh) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    
    // Auto-refresh every 5 seconds to simulate real-time updates
    const intervalId = setInterval(() => {
        // Only refresh if not assigning to prevent flickering/state issues
        if(!isAssigning) fetchOverview(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchOverview, isAssigning]);

  const handleExportAll = () => {
    const headers = "ชื่อชุมนุม,ครูผู้สอน,สถานที่เรียน,จำนวนที่ลงทะเบียน,จำนวนที่รับ\n";
    const csvContent = overview.map(c => `"${c.name}","${c.teacherName}","${c.location}",${c.currentSeats},${c.maxSeats}`).join("\n");
    const blob = new Blob([`\uFEFF${headers}${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ภาพรวมการลงทะเบียนชุมนุม.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportUnregistered = () => {
    const headers = "เลขประจำตัว,ชื่อ-สกุล,ชั้น,ครูที่ปรึกษา\n";
    const csvContent = unregisteredStudents.map(s => `${s.studentId},${s.name},${s.className},${s.advisor}`).join("\n");
    const blob = new Blob([`\uFEFF${headers}${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `นักเรียนยังไม่ลงทะเบียน.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleAutoAssign = async () => {
      setIsAssigning(true);
      setIsAssignModalOpen(false); // Close modal first
      try {
        const result = await autoAssignStudents();
        alert(`ดำเนินการเสร็จสิ้น!\n- จัดสรรนักเรียนสำเร็จ: ${result.assignedCount} คน\n- ไม่สามารถจัดสรรได้: ${result.failedCount} คน (เนื่องจากที่นั่งเต็มหรือไม่มีชุมนุมที่รองรับ)`);
        await fetchOverview(); // Refresh data
      } catch (e: any) {
          alert("เกิดข้อผิดพลาดในการจัดสรรอัตโนมัติ: " + e.message);
      } finally {
          setIsAssigning(false);
      }
  }

  if (loading && overview.length === 0) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Stats
  const totalSeats = overview.reduce((acc, c) => acc + c.maxSeats, 0);
  const totalRegistered = overview.reduce((acc, c) => acc + c.currentSeats, 0);
  const percentFilled = totalSeats > 0 ? Math.round((totalRegistered / totalSeats) * 100) : 0;

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-600">
            <div>
                <h1 className="text-2xl font-bold text-indigo-800">Administrator Dashboard</h1>
                <p className="text-slate-500">ยินดีต้อนรับ, {academic.name} (รหัส: {academic.teacherId})</p>
            </div>
            <div className="text-right text-sm text-gray-500 flex flex-col items-end">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Real-time Mode
                </span>
                <span className="text-xs mt-1">อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString()}</span>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-20 bg-white opacity-10 transform skew-x-12"></div>
                <h3 className="text-lg font-semibold opacity-90">นักเรียนลงทะเบียนแล้ว</h3>
                <div className="mt-2 flex items-baseline">
                    <span className="text-5xl font-bold">{totalRegistered}</span>
                    <span className="ml-2 text-indigo-100">คน</span>
                </div>
                <div className="mt-4 w-full bg-black bg-opacity-20 rounded-full h-2">
                     <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${percentFilled}%` }}></div>
                </div>
                <p className="text-xs mt-2 text-indigo-100 font-medium">{percentFilled}% ของที่นั่งทั้งหมด ({totalSeats} ที่นั่ง)</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-500">ยังไม่ลงทะเบียน</h3>
                <div className="mt-2 flex items-baseline text-red-600">
                    <span className="text-4xl font-bold">{unregisteredStudents.length}</span>
                    <span className="ml-2 text-gray-500">คน</span>
                </div>
                <button 
                    onClick={() => setActiveTab('unregistered')}
                    className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium flex items-center group"
                >
                    ดูรายชื่อทันที <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-500">ชุมนุมทั้งหมด</h3>
                <div className="mt-2 flex items-baseline text-teal-600">
                    <span className="text-4xl font-bold">{overview.length}</span>
                    <span className="ml-2 text-gray-500">ชุมนุม</span>
                </div>
                 <div className="mt-4 text-sm px-3 py-1 bg-gray-100 rounded-lg inline-block text-gray-600">
                    {overview.filter(c => c.currentSeats >= c.maxSeats).length} ชุมนุมเต็มแล้ว
                 </div>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="border-b border-gray-200 mb-6 flex justify-between items-center flex-wrap gap-4">
                <nav className="-mb-px flex space-x-8">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        ภาพรวมรายวิชา
                    </button>
                    <button 
                        onClick={() => setActiveTab('unregistered')} 
                        className={`${activeTab === 'unregistered' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        นักเรียนที่ยังไม่ลงทะเบียน ({unregisteredStudents.length})
                    </button>
                </nav>
                <div className="flex gap-2">
                    {activeTab === 'unregistered' && unregisteredStudents.length > 0 && (
                        <button
                            onClick={() => setIsAssignModalOpen(true)}
                            disabled={isAssigning}
                            className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 focus:outline-none flex items-center gap-2 disabled:bg-gray-400"
                        >
                            {isAssigning ? (
                                <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังจัดสรร...
                                </>
                            ) : (
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                จัดสรรอัตโนมัติ
                                </>
                            )}
                        </button>
                    )}
                    <button 
                        onClick={activeTab === 'overview' ? handleExportAll : handleExportUnregistered}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>

            {activeTab === 'overview' ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อชุมนุม</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">ครูผู้สอน</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">หมวดหมู่</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนที่ลงทะเบียน</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {overview.map((club) => (
                            <tr key={club.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{club.name}</div>
                                    <div className="text-sm text-gray-500 md:hidden">{club.teacherName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{club.teacherName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {club.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <span className="w-16 text-right mr-4 font-variant-numeric">{club.currentSeats} / {club.maxSeats}</span>
                                        <div className="w-32 bg-gray-200 rounded-full h-2.5 hidden sm:block overflow-hidden">
                                            <div 
                                                className={`h-2.5 rounded-full transition-all duration-500 ${club.currentSeats >= club.maxSeats ? 'bg-red-500' : 'bg-teal-500'}`} 
                                                style={{ width: `${(club.currentSeats / club.maxSeats) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขประจำตัว</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-สกุล</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชั้น</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ครูที่ปรึกษา</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {unregisteredStudents.length > 0 ? unregisteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-red-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.advisor}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-green-600 font-medium bg-green-50 rounded-lg">
                                        เยี่ยมมาก! นักเรียนทุกคนลงทะเบียนครบแล้ว
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>
            )}
            
            {/* Auto Assign Confirmation Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onConfirm={handleAutoAssign}
                title="ยืนยันการจัดสรรอัตโนมัติ"
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
            >
                <div className="space-y-3">
                    <p className="font-semibold text-red-600">คำเตือน: การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                    <p>
                        ระบบจะทำการสุ่มเลือกชุมนุมให้กับนักเรียนทั้ง {unregisteredStudents.length} คนที่ยังไม่มีสังกัด โดยพิจารณาจาก:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                        <li>ระดับชั้นที่ชุมนุมเปิดรับ</li>
                        <li>จำนวนที่นั่งที่ว่างอยู่</li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-2">
                        หมายเหตุ: หากไม่มีชุมนุมที่เหมาะสมหรือที่นั่งเต็ม นักเรียนบางคนอาจจะไม่ได้รับการจัดสรร
                    </p>
                </div>
            </Modal>
        </div>
    </div>
  );
};

export default AcademicDashboard;
