import { useState, useEffect } from 'react';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import avatarImg from '../../assets/man-avatar-png-image_6514640.png';
import { notificationService, UserNotificationResponse } from '../../services/notificationService';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    
    const [notifications, setNotifications] = useState<UserNotificationResponse[]>([]);

    useEffect(() => {
        if (user?.id) {
            notificationService.getUserNotifications(user.id)
                .then(setNotifications)
                .catch(err => console.error("Failed to fetch notifications", err));
        }
    }, [user?.id]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.userNotificationId === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.isRead).map(n => n.userNotificationId);
            await Promise.all(unreadIds.map(id => notificationService.markAsRead(id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    
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
                <div className="relative group">
                    <button className="relative text-slate-400 hover:text-slate-50 transition-colors p-2">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
                        )}
                    </button>

                    {/* Dropdown Panel Container (includes invisible pt-3 padding for safe hover bridging) */}
                    <div className="absolute right-[-10px] top-full pt-3 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
                            {/* Decorative Arrow pointing up */}
                            <div className="absolute -top-[5px] right-[18px] w-2.5 h-2.5 bg-slate-800 border-l border-t border-slate-700 transform rotate-45 z-0"></div>
                            
                            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 relative z-10">
                                <h3 className="font-semibold text-slate-200">Thông báo mới</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllAsRead}
                                        className="text-[11px] text-emerald-500 hover:text-emerald-400 font-medium transition-colors bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                            </div>
                            
                            <div className="max-h-[320px] overflow-y-auto relative z-10 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.userNotificationId} 
                                            className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/40 transition-colors cursor-pointer flex gap-3 relative ${!notification.isRead ? 'bg-slate-800/40' : ''}`}
                                            onClick={() => {
                                                if (!notification.isRead) {
                                                    handleMarkAsRead(notification.userNotificationId);
                                                }
                                            }}
                                        >
                                            <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <Bell size={16} />
                                            </div>
                                            <div>
                                                <p className={`text-sm mb-0.5 ${!notification.isRead ? 'font-medium text-slate-100' : 'text-slate-300'}`}>
                                                    {notification.notificationTitle}
                                                    {!notification.isRead && <span className="inline-block w-1.5 h-1.5 ml-2 bg-emerald-500 rounded-full"></span>}
                                                </p>
                                                <p className="text-[13px] text-slate-400 leading-snug">{notification.notificationMessage}</p>
                                                <p className="text-[11px] text-slate-500 mt-2">
                                                    {new Date(notification.createdDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        Không có thông báo nào.
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 border-t border-slate-700 text-center bg-slate-800 relative z-10 transition-colors hover:bg-slate-700/70 cursor-pointer">
                                <span className="text-sm font-medium text-slate-300">Xem tất cả thông báo</span>
                            </div>
                        </div>
                    </div>
                </div>
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
