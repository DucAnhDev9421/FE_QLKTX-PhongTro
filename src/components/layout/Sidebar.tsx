import React from 'react';
import { Home, Users, DollarSign, Activity, FileText, Settings, LogOut, Bell, Search, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="text-2xl font-bold tracking-tighter text-white">
          QL<span className="text-emerald-500">KTX</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Quản lý</div>

        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <Activity size={20} /> <span className="font-medium">Tổng quan</span>
        </NavLink>

        <NavLink to="/rooms" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <Home size={20} /> <span className="font-medium">Phòng trọ</span>
        </NavLink>

        <NavLink to="/tenants" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <Users size={20} /> <span className="font-medium">Người thuê</span>
        </NavLink>

        <NavLink to="/contracts" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <FileText size={20} /> <span className="font-medium">Hợp đồng</span>
        </NavLink>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Tài chính</div>

        <NavLink to="/payments" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <DollarSign size={20} /> <span className="font-medium">Thanh toán</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <Activity size={20} /> <span className="font-medium">Báo cáo</span>
        </NavLink>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Hệ thống</div>

        <NavLink to="/settings" className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors bg-emerald-500/10 text-emerald-500' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white'}>
          <Settings size={20} /> <span className="font-medium">Cài đặt</span>
        </NavLink>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 w-full transition-colors">
          <LogOut size={20} /> <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
