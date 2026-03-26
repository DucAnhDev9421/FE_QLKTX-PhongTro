import { Home, Users, DollarSign, Activity, FileText, Settings, LogOut, Building, Receipt, Zap, LayoutList, UserCog, Archive } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { user } = useAuth();
  
  const userRole = (user?.role || (Array.isArray(user?.roles) ? user.roles[0] : '') || '').toUpperCase();
  const normalizedRole = userRole.startsWith('ROLE_') ? userRole.substring(5) : 
                        userRole.startsWith('SCOPE_') ? userRole.substring(6) : userRole;
  
  const isAdminOrOwner = normalizedRole === 'ADMIN' || normalizedRole === 'OWNER';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="text-2xl font-bold tracking-tighter text-slate-50">
          QL<span className="text-emerald-500">KTX</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Quản lý</div>

        <NavLink to="/manage/dashboard" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Activity size={20} /> <span className="font-medium">Tổng quan</span>
        </NavLink>

        <NavLink to="/manage/buildings" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Building size={20} /> <span className="font-medium">Tòa nhà</span>
        </NavLink>

        <NavLink to="/manage/rooms" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Home size={20} /> <span className="font-medium">Phòng trọ</span>
        </NavLink>

        <NavLink to="/manage/tenants" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Users size={20} /> <span className="font-medium">Người thuê</span>
        </NavLink>

        <NavLink to="/manage/assets" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Archive size={20} /> <span className="font-medium">Tài sản</span>
        </NavLink>

        <NavLink to="/manage/meter-readings" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Zap size={20} /> <span className="font-medium">Ghi chỉ số</span>
        </NavLink>

        <NavLink to="/manage/contracts" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <FileText size={20} /> <span className="font-medium">Hợp đồng</span>
        </NavLink>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Tài chính</div>

        <NavLink to="/manage/invoices" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Receipt size={20} /> <span className="font-medium">Hóa đơn</span>
        </NavLink>

        <NavLink to="/manage/payments" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <DollarSign size={20} /> <span className="font-medium">Thanh toán</span>
        </NavLink>

        <NavLink to="/manage/reports" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Activity size={20} /> <span className="font-medium">Báo cáo</span>
        </NavLink>

        <NavLink to="/manage/incidents" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
          <Activity size={20} /> <span className="font-medium">Sự cố</span>
        </NavLink>

        {isAdminOrOwner && (
          <>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Hệ thống</div>

            <NavLink to="/manage/users" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
              <UserCog size={20} /> <span className="font-medium">Nhân viên</span>
            </NavLink>

            <NavLink to="/manage/services" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
              <LayoutList size={20} /> <span className="font-medium">Dịch vụ</span>
            </NavLink>

            <NavLink to="/manage/settings" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-50'}>
              <Settings size={20} /> <span className="font-medium">Cài đặt</span>
            </NavLink>
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 w-full transition-colors">
          <LogOut size={20} /> <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
