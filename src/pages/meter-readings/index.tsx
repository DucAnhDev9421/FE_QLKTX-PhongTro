import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Save, Filter, Zap, Droplets, CheckCircle2 } from 'lucide-react';

export default function MeterReadings() {
    const [selectedService, setSelectedService] = useState<'ELECTRICITY' | 'WATER'>('ELECTRICITY');
    
    // Giả lập dữ liệu chốt hàng loạt (Bulk array state)
    const [readings, setReadings] = useState([
        { roomId: 'A101', tenant: 'Nguyễn Văn A', previous: 2500, current: '' },
        { roomId: 'A102', tenant: 'Trần B', previous: 1200, current: '' },
        { roomId: 'A103', tenant: 'Lê C', previous: 890, current: '' },
        { roomId: 'A104', tenant: 'Phạm D', previous: 3450, current: '' },
        { roomId: 'A105', tenant: 'Vũ E', previous: 110, current: '' },
        { roomId: 'A106', tenant: 'Hoàng F', previous: 405, current: '' },
    ]);

    const handleCurrentChange = (index: number, value: string) => {
        const newReadings = [...readings];
        newReadings[index].current = value;
        setReadings(newReadings);
    };

    const isSaveDisabled = readings.every(r => !r.current);

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Ghi chỉ số đồng hồ</h1>
                    <p className="text-slate-400 text-sm">Cập nhật nhanh chỉ số Điện / Nước hàng loạt để chốt bill cuối tháng.</p>
                </div>
                <button 
                    disabled={isSaveDisabled}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <Save size={18} /> Lưu tất cả
                </button>
            </div>

            {/* Config & Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-5 mb-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="flex gap-4">
                        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto">
                            <button 
                                onClick={() => setSelectedService('ELECTRICITY')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${selectedService === 'ELECTRICITY' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}>
                                <Zap size={16} /> Điện
                            </button>
                            <button 
                                onClick={() => setSelectedService('WATER')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${selectedService === 'WATER' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}>
                                <Droplets size={16} /> Nước
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                        <select className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:border-emerald-500 min-w-[150px]">
                            <option value="cs1">Cơ sở 1 (Tòa A)</option>
                            <option value="cs2">Cơ sở 2 (Tòa B)</option>
                        </select>
                        <select className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:border-emerald-500">
                            <option value="11/2026">Tháng 11/2026</option>
                            <option value="10/2026">Tháng 10/2026</option>
                        </select>
                        <button className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                            <Filter size={16} /> Tầng
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Input Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400 border-collapse">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Phòng</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Khách thuê</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right w-48">Số cũ (Cuối tháng trước)</th>
                                <th scope="col" className="px-6 py-4 font-semibold w-48 bg-slate-800/20">Số mới (Tháng này)</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right w-32">Sử dụng</th>
                                <th scope="col" className="px-6 py-4 text-center font-semibold w-24">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {readings.map((reading, index) => {
                                const currentParsed = parseInt(reading.current) || 0;
                                const isFilled = reading.current !== '';
                                const usage = isFilled ? Math.max(0, currentParsed - reading.previous) : null;
                                const isInvalid = isFilled && currentParsed < reading.previous;

                                return (
                                    <tr key={index} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-3 text-center text-slate-600">{index + 1}</td>
                                        <td className="px-6 py-3 font-medium text-slate-200">{reading.roomId}</td>
                                        <td className="px-6 py-3">{reading.tenant}</td>
                                        <td className="px-6 py-3 text-right">
                                            <span className="font-mono text-slate-300 font-medium bg-slate-800/50 px-3 py-1.5 rounded">{reading.previous.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3 bg-slate-800/20">
                                            <input 
                                                type="number"
                                                value={reading.current}
                                                onChange={(e) => handleCurrentChange(index, e.target.value)}
                                                className={`w-full bg-slate-950 border px-3 py-1.5 rounded text-white font-mono text-right transition-colors focus:outline-none focus:ring-1 ${
                                                    isInvalid 
                                                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' 
                                                        : isFilled ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500' : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                                                }`}
                                                placeholder="Nhập số..."
                                            />
                                            {isInvalid && <p className="text-[10px] text-rose-500 mt-1 absolute">Số mới phải &ge; {reading.previous}</p>}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={`font-mono font-bold text-base ${isFilled && !isInvalid ? (selectedService === 'ELECTRICITY' ? 'text-amber-500' : 'text-blue-500') : 'text-slate-600'}`}>
                                                {usage !== null && !isInvalid ? `+${usage}` : '-'}
                                                {usage !== null && !isInvalid && <span className="text-xs font-normal ml-1 text-slate-500">{selectedService === 'ELECTRICITY' ? 'kWh' : 'm³'}</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {isFilled && !isInvalid ? (
                                                <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-slate-700 block mx-auto"></span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
