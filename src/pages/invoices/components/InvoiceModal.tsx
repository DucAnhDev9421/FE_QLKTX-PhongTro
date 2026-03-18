import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import { Invoice } from '../../../types/invoice';

interface Props {
    invoice: Invoice | null;
    onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: Props) {
    const isEdit = !!invoice;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="relative bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            {isEdit ? 'Chi tiết Hóa đơn' : 'Chốt bill mới'}
                            {isEdit && <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">{invoice.id}</span>}
                        </h2>
                        {isEdit && <p className="text-xs text-slate-500 mt-1">Phòng: {invoice.roomId} - {invoice.tenantName} - Kỳ: {invoice.billingMonth}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {isEdit && (
                            <button className="text-slate-400 hover:text-emerald-500 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700 hidden sm:flex items-center gap-1.5 text-xs font-medium px-3">
                                <ExternalLink size={14} /> Xem PDF
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-200 transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg border border-slate-700">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Chọn Phòng</label>
                            <select 
                                defaultValue={invoice?.roomId || ''}
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            >
                                <option value="" disabled>-- Chọn phòng --</option>
                                <option value="A101">A101 - Nguyễn Văn A</option>
                                <option value="B205">B205 - Trần Thị B</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Kỳ cước (Tháng/Năm)</label>
                            <input 
                                type="text" 
                                defaultValue={invoice?.billingMonth || '11/2026'}
                                placeholder="MM/YYYY"
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                        {/* Chốt điện */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-500 font-medium">
                                <span>⚡ Số Điện (kWh)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Số cũ</label>
                                    <input 
                                        type="number" 
                                        defaultValue={invoice?.electricityUsageStart || ''}
                                        className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-emerald-500 mb-1 font-medium">Số mới</label>
                                    <input 
                                        type="number" 
                                        defaultValue={invoice?.electricityUsageEnd || ''}
                                        className="w-full bg-slate-800 border-emerald-500/30 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-emerald-500/5 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block w-px bg-slate-800 h-full absolute left-1/2 -ml-px top-0" />

                        {/* Chốt nước */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-500 font-medium">
                                <span>💧 Số Nước (m³)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Số cũ</label>
                                    <input 
                                        type="number" 
                                        defaultValue={invoice?.waterUsageStart || ''}
                                        className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-blue-500 mb-1 font-medium">Số mới</label>
                                    <input 
                                        type="number" 
                                        defaultValue={invoice?.waterUsageEnd || ''}
                                        className="w-full bg-slate-800 border-blue-500/30 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-500/5 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900 shadow-inner">
                            <span className="text-sm font-medium text-slate-300">Tiền phòng cơ bản:</span>
                            <span className="font-mono text-slate-200">
                                {invoice ? invoice.roomPrice.toLocaleString() : '4,000,000'}đ
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900 shadow-inner">
                            <span className="text-sm font-medium text-slate-300">Phụ phí/Dịch vụ:</span>
                            <input 
                                type="number"
                                defaultValue={invoice?.otherFees || 150000}
                                className="w-32 bg-slate-800 border border-slate-700 text-sm text-white rounded px-2 py-1 text-right font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 shadow-inner mt-2">
                            <span className="text-base font-bold text-emerald-500">Tổng cộng ước tính:</span>
                            <span className="text-xl font-bold font-mono text-emerald-400">
                                {invoice ? invoice.totalAmount.toLocaleString() : '0'}đ
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Hạn thanh toán</label>
                            <input 
                                type="date" 
                                defaultValue={invoice?.dueDate || ''}
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Trạng thái</label>
                            <select 
                                defaultValue={invoice?.status || 'UNPAID'}
                                className="w-full bg-slate-800 border border-slate-700 text-sm text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                            >
                                <option value="PAID" className="text-emerald-500">Đã thu</option>
                                <option value="UNPAID" className="text-amber-500">Chưa thu</option>
                                <option value="OVERDUE" className="text-rose-500">Quá hạn</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-xl shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                        Đóng
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        {isEdit ? 'Lưu thay đổi' : 'Tạo hóa đơn'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
