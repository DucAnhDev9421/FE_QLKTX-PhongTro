import { Search, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import avatarImg from '../../assets/man-avatar-png-image_6514640.png';
import { NotificationBell } from '../ui/NotificationBell';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    
    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-400 hover:text-slate-50 flex items-center gap-2">
                    <Menu size={24} />
                    <Link to="/" className="text-xl font-bold tracking-tighter text-slate-50 ml-1">
                        QL<span className="text-emerald-500">KTX</span>
                    </Link>
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
                
                <NotificationBell variant="dashboard" />

                <Link to="/manage/profile" className="flex items-center gap-3 pl-4 ml-2 border-l border-slate-800 hover:opacity-80 transition-opacity cursor-pointer">
                    <div className="w-8 h-8 rounded-full border border-emerald-500/30 overflow-hidden shrink-0">
                        <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="hidden text-sm sm:block max-w-[120px]">
                        <div className="font-medium text-slate-200 truncate">{user?.fullName || user?.username || 'Đang tải...'}</div>
                        <div className="text-slate-500 text-xs truncate">{user?.role?.replace('SCOPE_', '') || 'User'}</div>
                    </div>
                </Link>
            </div>
        </header>
    );
};
