import React from 'react';
import { Layout } from '../../components/layout';
import { Home, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
    { name: 'T1', total: 45000000 },
    { name: 'T2', total: 47000000 },
    { name: 'T3', total: 46500000 },
    { name: 'T4', total: 52000000 },
    { name: 'T5', total: 54000000 },
    { name: 'T6', total: 51000000 },
    { name: 'T7', total: 58000000 },
];

const occupancyData = [
    { name: 'CS 1', Occupied: 45, Vacant: 5 },
    { name: 'CS 2', Occupied: 38, Vacant: 12 },
    { name: 'CS 3', Occupied: 50, Vacant: 0 },
];

export default function Dashboard() {
    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Tổng quan hệ thống</h1>
                    <p className="text-slate-400 space-x-2 text-sm">Theo dõi số liệu hoạt động kinh doanh hôm nay.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-slate-800 border-none text-sm text-slate-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                        <option>Tất cả cơ sở</option>
                        <option>Cơ sở 1</option>
                        <option>Cơ sở 2</option>
                    </select>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Tải báo cáo
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Tổng doanh thu tháng"
                    value="58,000,000đ"
                    trend="up"
                    trendValue="12.5%"
                    icon={<DollarSign size={20} className="text-emerald-500" />}
                />
                <StatCard
                    title="Tỷ lệ lấp đầy"
                    value="85%"
                    trend="up"
                    trendValue="3.2%"
                    icon={<Home size={20} className="text-blue-500" />}
                />
                <StatCard
                    title="Người thuê đang ở"
                    value="133"
                    trend="down"
                    trendValue="1.5%"
                    icon={<Users size={20} className="text-amber-500" />}
                />
                <StatCard
                    title="Yêu cầu cần xử lý"
                    value="12"
                    trend="neutral"
                    trendValue="0"
                    icon={<Activity size={20} className="text-rose-500" />}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-100 mb-6">Doanh thu theo tháng (VNĐ)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#10b981' }}
                                    formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                                />
                                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-100 mb-6">Trạng thái phòng</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                />
                                <Bar dataKey="Occupied" name="Đã thuê" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Vacant" name="Trống" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </Layout>
    );
}

function StatCard({ title, value, icon, trend, trendValue }: { title: string, value: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral', trendValue: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.05)] hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800">
                    {icon}
                </div>
                {trend === 'up' ? (
                    <div className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                        <ArrowUpRight size={14} className="mr-1" /> {trendValue}
                    </div>
                ) : trend === 'down' ? (
                    <div className="flex items-center text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full">
                        <ArrowDownRight size={14} className="mr-1" /> {trendValue}
                    </div>
                ) : (
                    <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                        -
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
            </div>
        </div>
    );
}
