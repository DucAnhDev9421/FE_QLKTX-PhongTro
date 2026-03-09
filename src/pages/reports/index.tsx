import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Download, Calendar, TrendingUp, Users, DollarSign, Home, Activity } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Giả lập dữ liệu Thống kê Doanh thu (6 tháng qua)
const revenueData = [
    { name: 'T10', rent: 120000000, service: 15000000, total: 135000000 },
    { name: 'T11', rent: 125000000, service: 16000000, total: 141000000 },
    { name: 'T12', rent: 122000000, service: 18000000, total: 140000000 },
    { name: 'T01', rent: 130000000, service: 15000000, total: 145000000 },
    { name: 'T02', rent: 135000000, service: 17000000, total: 152000000 },
    { name: 'T03', rent: 140000000, service: 19000000, total: 159000000 },
];

// Giả lập dữ liệu Phân bổ chi phí
const expenseData = [
    { name: 'Điện nước', value: 35 },
    { name: 'Bảo trì', value: 25 },
    { name: 'Vệ sinh', value: 20 },
    { name: 'Quản lý', value: 15 },
    { name: 'Khác', value: 5 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

// Giả lập dữ liệu Tỷ lệ lấp đầy
const occupancyData = [
    { name: 'Cơ sở 1', occupied: 85, vacant: 15 },
    { name: 'Cơ sở 2', occupied: 92, vacant: 8 },
    { name: 'Cơ sở 3', occupied: 78, vacant: 22 },
];

export default function Reports() {
    const [timeRange, setTimeRange] = useState('6_months');

    return (
        <Layout>
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Báo cáo & Thống kê</h1>
                    <p className="text-slate-400 text-sm">Phân tích hiệu quả kinh doanh và tình trạng hoạt động.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3 py-2">
                        <Calendar size={16} className="text-slate-400 mr-2" />
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer"
                        >
                            <option value="1_month">Tháng này</option>
                            <option value="3_months">3 tháng qua</option>
                            <option value="6_months">6 tháng qua</option>
                            <option value="1_year">1 năm qua</option>
                        </select>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Download size={18} /> Tải báo cáo
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard
                    title="Tổng Doanh Thu (T03)"
                    value="159.000.000đ"
                    trend="+4.6%"
                    trendUp={true}
                    icon={<DollarSign size={20} className="text-emerald-500" />}
                    color="emerald"
                />
                <KpiCard
                    title="Tỷ lệ lấp đầy"
                    value="88.5%"
                    trend="+2.1%"
                    trendUp={true}
                    icon={<Home size={20} className="text-blue-500" />}
                    color="blue"
                />
                <KpiCard
                    title="Người thuê mới"
                    value="24"
                    trend="-3"
                    trendUp={false}
                    icon={<Users size={20} className="text-indigo-500" />}
                    color="indigo"
                />
                <KpiCard
                    title="Sự cố kỹ thuật"
                    value="12"
                    trend="-15%"
                    trendUp={true}
                    icon={<Activity size={20} className="text-amber-500" />}
                    color="amber"
                    desc="Đã giảm"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-100">Biểu đồ doanh thu</h3>
                        <button className="text-slate-400 hover:text-slate-200 transition-colors">
                            <TrendingUp size={18} />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorService" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis
                                    stroke="#64748b"
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `${val / 1000000}M`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '14px' }}
                                    formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                                />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                                <Area type="monotone" dataKey="rent" name="Tiền phòng" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRent)" strokeWidth={2} />
                                <Area type="monotone" dataKey="service" name="Tiền dịch vụ" stroke="#10b981" fillOpacity={1} fill="url(#colorService)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Distribution */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-100 mb-6">Cơ cấu chi phí (%)</h3>
                    <div className="flex-1 min-h-[250px] flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    formatter={(value: number) => `${value}%`}
                                />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Occupancy Rate */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-100 mb-6">Tỷ lệ lấp đầy theo cơ sở</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 13 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    formatter={(value: number) => `${value}%`}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="occupied" name="Đã thuê" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={24} />
                                <Bar dataKey="vacant" name="Trống" stackId="a" fill="#334155" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Growth Trend (Mock Line Chart) */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-100 mb-6">Xu hướng thị trường</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                    labelStyle={{ display: 'none' }}
                                />
                                <Line type="monotone" dataKey="total" name="Mức tăng trưởng" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </Layout >
    );
}

// Helper Components
function KpiCard({ title, value, trend, trendUp, icon, color, desc }: any) {
    const getTrendColor = () => {
        if (trendUp === true) return 'text-emerald-500 bg-emerald-500/10';
        if (trendUp === false) return 'text-rose-500 bg-rose-500/10';
        return 'text-slate-500 bg-slate-800';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-slate-800/80`}>
                    {icon}
                </div>
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${getTrendColor()}`}>
                    {trend}
                </div>
            </div >
            <div className="relative z-10">
                <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-slate-100">{value}</p>
                {desc && <p className="text-xs text-slate-500 mt-2">{desc}</p>}
            </div>

            {/* Decorative background glow */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 blur-2xl group-hover:opacity-20 transition-opacity`} />
        </div>
    );
}
