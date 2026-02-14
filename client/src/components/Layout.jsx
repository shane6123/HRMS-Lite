import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CalendarCheck, LayoutDashboard, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Employees', icon: Users },
        { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
    ];

    return (
        <div className="flex h-screen bg-gray-50/50 text-gray-900 font-sans antialiased overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 flex flex-col shadow-2xl shadow-gray-200/50 z-20">
                <div className="p-8 pb-6 flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 text-white transform transition-transform hover:scale-105 duration-300">
                        <LayoutDashboard size={24} strokeWidth={2} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">HRMS Lite</h1>
                        <p className="text-xs text-gray-400 font-medium">Manage Team</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-blue-50/80 text-blue-600 font-semibold shadow-sm ring-1 ring-blue-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                    }`}
                            >
                                <Icon
                                    size={22}
                                    className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span className="tracking-tight">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 m-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 p-[2px] shadow-md">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-violet-500 text-sm">SA</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">Admin User</p>
                            <p className="text-xs text-gray-400 truncate">admin@hrms.com</p>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-lg">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden bg-[#f8fafc]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="relative h-full min-w-full overflow-auto">
                    <div className="max-w-[1600px] mx-auto p-8 lg:p-12 pb-32">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
