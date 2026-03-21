import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Save, Filter, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { meterService } from '../../services/meter';
import { buildingService } from '../../services/building';
import { roomService } from '../../services/room';
import { getServiceIcon } from '../../utils/iconHelper';

// Khai báo mảng rỗng tĩnh để tráng bị re-render vô tận do khác reference
const EMPTY_ARRAY: any[] = [];

export default function MeterReadings() {
    const queryClient = useQueryClient();

    // Lấy ngày hiện tại để set Default tháng/năm
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const [selectedBuildingId, setSelectedBuildingId] = useState<number | ''>('');
    const [selectedFloorId, setSelectedFloorId] = useState<number | ''>('');
    
    // Default system services (fetch from DB to get ID)
    const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');

    // Fetch Buildings for filtering
    const { data: buildingsData } = useQuery({
        queryKey: ['buildings'],
        queryFn: () => buildingService.getBuildings()
    });
    const buildings = buildingsData?.result || EMPTY_ARRAY;

    // Fetch Floors for filtering (based on selected building)
    const { data: floorsData } = useQuery({
        queryKey: ['floors', selectedBuildingId],
        queryFn: () => buildingService.getFloorsByBuilding(selectedBuildingId as number),
        enabled: !!selectedBuildingId
    });
    const floors = floorsData?.result || EMPTY_ARRAY;

    // Fetch Rooms on selected floor
    const { data: roomsData, isLoading: isRoomsLoading } = useQuery({
        queryKey: ['rooms', selectedFloorId],
        queryFn: () => roomService.getRooms({ floorId: selectedFloorId as number }),
        enabled: !!selectedFloorId
    });
    const rooms = roomsData?.result || EMPTY_ARRAY;

    // Fetch All Services to get IDs maps
    const { data: servicesData } = useQuery({
        queryKey: ['services'],
        queryFn: () => meterService.getAllServices()
    });
    const appServices = servicesData?.result || EMPTY_ARRAY;

    // Auto select first Service (usually Electricity)
    useEffect(() => {
        if (appServices.length > 0 && selectedServiceId === '') {
            setSelectedServiceId(appServices[0].serviceId);
        }
    }, [appServices]);

    // Fetch last month's readings to calculate 'Previous Index'
    // To optimize, we fetch ALL readings for the previous month (Wait, month-1 logic could cross year!)
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

    const { data: lastMonthReadingsData, isLoading: isLastReadingsLoading } = useQuery({
        queryKey: ['meter-readings', prevMonth, prevYear],
        queryFn: () => meterService.getReadings({ month: prevMonth, year: prevYear })
    });
    const lastMonthReadings = lastMonthReadingsData?.result || EMPTY_ARRAY;

    // Fetch current month's readings to see what's already saved
    const { data: currentMonthReadingsData, isLoading: isCurrentReadingsLoading } = useQuery({
        queryKey: ['meter-readings', selectedMonth, selectedYear],
        queryFn: () => meterService.getReadings({ month: selectedMonth, year: selectedYear })
    });
    const currentMonthReadings = currentMonthReadingsData?.result || EMPTY_ARRAY;

    // Local State for Bulk Inputs
    const [inputValues, setInputValues] = useState<Record<number, string>>({}); // roomId -> currentIndex string
    const [savedState, setSavedState] = useState<Record<number, boolean>>({}); // roomId -> boolean

    // Sync inputValues with already existing currentMonthReadings
    useEffect(() => {
        if (!selectedServiceId) return;
        const newInputs: Record<number, string> = {};
        const newSaved: Record<number, boolean> = {};

        rooms.forEach((room: any) => {
            const existing = currentMonthReadings.find((r: any) => 
                r.roomId === room.roomId && r.serviceId === selectedServiceId
            );
            if (existing && existing.currentIndex !== null) {
                newInputs[room.roomId] = existing.currentIndex.toString();
                newSaved[room.roomId] = true; // Mark as already saved in DB
            } else {
                // Not saved yet, keep it clear or preserve if they were typing
                // We won't clear if they are currently typing, so only insert if undefined
            }
        });
        
        // This effect runs when rooms or currentMonthReadings change.
        // We shouldn't overwrite unsaved typing carelessly, but for simplicity of this demo:
        setInputValues(prev => ({ ...prev, ...newInputs }));
        setSavedState(newSaved);
    }, [rooms, currentMonthReadings, selectedServiceId]);

    const handleCurrentChange = (roomId: number, value: string) => {
        setInputValues(prev => ({ ...prev, [roomId]: value }));
        setSavedState(prev => ({ ...prev, [roomId]: false })); // User changed it, no longer "saved"
    };

    const mutation = useMutation({
        mutationFn: async (payload: any[]) => meterService.bulkRecord(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meter-readings', selectedMonth, selectedYear] });
            alert("Lưu chỉ số thành công!");
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu chỉ số.');
        }
    });

    const handleSaveAll = () => {
        if (!selectedServiceId) return;

        const payload: any[] = [];
        
        rooms.forEach((room: any) => {
            const val = inputValues[room.roomId];
            if (val && !savedState[room.roomId]) { // Has a value and is NOT already saved natively
                payload.push({
                    roomId: room.roomId,
                    serviceId: selectedServiceId,
                    currentIndex: parseFloat(val),
                    // If we provide readingDate as start of selected month or current, backend handles.
                    // To accurately place it in the right month bucket for querying:
                    readingDate: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-02`, 
                    // prevIndex is optional, backend auto fetches if null.
                });
            }
        });

        if (payload.length === 0) {
            alert("Không có dữ liệu mới nào(chưa lưu) để cập nhật!");
            return;
        }

        mutation.mutate(payload);
    };

    // Derived matrix combinations
    const selectedServiceDetails = appServices.find((s: any) => s.serviceId === selectedServiceId);
    
    // Get month/year options
    const generateMonths = () => {
        const m = [];
        for(let i=0; i<6; i++) {
            let tm = currentDate.getMonth() + 1 - i;
            let ty = currentDate.getFullYear();
            if (tm <= 0) {
                tm += 12;
                ty -= 1;
            }
            m.push({ month: tm, year: ty, label: `Tháng ${tm}/${ty}`});
        }
        return m;
    };
    const monthOptions = useMemo(() => generateMonths(), []);

    const isDataLoading = isRoomsLoading || isLastReadingsLoading || isCurrentReadingsLoading;
    const isSaveDisabled = mutation.isPending || !selectedServiceId || !selectedFloorId;

    return (
        <Layout>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Ghi chỉ số Dịch vụ</h1>
                    <p className="text-slate-400 text-sm">Cập nhật nhanh chỉ số hàng loạt để tự động chốt Bill cuối tháng.</p>
                </div>
                <button 
                    onClick={handleSaveAll}
                    disabled={isSaveDisabled}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Lưu tất cả thay đổi
                </button>
            </div>

            {/* Config & Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-5 mb-6">
                <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
                    
                    {/* Services Toggle */}
                    <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full xl:w-auto overflow-x-auto">
                        {appServices.map((srv: any) => {
                            const isSel = selectedServiceId === srv.serviceId;
                            
                            return (
                                <button 
                                    key={srv.serviceId}
                                    onClick={() => setSelectedServiceId(srv.serviceId)}
                                    className={`flex w-full xl:w-auto justify-center items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                                        isSel 
                                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                        : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50'
                                    }`}>
                                    {getServiceIcon(srv.icon, 16, isSel ? "text-emerald-500" : "text-slate-400")} 
                                    {srv.serviceName}
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                         <select 
                            value={String(selectedBuildingId)}
                            onChange={(e) => {
                                setSelectedBuildingId(e.target.value ? Number(e.target.value) : '');
                                setSelectedFloorId('');
                            }}
                            className="bg-slate-950 border border-slate-700 hover:border-emerald-500/50 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500/50 flex-1 xl:flex-none">
                            <option value="">-- Chọn Cơ sở --</option>
                            {buildings.map((b: any) => (
                                <option key={b.buildingId} value={b.buildingId}>{b.buildingName}</option>
                            ))}
                        </select>

                        <select 
                            value={String(selectedFloorId)}
                            onChange={(e) => setSelectedFloorId(e.target.value ? Number(e.target.value) : '')}
                            disabled={!selectedBuildingId}
                            className="bg-slate-950 border border-slate-700 hover:border-emerald-500/50 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 flex-1 xl:flex-none cursor-pointer">
                            <option value="">-- Chọn Tầng --</option>
                            {floors.map((f: any) => (
                                <option key={f.floorId} value={f.floorId}>{f.floorName}</option>
                            ))}
                        </select>

                        <select 
                            value={`${selectedMonth}-${selectedYear}`}
                            onChange={(e) => {
                                const [m, y] = e.target.value.split('-');
                                setSelectedMonth(Number(m));
                                setSelectedYear(Number(y));
                            }}
                            className="bg-slate-950 border border-slate-700 hover:border-emerald-500/50 text-emerald-400 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500/50 flex-1 xl:flex-none cursor-pointer">
                            {monthOptions.map(opt => (
                                <option key={opt.label} value={`${opt.month}-${opt.year}`}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Matrix Form Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden relative min-h-[400px]">
                {/* Overlay Loader */}
                {isDataLoading && (
                    <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-emerald-500" />
                    </div>
                )}

                {!selectedFloorId ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
                        <Filter size={48} className="mb-4 opacity-20" />
                        <p>Vui lòng Chọn Cơ sở và Tầng để hiển thị danh sách phòng.</p>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-500">
                        <AlertCircle size={48} className="mb-4 opacity-20 text-rose-500" />
                        <p>Tầng này hiện chưa có phòng nào.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400 border-collapse">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Phòng</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Trạng thái/Loại</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right w-48" title={`Dữ liệu lấy từ Tháng ${prevMonth}/${prevYear}`}>
                                        Số cũ <span className="text-slate-600 font-normal lowercase">(Hệ thống tự chốt)</span>
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right w-48 text-emerald-500" title={`Nhập chỉ số của Tháng ${selectedMonth}/${selectedYear}`}>
                                        Số mới <span className="font-normal lowercase text-slate-400">(Nhập thủ công)</span>
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right w-32">Sử dụng</th>
                                    <th scope="col" className="px-6 py-4 text-center font-semibold w-24">Đã lưu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rooms.map((room: any, index: number) => {
                                    // Tìm previousIndex từ tháng trước
                                    const prevRecord = lastMonthReadings.find((r: any) => r.roomId === room.roomId && r.serviceId === selectedServiceId);
                                    const previousIndex = prevRecord?.currentIndex || 0;

                                    const valStr = inputValues[room.roomId] || '';
                                    const currentParsed = parseFloat(valStr);
                                    const isFilled = valStr !== '';
                                    const usage = isFilled && !isNaN(currentParsed) ? Math.max(0, currentParsed - previousIndex) : null;
                                    const isInvalid = isFilled && !isNaN(currentParsed) && currentParsed < previousIndex;
                                    const isSaved = savedState[room.roomId];

                                    // Colors based on Service
                                    const isElec = selectedServiceDetails?.serviceName.toLowerCase().includes('điện');
                                    let highlightColor = 'text-emerald-500';
                                    if (isFilled && !isInvalid) highlightColor = isElec ? 'text-amber-500' : 'text-blue-500';

                                    return (
                                        <tr key={room.roomId} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-3 text-center text-slate-600">{index + 1}</td>
                                            <td className="px-6 py-3 font-bold text-slate-200">{room.roomNumber}</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">
                                                {room.currentStatus === 'AVAILABLE' ? (
                                                    <span className="text-emerald-500/70">Trống</span>
                                                ) : room.currentStatus}
                                            </td>
                                            
                                            <td className="px-6 py-3 text-right">
                                                <span className="font-mono text-slate-400 font-medium px-3 py-1.5">
                                                    {previousIndex.toLocaleString()}
                                                </span>
                                            </td>
                                            
                                            <td className="px-6 py-3">
                                                <div className="relative">
                                                    <input 
                                                        type="number"
                                                        value={valStr}
                                                        onChange={(e) => handleCurrentChange(room.roomId, e.target.value)}
                                                        className={`w-full bg-black/40 border px-3 py-2 rounded-lg text-white font-mono text-right transition-all focus:outline-none focus:ring-1 shadow-inner ${
                                                            isInvalid 
                                                                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' 
                                                                : isSaved 
                                                                    ? 'border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500 opacity-90'
                                                                    : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                                                        }`}
                                                        placeholder="Nhập..."
                                                    />
                                                    {isInvalid && <div className="text-[10px] text-rose-500 mt-1 absolute right-0">Số mới &ge; {previousIndex}</div>}
                                                </div>
                                            </td>
                                            
                                            <td className="px-6 py-3 text-right">
                                                <span className={`font-mono font-bold text-base ${isFilled && !isInvalid ? highlightColor : 'text-slate-600'}`}>
                                                    {usage !== null && !isInvalid ? `+${usage.toLocaleString()}` : '-'}
                                                    {usage !== null && !isInvalid && <span className="text-xs font-normal ml-1 text-slate-500">{selectedServiceDetails?.unit}</span>}
                                                </span>
                                            </td>

                                            <td className="px-6 py-3 text-center">
                                                {isSaved ? (
                                                    <span title="Đã lưu vào CSDL"><CheckCircle2 size={18} className="text-emerald-500 mx-auto" /></span>
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-slate-700 block mx-auto" title="Chưa có dữ liệu tháng này"></span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
