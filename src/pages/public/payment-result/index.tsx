import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Home, RefreshCcw, Loader2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { momoService } from '../../../services';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const [isSyncing, setIsSyncing] = useState(false);

    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const message = searchParams.get('message');
    const transId = searchParams.get('transId');

    const isSuccess = resultCode === '0';

    useEffect(() => {
        // Nếu MoMo báo thành công, ta gọi thêm API Query lên Backend của mình 
        // để chắc chắn Backend đã cập nhật trạng thái PAID vào DB (phòng hờ IPN bị chậm)
        if (isSuccess && orderId) {
            const syncStatus = async () => {
                setIsSyncing(true);
                try {
                    await momoService.queryStatus(orderId);
                    // Sau khi sync xong thì invalidate cache luôn
                    queryClient.invalidateQueries({ queryKey: ['myRoom'] });
                } catch (error) {
                    console.error('Failed to sync payment status:', error);
                } finally {
                    setIsSyncing(false);
                }
            };
            syncStatus();
        }
    }, [isSuccess, orderId, queryClient]);

    const formatCurrency = (val: string | null) => {
        if (!val) return '0';
        return new Intl.NumberFormat('vi-VN').format(parseInt(val));
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
            theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
            <div className={`max-w-md w-full p-8 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all ${
                theme === 'dark' ? 'bg-slate-900/40 border-white/10' : 'bg-white/80 border-slate-200'
            }`}>
                {/* Decorative background gradients */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 ${
                    isSuccess ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg ${
                        isSuccess 
                        ? 'bg-emerald-500/20 text-emerald-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                        {isSuccess ? <CheckCircle size={48} /> : <XCircle size={48} />}
                    </div>

                    <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
                        {isSyncing ? 'Đang xác thực...' : (isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại')}
                    </h1>
                    <p className={`mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isSyncing ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Loader2 className="h-4 w-4 animate-spin" /> 
                                Vui lòng chờ trong giây lát...
                            </span>
                        ) : (
                            isSuccess 
                                ? 'Cảm ơn bạn. Giao dịch đã được hệ thống ghi nhận thành công.' 
                                : message || 'Đã có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng thử lại.'
                        )}
                    </p>

                    <div className={`w-full p-6 rounded-2xl mb-8 space-y-4 text-left ${
                        theme === 'dark' ? 'bg-black/20' : 'bg-slate-100/50'
                    }`}>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">Mã đơn hàng</span>
                            <span className="font-mono font-medium truncate ml-4">{orderId || 'N/A'}</span>
                        </div>
                        {transId && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">Mã giao dịch</span>
                                <span className="font-mono font-medium truncate ml-4">{transId}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                            <span className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">Số tiền</span>
                            <span className="text-lg font-bold text-[#D4AF37]">{formatCurrency(amount)} đ</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        {isSuccess ? (
                            <button 
                                onClick={() => {
                                    queryClient.invalidateQueries({ queryKey: ['myRoom'] });
                                    navigate('/my-room');
                                }}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                            >
                                <Home size={18} /> VỀ PHÒNG CỦA TÔI
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate(-1)}
                                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={18} /> THỬ LẠI
                            </button>
                        )}
                        
                        <button 
                            onClick={() => navigate('/')}
                            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                                theme === 'dark' 
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                        >
                            <ArrowRight size={18} /> VỀ TRANG CHỦ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
