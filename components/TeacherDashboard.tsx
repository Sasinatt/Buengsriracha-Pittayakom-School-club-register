
import React, { useState, useEffect, useCallback } from 'react';
import { Teacher, ClubRoster, Student, WeeklyReport, AttendanceStatus, GradingStatus, GradingRecord, Announcement, AnnouncementType } from '../types';
import { getTeacherClubData, getWeeklyReports, saveWeeklyReport, updateWeeklyReport, getClubAttendance, saveClubAttendance, getClubGrading, saveClubGrading, getAnnouncements, createAnnouncement, updateClubLeaders } from '../services/api';

// Attendance Tab Component
const AttendanceTab: React.FC<{ students: Pick<Student, 'id' | 'name'>[], clubId: string }> = ({ students, clubId }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Map<string, AttendanceStatus>>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchAttendance = useCallback(async (selectedDate: string) => {
        setIsLoading(true);
        const data = await getClubAttendance(clubId, selectedDate);
        setAttendance(data);
        setIsLoading(false);
    }, [clubId]);

    useEffect(() => {
        fetchAttendance(date);
    }, [date, fetchAttendance]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => new Map(prev).set(studentId, status));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await saveClubAttendance(clubId, date, attendance);
        setIsSaving(false);
        alert('บันทึกข้อมูลการเช็คชื่อเรียบร้อยแล้ว');
    };

    const statusOptions: { value: AttendanceStatus, label: string, color: string }[] = [
        { value: AttendanceStatus.PRESENT, label: 'มาเรียน', color: 'bg-green-500' },
        { value: AttendanceStatus.ABSENT, label: 'ขาดเรียน', color: 'bg-red-500' },
        { value: AttendanceStatus.LATE, label: 'มาสาย', color: 'bg-yellow-500' },
        { value: AttendanceStatus.SICK, label: 'ลาป่วย', color: 'bg-blue-500' },
        { value: AttendanceStatus.PERSONAL, label: 'ลากิจ', color: 'bg-purple-500' },
    ];

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="attendance-date" className="font-medium">เลือกวันที่:</label>
                <input 
                    type="date" 
                    id="attendance-date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="p-2 border rounded-md"
                />
            </div>

            {isLoading ? <p>กำลังโหลดข้อมูลการเข้าเรียน...</p> : (
                 <div className="space-y-4">
                    {students.length > 0 ? students.map(student => (
                        <div key={student.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="font-medium">{student.name}</p>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map(option => (
                                    <button 
                                        key={option.value}
                                        onClick={() => handleStatusChange(student.id, option.value)}
                                        className={`px-3 py-1 text-sm rounded-full text-white transition-all transform hover:scale-105 ${attendance.get(student.id) === option.value ? option.color : 'bg-gray-300 hover:bg-gray-400'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )) : <p className="text-gray-500 text-center py-8">ยังไม่มีนักเรียนลงทะเบียนในชุมนุมนี้</p>}
                </div>
            )}
            
            <div className="mt-6 text-right">
                <button 
                    onClick={handleSave} 
                    disabled={isSaving || isLoading}
                    className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
                >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเช็คชื่อ'}
                </button>
            </div>
        </div>
    );
};


// Report Tab Component
const ReportTab: React.FC<{ clubId: string }> = ({ clubId }) => {
    const [reports, setReports] = useState<WeeklyReport[]>([]);
    const [topic, setTopic] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        const data = await getWeeklyReports(clubId);
        setReports(data);
        setIsLoading(false);
    }, [clubId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleEditClick = (report: WeeklyReport) => {
        setEditingReportId(report.id);
        setTopic(report.topic);
        setDetails(report.details);
        setImage(report.imageUrl || null);
    };

    const handleCancelEdit = () => {
        setEditingReportId(null);
        setTopic('');
        setDetails('');
        setImage(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) {
            alert('กรุณากรอกหัวข้อที่สอน');
            return;
        }
        setIsSaving(true);
        
        if (editingReportId) {
             const reportToUpdate = reports.find(r => r.id === editingReportId);
             if (reportToUpdate) {
                const updatedReport: WeeklyReport = {
                    ...reportToUpdate,
                    topic,
                    details,
                    imageUrl: image || undefined
                };
                await updateWeeklyReport(updatedReport);
             }
        } else {
             const newReportData = {
                clubId,
                week: reports.length + 1,
                date: new Date().toISOString().split('T')[0],
                topic,
                details,
                imageUrl: image || undefined
            };
            await saveWeeklyReport(newReportData);
        }
       
        handleCancelEdit(); // Reset form
        await fetchReports(); // Refresh the list
        setIsSaving(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">
                    {editingReportId ? 'แก้ไขบันทึกการสอน' : 'บันทึกการสอนประจำสัปดาห์'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">หัวข้อที่สอน</label>
                        <input type="text" id="topic" value={topic} onChange={e => setTopic(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700">รายละเอียดเพิ่มเติม</label>
                        <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">รูปภาพกิจกรรม (ถ้ามี)</label>
                        <input 
                            type="file" 
                            id="image" 
                            accept="image/*"
                            onChange={handleFileChange} 
                            className="mt-1 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-teal-50 file:text-teal-700
                                hover:file:bg-teal-100"
                        />
                         {image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">ตัวอย่างรูปภาพ:</p>
                                <img src={image} alt="Preview" className="h-32 w-auto object-cover rounded-md border border-gray-300" />
                                <button 
                                    type="button" 
                                    onClick={() => setImage(null)} 
                                    className="text-xs text-red-600 mt-1 hover:underline"
                                >
                                    ลบรูปภาพ
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" disabled={isSaving} className="flex-1 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400">
                            {isSaving ? 'กำลังบันทึก...' : (editingReportId ? 'บันทึกการแก้ไข' : 'บันทึกรายงาน')}
                        </button>
                        {editingReportId && (
                            <button type="button" onClick={handleCancelEdit} disabled={isSaving} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-400">
                                ยกเลิก
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <div>
                 <h3 className="text-lg font-semibold mb-4">ประวัติการบันทึก</h3>
                 {isLoading ? <p>กำลังโหลดรายงาน...</p> : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {reports.length > 0 ? reports.map(report => (
                            <div key={report.id} className={`p-4 border rounded-lg ${editingReportId === report.id ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-500' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-bold text-teal-700">สัปดาห์ที่ {report.week}: {report.topic}</p>
                                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{report.details}</p>
                                        {report.imageUrl && (
                                            <div className="mt-2">
                                                 <img src={report.imageUrl} alt="Activity" className="h-24 w-auto object-cover rounded-md border border-gray-200" />
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">วันที่: {report.date}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleEditClick(report)}
                                        className="ml-2 text-gray-400 hover:text-teal-600 transition-colors"
                                        title="แก้ไข"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">ยังไม่มีรายงานที่บันทึกไว้</p>}
                    </div>
                 )}
            </div>
        </div>
    );
}

// Grading Tab Component
const GradingTab: React.FC<{ students: Pick<Student, 'id' | 'name' | 'studentId' | 'className'>[], clubId: string }> = ({ students, clubId }) => {
    const [grading, setGrading] = useState<GradingRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const failureReasonsList = [
        "เวลาเรียนไม่ครบ 80%",
        "ไม่ส่งชิ้นงาน/ผลงาน",
        "ไม่ผ่านการประเมินทักษะ",
        "พฤติกรรมไม่เหมาะสม"
    ];

    const fetchGrading = useCallback(async () => {
        setIsLoading(true);
        const data = await getClubGrading(clubId);
        setGrading(data);
        setIsLoading(false);
    }, [clubId]);

    useEffect(() => {
        fetchGrading();
    }, [fetchGrading]);

    const handleStatusChange = (studentId: string, status: GradingStatus) => {
        setGrading(prev => {
            const existing = prev.find(p => p.studentId === studentId);
            const newRecord: GradingRecord = {
                studentId,
                clubId,
                status,
                failureReasons: status === GradingStatus.FAIL ? (existing?.failureReasons || []) : []
            };
            
            if (existing) {
                return prev.map(p => p.studentId === studentId ? newRecord : p);
            } else {
                return [...prev, newRecord];
            }
        });
    };

    const handleReasonToggle = (studentId: string, reason: string) => {
        setGrading(prev => {
            const existing = prev.find(p => p.studentId === studentId);
            if (!existing || existing.status !== GradingStatus.FAIL) return prev;

            const currentReasons = existing.failureReasons || [];
            const newReasons = currentReasons.includes(reason)
                ? currentReasons.filter(r => r !== reason)
                : [...currentReasons, reason];

            const newRecord = { ...existing, failureReasons: newReasons };
            return prev.map(p => p.studentId === studentId ? newRecord : p);
        });
    };

    const handleOtherReasonToggle = (studentId: string) => {
        setGrading(prev => {
            const existing = prev.find(p => p.studentId === studentId);
            if (!existing || existing.status !== GradingStatus.FAIL) return prev;

            const currentReasons = existing.failureReasons || [];
            const hasCustomReason = currentReasons.some(r => !failureReasonsList.includes(r));

            let newReasons;
            if (hasCustomReason) {
                newReasons = currentReasons.filter(r => failureReasonsList.includes(r));
            } else {
                newReasons = [...currentReasons, ""];
            }

            const newRecord = { ...existing, failureReasons: newReasons };
            return prev.map(p => p.studentId === studentId ? newRecord : p);
        });
    };

    const handleOtherReasonChange = (studentId: string, value: string) => {
        setGrading(prev => {
             const existing = prev.find(p => p.studentId === studentId);
             if (!existing || existing.status !== GradingStatus.FAIL) return prev;
             
             const currentReasons = existing.failureReasons || [];
             const standardReasons = currentReasons.filter(r => failureReasonsList.includes(r));
             const newReasons = [...standardReasons, value];

             const newRecord = { ...existing, failureReasons: newReasons };
             return prev.map(p => p.studentId === studentId ? newRecord : p);
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const cleanedGrading = grading.map(g => ({
            ...g,
            failureReasons: g.failureReasons?.filter(r => r.trim() !== "")
        }));
        await saveClubGrading(clubId, cleanedGrading);
        setIsSaving(false);
        alert('บันทึกผลการประเมินเรียบร้อยแล้ว');
    };

    return (
        <div>
            {isLoading ? <p>กำลังโหลดข้อมูล...</p> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-สกุล</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขประจำตัว</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผลการประเมิน</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เหตุผล (กรณีไม่ผ่าน)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.length > 0 ? students.map(student => {
                                const record = grading.find(g => g.studentId === student.id);
                                const status = record?.status || GradingStatus.PENDING;
                                
                                const currentReasons = record?.failureReasons || [];
                                const customReason = currentReasons.find(r => !failureReasonsList.includes(r));
                                const isOtherChecked = customReason !== undefined;

                                return (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(student.id, GradingStatus.PASS)}
                                                    className={`px-3 py-1 text-sm rounded-md border ${status === GradingStatus.PASS ? 'bg-green-100 text-green-800 border-green-300 font-bold ring-2 ring-green-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                                >
                                                    ผ่าน
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student.id, GradingStatus.FAIL)}
                                                    className={`px-3 py-1 text-sm rounded-md border ${status === GradingStatus.FAIL ? 'bg-red-100 text-red-800 border-red-300 font-bold ring-2 ring-red-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                                                >
                                                    ไม่ผ่าน
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {status === GradingStatus.FAIL && (
                                                <div className="space-y-1">
                                                    {failureReasonsList.map(reason => (
                                                        <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={record?.failureReasons?.includes(reason) || false}
                                                                onChange={() => handleReasonToggle(student.id, reason)}
                                                                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                                                            />
                                                            <span>{reason}</span>
                                                        </label>
                                                    ))}
                                                    <div className="flex flex-col space-y-2 pt-1">
                                                        <label className="flex items-center space-x-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={isOtherChecked}
                                                                onChange={() => handleOtherReasonToggle(student.id)}
                                                                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                                                            />
                                                            <span>อื่น ๆ</span>
                                                        </label>
                                                        {isOtherChecked && (
                                                            <input 
                                                                type="text" 
                                                                value={customReason || ''}
                                                                onChange={(e) => handleOtherReasonChange(student.id, e.target.value)}
                                                                placeholder="ระบุเหตุผล..."
                                                                className="ml-6 px-2 py-1 border border-gray-300 rounded-md text-sm w-full max-w-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                                                                autoFocus={customReason === ""}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        ยังไม่มีนักเรียนลงทะเบียนในชุมนุมนี้
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
             <div className="mt-6 text-right">
                <button 
                    onClick={handleSave} 
                    disabled={isSaving || isLoading}
                    className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
                >
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกผลการประเมิน'}
                </button>
            </div>
        </div>
    );
};

// Announcement Tab Component
const AnnouncementTab: React.FC<{ clubId: string, clubName: string, teacherName: string }> = ({ clubId, clubName, teacherName }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<AnnouncementType>(AnnouncementType.INFO);
    const [isSaving, setIsSaving] = useState(false);

    const fetchAnnouncements = useCallback(async () => {
        // In a real app, we might filter by clubId. Here we fetch all and filter client side for demo
        const all = await getAnnouncements();
        setAnnouncements(all.filter(a => a.clubId === clubId));
    }, [clubId]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!message.trim()) return;

        setIsSaving(true);
        await createAnnouncement({
            clubId,
            clubName,
            teacherName,
            message,
            type
        });
        setMessage('');
        setType(AnnouncementType.INFO);
        await fetchAnnouncements();
        setIsSaving(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                 <h3 className="text-lg font-semibold mb-4">สร้างประกาศใหม่</h3>
                 <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทประกาศ</label>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-teal-600" name="type" checked={type === AnnouncementType.INFO} onChange={() => setType(AnnouncementType.INFO)} />
                                <span className="ml-2">แจ้งข่าวทั่วไป</span>
                            </label>
                             <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-amber-500" name="type" checked={type === AnnouncementType.ALERT} onChange={() => setType(AnnouncementType.ALERT)} />
                                <span className="ml-2">แจ้งเตือน/ด่วน</span>
                            </label>
                             <label className="inline-flex items-center">
                                <input type="radio" className="form-radio text-green-600" name="type" checked={type === AnnouncementType.SUCCESS} onChange={() => setType(AnnouncementType.SUCCESS)} />
                                <span className="ml-2">ข่าวดี/เปิดรับเพิ่ม</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="พิมพ์ข้อความประกาศ..."
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 disabled:opacity-50"
                    >
                        {isSaving ? 'กำลังโพสต์...' : 'โพสต์ประกาศ'}
                    </button>
                 </form>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">ประกาศที่ผ่านมา</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {announcements.length > 0 ? announcements.map(ann => (
                        <div key={ann.id} className={`p-4 rounded-lg border-l-4 shadow-sm bg-white ${ann.type === AnnouncementType.ALERT ? 'border-amber-500' : ann.type === AnnouncementType.SUCCESS ? 'border-green-500' : 'border-blue-500'}`}>
                            <div className="flex justify-between items-start">
                                <p className="font-medium text-gray-800">{ann.message}</p>
                                <span className={`text-xs px-2 py-1 rounded-full text-white ${ann.type === AnnouncementType.ALERT ? 'bg-amber-500' : ann.type === AnnouncementType.SUCCESS ? 'bg-green-500' : 'bg-blue-500'}`}>
                                    {ann.type === AnnouncementType.ALERT ? 'ด่วน' : ann.type === AnnouncementType.SUCCESS ? 'ข่าวดี' : 'ทั่วไป'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{new Date(ann.timestamp).toLocaleString()}</p>
                        </div>
                    )) : <p className="text-gray-500 text-center py-4">ยังไม่มีประกาศ</p>}
                </div>
            </div>
        </div>
    );
};

// Roster Tab Component
const RosterTab: React.FC<{ clubData: ClubRoster }> = ({ clubData }) => {
    const [presidentId, setPresidentId] = useState(clubData.presidentId || '');
    const [vicePresidentId, setVicePresidentId] = useState(clubData.vicePresidentId || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveLeaders = async () => {
        setIsSaving(true);
        try {
            await updateClubLeaders(clubData.id, presidentId || null, vicePresidentId || null);
            alert('บันทึกข้อมูลตำแหน่งเรียบร้อยแล้ว');
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            {/* Leadership Selection Section */}
            <div className="mb-8 p-6 bg-teal-50 rounded-lg border border-teal-100">
                <h3 className="text-lg font-bold text-teal-800 mb-4">การบริหารจัดการชุมนุม</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">หัวหน้าชุมนุม</label>
                        <select
                            value={presidentId}
                            onChange={(e) => setPresidentId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="">-- เลือกหัวหน้าชุมนุม --</option>
                            {clubData.students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รองหัวหน้าชุมนุม</label>
                        <select
                            value={vicePresidentId}
                            onChange={(e) => setVicePresidentId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="">-- เลือกรองหัวหน้าชุมนุม --</option>
                            {clubData.students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button 
                        onClick={handleSaveLeaders}
                        disabled={isSaving}
                        className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 disabled:opacity-50"
                    >
                        {isSaving ? 'กำลังบันทึก...' : 'บันทึกตำแหน่ง'}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขประจำตัว</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-สกุล</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ห้องเรียน</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {clubData.students.length > 0 ? clubData.students.map((student, index) => (
                    <tr key={student.id} className={student.id === presidentId ? 'bg-yellow-50' : student.id === vicePresidentId ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            {student.id === presidentId && <span className="text-yellow-600">หัวหน้าชุมนุม</span>}
                            {student.id === vicePresidentId && <span className="text-blue-600">รองหัวหน้า</span>}
                        </td>
                    </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                ยังไม่มีนักเรียนลงทะเบียนในชุมนุมนี้
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Teacher Dashboard Component
const TeacherDashboard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const [clubData, setClubData] = useState<ClubRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'roster' | 'attendance' | 'report' | 'grading' | 'announcement'>('roster');

  const fetchClubData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTeacherClubData(teacher.assignedClubId);
      setClubData(data);
    } catch (err: any) {
      setError('ไม่สามารถโหลดข้อมูลชุมนุมได้');
    } finally {
      setLoading(false);
    }
  }, [teacher.assignedClubId]);

  useEffect(() => {
    fetchClubData();
  }, [fetchClubData]);

  const handleExport = () => {
    if (!clubData) return;
    const headers = "เลขประจำตัว,ชื่อ-สกุล,ห้องเรียน\n";
    const csvContent = clubData.students.map(s => `${s.studentId},${s.name},${s.className}`).join("\n");
    const blob = new Blob([`\uFEFF${headers}${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `รายชื่อ_${clubData.name.replace(/\s/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!clubData) return <div>ไม่พบข้อมูลชุมนุม</div>;

  const renderTabContent = () => {
    switch(activeTab) {
        case 'roster':
            return <RosterTab clubData={clubData} />;
        case 'attendance':
            return <AttendanceTab students={clubData.students} clubId={clubData.id} />;
        case 'report':
            return <ReportTab clubId={clubData.id}/>;
        case 'grading':
             return <GradingTab students={clubData.students} clubId={clubData.id} />;
        case 'announcement':
            return <AnnouncementTab clubId={clubData.id} clubName={clubData.name} teacherName={clubData.teacherName} />;
        default:
            return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
            <h1 className="text-2xl font-bold text-teal-700">{clubData.name}</h1>
            <p className="text-slate-500 mt-1">
                สถานที่: {clubData.location} &bull; จำนวนนักเรียน: {clubData.students.length}/{clubData.maxSeats}
            </p>
        </div>
        <button onClick={handleExport} disabled={clubData.students.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none disabled:bg-gray-400">
            Export รายชื่อ (CSV)
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('roster')} className={`${activeTab === 'roster' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>รายชื่อนักเรียน</button>
            <button onClick={() => setActiveTab('attendance')} className={`${activeTab === 'attendance' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>เช็คชื่อเข้าเรียน</button>
            <button onClick={() => setActiveTab('report')} className={`${activeTab === 'report' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>บันทึกการสอน</button>
            <button onClick={() => setActiveTab('grading')} className={`${activeTab === 'grading' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>บันทึกผล</button>
            <button onClick={() => setActiveTab('announcement')} className={`${activeTab === 'announcement' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-1`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                ประกาศ
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
