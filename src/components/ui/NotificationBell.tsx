import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationService, UserNotificationResponse } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

interface NotificationBellProps {
    variant?: 'dashboard' | 'landing';
}

export const NotificationBell = ({ variant = 'dashboard' }: NotificationBellProps) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState<UserNotificationResponse[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchNotifications = () => {
            notificationService.getUserNotifications(user.id)
                .then(setNotifications)
                .catch(err => console.error("Failed to fetch notifications", err));
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 30000);
        return () => clearInterval(intervalId);
    }, [user?.id]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
            await Promise.all(unreadIds.map(id => notificationService.markAsRead(id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Styling logic based on variant and theme
    const isDashboard = variant === 'dashboard';
    
    // Button classes
    const btnClasses = isDashboard 
        ? "relative text-slate-400 hover:text-slate-50 transition-colors p-2"
        : `relative transition-colors p-2 ${theme === 'dark' ? 'text-neutral-400 hover:text-[#D4AF37]' : 'text-neutral-600 hover:text-[#D4AF37]'}`;

    // Dropdown container classes
    const dropdownClasses = isDashboard
        ? "bg-slate-800 border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        : `backdrop-blur-xl border rounded-xl shadow-2xl ${
            theme === 'dark' ? 'bg-neutral-900/90 border-white/10 shadow-black/50' : 'bg-white/90 border-black/5 shadow-neutral-200/50'
          }`;

    // Header & Item classes
    const headerTitleClasses = isDashboard ? "text-slate-200" : (theme === 'dark' ? "text-neutral-200" : "text-neutral-800");
    const borderClasses = isDashboard ? "border-slate-700" : (theme === 'dark' ? "border-white/10" : "border-black/5");
    const itemHoverClasses = isDashboard ? "hover:bg-slate-700/40" : (theme === 'dark' ? "hover:bg-white/5" : "hover:bg-black/5");
    const unreadItemBg = isDashboard ? "bg-slate-800/40" : (theme === 'dark' ? "bg-white/5" : "bg-neutral-50");
    const textPrimaryClasses = isDashboard ? "text-slate-100" : (theme === 'dark' ? "text-neutral-100" : "text-neutral-900");
    const textSecondaryClasses = isDashboard ? "text-slate-400" : (theme === 'dark' ? "text-neutral-400" : "text-neutral-600");

    if (!user) return null;

    return (
        <div className="relative group">
            <button className={btnClasses}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 ${isDashboard ? 'border-slate-900' : (theme === 'dark' ? 'border-neutral-900' : 'border-white')}`}></span>
                )}
            </button>

            <div className="absolute right-[-10px] top-full pt-3 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                <div className={`${dropdownClasses} rounded-xl overflow-hidden relative border`}>
                    <div className={`p-4 border-b ${borderClasses} flex justify-between items-center relative z-10`}>
                        <h3 className={`font-semibold ${headerTitleClasses}`}>Thông báo mới</h3>
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
                                    key={notification.id} 
                                    className={`p-4 border-b ${borderClasses} ${itemHoverClasses} transition-colors cursor-pointer flex gap-3 relative ${!notification.isRead ? unreadItemBg : ''}`}
                                    onClick={() => {
                                        if (!notification.isRead) {
                                            handleMarkAsRead(notification.id);
                                        }
                                    }}
                                >
                                    <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bell size={16} />
                                    </div>
                                    <div>
                                        <p className={`text-sm mb-0.5 ${!notification.isRead ? `font-semibold ${textPrimaryClasses}` : `text-slate-500 ${isDashboard ? '' : 'dark:text-neutral-400'}`}`}>
                                            {notification.title}
                                            {!notification.isRead && <span className="inline-block w-1.5 h-1.5 ml-2 bg-emerald-500 rounded-full"></span>}
                                        </p>
                                        <p className={`text-[13px] leading-snug ${textSecondaryClasses}`}>{notification.content}</p>
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
                    
                    <div className={`p-3 border-t ${borderClasses} text-center relative z-10 transition-colors ${itemHoverClasses} cursor-pointer`}>
                        <span className={`text-sm font-medium ${isDashboard ? 'text-slate-300' : (theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700')}`}>Xem tất cả thông báo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
