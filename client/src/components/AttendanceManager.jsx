import React, { useState, useEffect } from 'react';
import { Calendar, User, Search, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getEmployees, markAttendance, getAttendance } from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

const AttendanceManager = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceMap, setAttendanceMap] = useState({}); // { employeeId_date: record }
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'monthly'
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const empRes = await getEmployees();
            setEmployees(empRes.data);

            // For now, let's fetch attendance for all employees individually? 
            // Better API design would be to fetch attendance by date range or date.
            // But our backend only supports get by employeeId. 
            // To properly show daily view, we need to know status for all employees for TODAY.
            // Since we don't have that API `GET /attendance?date=...`, we might need to iterate.
            // Actually, let's just fetch for each employee. It's "HRMS Lite", so N is small.

            const records = {};
            await Promise.all(empRes.data.map(async (emp) => {
                const attRes = await getAttendance(emp.employeeId);
                attRes.data.forEach(record => {
                    // Create a key like "EMP001_2023-10-27"
                    const dateKey = new Date(record.date).toDateString();
                    records[`${emp.employeeId}_${dateKey}`] = record;
                });
            }));
            setAttendanceMap(records);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (employeeId, status, date = selectedDate) => {
        try {
            const res = await markAttendance({ employeeId, date, status });
            // Update local state
            const dateKey = new Date(date).toDateString();
            setAttendanceMap(prev => ({
                ...prev,
                [`${employeeId}_${dateKey}`]: res.data
            }));
        } catch (err) {
            alert('Failed to mark attendance');
        }
    };

    const getStatus = (employeeId, date) => {
        const dateKey = new Date(date).toDateString();
        return attendanceMap[`${employeeId}_${dateKey}`]?.status;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
                    <p className="text-gray-500 mt-1">Track daily attendance for your team.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Daily View
                    </button>
                    <button
                        onClick={() => setViewMode('monthly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'bg-blue-50 text-gray-500 hover:text-gray-700'}`}
                    >
                        Monthly Log
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : viewMode === 'daily' ? (
                /* Daily View */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="text-gray-400" size={20} />
                            {format(selectedDate, 'PPP')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const d = new Date(selectedDate);
                                    d.setDate(d.getDate() - 1);
                                    setSelectedDate(d);
                                }}
                                className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setSelectedDate(new Date())}
                                className="text-sm font-medium text-blue-600 px-4 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => {
                                    const d = new Date(selectedDate);
                                    d.setDate(d.getDate() + 1);
                                    setSelectedDate(d);
                                }}
                                className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {employees.map(emp => {
                            const status = getStatus(emp.employeeId, selectedDate);
                            return (
                                <div key={emp._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{emp.name}</p>
                                            <p className="text-sm text-gray-500">{emp.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleMarkAttendance(emp.employeeId, 'Present')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${status === 'Present'
                                                ? 'bg-green-50 border-green-200 text-green-700 font-medium'
                                                : 'bg-blue-50 border-transparent text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            <CheckCircle2 size={18} className={status === 'Present' ? 'fill-current' : ''} />
                                            Present
                                        </button>
                                        <button
                                            onClick={() => handleMarkAttendance(emp.employeeId, 'Absent')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${status === 'Absent'
                                                ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                                                : 'bg-blue-50 border-transparent text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            <XCircle size={18} className={status === 'Absent' ? 'fill-current' : ''} />
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Monthly View - Bonus Feature */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Attendance Log - {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-200 rounded-lg">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-200 rounded-lg">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-left font-medium text-gray-500 sticky left-0 bg-gray-50">Employee</th>
                                    {eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }).map(day => (
                                        <th key={day.toString()} className={`p-2 font-normal text-center min-w-[3rem] ${isToday(day) ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                            {format(day, 'd')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {employees.map(emp => (
                                    <tr key={emp._id}>
                                        <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-100 shadow-sm">
                                            {emp.name}
                                        </td>
                                        {eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }).map(day => {
                                            const status = getStatus(emp.employeeId, day);
                                            return (
                                                <td key={day.toString()} className="p-2 text-center">
                                                    {status === 'Present' && <div className="w-2 h-2 mx-auto bg-green-500 rounded-full" title="Present" />}
                                                    {status === 'Absent' && <div className="w-2 h-2 mx-auto bg-red-500 rounded-full" title="Absent" />}
                                                    {!status && <div className="w-1 h-1 mx-auto bg-gray-200 rounded-full" />}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceManager;
