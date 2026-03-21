import { useState, FormEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractService } from '../../../services/contract';
import { roomService } from '../../../services/room';
import { tenantService } from '../../../services/tenant';
// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Alert from '../../../components/ui/Alert';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editData: any | null; // Null means create mode
}

export default function ContractModal({ isOpen, onClose, editData }: Props) {
    const queryClient = useQueryClient();
    const isEdit = !!editData;

    const [roomId, setRoomId] = useState<number | ''>('');
    const [representativeTenantId, setRepresentativeTenantId] = useState<number | ''>('');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [rentalPrice, setRentalPrice] = useState<number | ''>('');
    const [depositAmount, setDepositAmount] = useState<number | ''>('');
    const [paymentCycle, setPaymentCycle] = useState(1);

    const [errorMsg, setErrorMsg] = useState('');

    // Pre-fill data if editing
    useEffect(() => {
        if (isEdit && editData) {
            setRoomId(editData.roomId);
            const rep = editData.members?.find((m: any) => m.isRepresentative);
            setRepresentativeTenantId(rep ? rep.tenantId : '');
            setStartDate(editData.startDate ? new Date(editData.startDate) : new Date());
            setEndDate(editData.endDate ? new Date(editData.endDate) : null);
            setRentalPrice(editData.rentalPrice || '');
            setDepositAmount(editData.depositAmount || '');
        } else {
            // Reset
            setRoomId('');
            setRepresentativeTenantId('');
            setStartDate(new Date());
            setEndDate(null);
            setRentalPrice('');
            setDepositAmount('');
            setPaymentCycle(1);
        }
        setErrorMsg('');
    }, [isEdit, editData, isOpen]);

    // Fetch dependencies
    const { data: roomsData } = useQuery({
        queryKey: ['rooms', 'AVAILABLE'],
        queryFn: () => roomService.getRooms({ status: 'AVAILABLE' }),
        enabled: isOpen && !isEdit // Only need available rooms when creating
    });
    const rooms = roomsData?.result || [];

    // Fetch all rooms if editing so we can show the current room name
    const { data: allRoomsData } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.getRooms(),
        enabled: isOpen && isEdit
    });
    const editRooms = allRoomsData?.result || [];

    const { data: tenantsData } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => tenantService.getTenants(),
        enabled: isOpen && !isEdit // Only can pick representative on creation for now based on backend logic
    });
    const tenants = tenantsData?.result || [];

    // Auto-fill price when room is selected
    useEffect(() => {
        if (!isEdit && roomId) {
            const selectedRoom = rooms.find((r: any) => r.roomId === roomId);
            if (selectedRoom) {
                setRentalPrice(selectedRoom.roomType?.basePrice || 0);
            }
        }
    }, [roomId, isEdit, rooms]);

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            if (isEdit) {
                return contractService.updateContract(editData.contractId, payload);
            } else {
                return contractService.createContract(payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!roomId) { setErrorMsg('Vui lòng chọn Phòng'); return; }
        if (!isEdit && !representativeTenantId) { setErrorMsg('Vui lòng chọn Người đứng tên'); return; }
        if (!startDate) { setErrorMsg('Vui lòng chọn ngày bắt đầu'); return; }
        if (rentalPrice === '' || Number(rentalPrice) < 0) { setErrorMsg('Giá thuê không hợp lệ'); return; }

        const fmtStart = startDate ? startDate.toISOString().split('T')[0] : null;
        const fmtEnd = endDate ? endDate.toISOString().split('T')[0] : null;

        const payload: any = {
            startDate: fmtStart,
            endDate: fmtEnd,
            rentalPrice: Number(rentalPrice),
            depositAmount: depositAmount ? Number(depositAmount) : 0,
        };

        if (!isEdit) {
            payload.roomId = Number(roomId);
            payload.representativeTenantId = Number(representativeTenantId);
            payload.paymentCycle = Number(paymentCycle);
        }

        mutation.mutate(payload);
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans bg-slate-900/80 backdrop-blur-sm">
            <div 
                className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {isEdit ? 'Cập nhật Hợp đồng' : 'Tạo Hợp đồng mới'}
                    </h2>
                    <button 
                        disabled={mutation.isPending}
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto">
                    {errorMsg && <Alert type="error" message={errorMsg} className="mb-4" />}

                    <form id="contract-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Room */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Phòng <span className="text-rose-500">*</span></label>
                                <select 
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                    value={roomId}
                                    onChange={(e) => setRoomId(Number(e.target.value))}
                                    disabled={isEdit || mutation.isPending}
                                >
                                    <option value="">-- Chọn phòng --</option>
                                    {!isEdit ? rooms.map((r: any) => (
                                        <option key={r.roomId} value={r.roomId}>{r.roomNumber} ({r.roomType?.typeName} - {r.roomType?.basePrice}đ)</option>
                                    )) : editRooms.map((r: any) => (
                                        <option key={r.roomId} value={r.roomId}>{r.roomNumber}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Representative */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Người đứng tên (Đại diện) <span className="text-rose-500">*</span></label>
                                <select 
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                    value={representativeTenantId}
                                    onChange={(e) => setRepresentativeTenantId(Number(e.target.value))}
                                    disabled={isEdit || mutation.isPending}
                                >
                                    <option value="">-- Chọn người thuê --</option>
                                    {isEdit ? (
                                        <option value={representativeTenantId}>{editData?.members?.find((m:any) => m.isRepresentative)?.fullName || 'Không xác định'}</option>
                                    ) : tenants.map((t: any) => (
                                        <option key={t.tenantId} value={t.tenantId}>{t.fullName} ({t.identityCardNumber})</option>
                                    ))}
                                </select>
                                {!isEdit && <p className="text-[10px] text-slate-500 mt-1">Lưu ý: Chỉ chọn được khi đang lập hợp đồng mới.</p>}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Ngày bắt đầu <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all shadow-inner placeholder:text-slate-600 pl-10"
                                        placeholderText="dd/mm/yyyy"
                                        disabled={isEdit || mutation.isPending}
                                    />
                                    <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Ngày kết thúc</label>
                                <div className="relative">
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        minDate={startDate || undefined}
                                        dateFormat="dd/MM/yyyy"
                                        isClearable
                                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all shadow-inner placeholder:text-slate-600 pl-10"
                                        placeholderText="Tự động gia hạn"
                                        disabled={mutation.isPending}
                                    />
                                    <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Rental Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Giá thuê (VNĐ/tháng) <span className="text-rose-500">*</span></label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-mono"
                                    value={rentalPrice}
                                    onChange={(e) => setRentalPrice(Number(e.target.value))}
                                    disabled={mutation.isPending}
                                />
                            </div>

                            {/* Deposit Amount */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Tiền cọc (VNĐ)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-mono"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                                    disabled={mutation.isPending}
                                />
                            </div>

                            {/* Payment Cycle */}
                            {!isEdit && (
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Chu kỳ Thanh toán (Tháng)</label>
                                <input 
                                    type="number"
                                    min={1}
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                                    value={paymentCycle}
                                    onChange={(e) => setPaymentCycle(Number(e.target.value))}
                                    disabled={mutation.isPending}
                                />
                            </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        form="contract-form"
                        disabled={mutation.isPending}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    >
                        {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? 'Lưu thay đổi' : 'Tạo hợp đồng'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
