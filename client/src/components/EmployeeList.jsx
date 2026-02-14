import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, User, Mail, Building, Loader2 } from 'lucide-react';
import { getEmployees, addEmployee, deleteEmployee } from '../services/api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        employeeId: '',
        name: '',
        email: '',
        department: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await getEmployees();
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
            // If backend is down or DB not connected, show empty or error
            // Ideally show toast
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await deleteEmployee(id);
            setEmployees(employees.filter(emp => emp._id !== id));
        } catch (err) {
            alert('Failed to delete employee');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await addEmployee(newEmployee);
            setEmployees([res.data, ...employees]);
            setShowModal(false);
            setNewEmployee({ employeeId: '', name: '', email: '', department: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add employee');
        }
    };

    const handleChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Team Members</h2>
                    <p className="text-gray-500 mt-2 text-lg">Manage your employees and organizations.</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 active:scale-95 font-medium"
                >
                    <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform">
                        <Plus size={18} strokeWidth={3} />
                    </div>
                    Add New Employee
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 animate-pulse">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                    <p className="text-gray-400 font-medium">Loading your team...</p>
                </div>
            ) : employees.length === 0 ? (
                <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <User className="text-blue-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No employees yet</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Get started by adding your first employee to the system. They will appear here.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-8 text-blue-600 font-semibold hover:text-blue-700 hover:underline underline-offset-4"
                    >
                        Add Employee Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {employees?.map((employee, index) => (
                        <div
                            key={employee._id}
                            className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group relative hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100px] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            <button
                                onClick={() => handleDelete(employee._id)}
                                className="absolute top-4 right-4 p-2 bg-blue-50 text-blue-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Employee"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="relative flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30 transform group-hover:scale-105 transition-transform duration-300">
                                    {employee.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl leading-tight tracking-tight">{employee.name}</h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                            {employee.department}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 relative z-10">
                                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <User size={16} className="text-gray-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Employee ID</span>
                                        <span className="font-mono text-sm text-gray-700 font-medium">{employee.employeeId}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <Mail size={16} className="text-gray-400" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Email</span>
                                        <span className="truncate text-sm text-gray-700 font-medium">{employee.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Enter details to onboard a new employee</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            {error && (
                                <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Employee ID <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={newEmployee.employeeId}
                                            onChange={handleChange}
                                            placeholder="EMP001"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                                            required
                                        />
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Department <span className="text-red-500">*</span></label>
                                    <div className="relative group">
                                        <select
                                            name="department"
                                            value={newEmployee.department}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none font-medium text-gray-900"
                                            required
                                        >
                                            <option value="">Select Dept</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="HR">HR</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Finance">Finance</option>
                                        </select>
                                        <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Building size={18} />
                                        </div>
                                        <div className="absolute right-4 top-4 w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newEmployee.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Shane Alam"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={newEmployee.email}
                                        onChange={handleChange}
                                        placeholder="shane@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
                                        required
                                    />
                                    <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3.5 text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 rounded-xl transition-all font-semibold active:scale-[0.98]"
                                >
                                    Create Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
