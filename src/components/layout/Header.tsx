import React from 'react';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-400 hover:text-slate-50">
                    <Menu size={24} />
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhanh..."
                        className="bg-slate-800 border border-slate-700 text-sm text-slate-50 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="relative text-slate-400 hover:text-slate-50 transition-colors p-2"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="relative text-slate-400 hover:text-slate-50 transition-colors p-2">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                        AD
                    </div>
                    <div className="hidden text-sm sm:block">
                        <div className="font-medium text-slate-200">Admin User</div>
                        <div className="text-slate-500 text-xs">Quản trị viên</div>
                    </div>
                </div>
            </div>
        </header>
    );
};
