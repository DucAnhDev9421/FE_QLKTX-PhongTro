import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Search, Plus, FileText, Download, Edit2, Trash2, UserPlus, Users, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { contractService } from '../../services/contract';
import ContractModal from './components/ContractModal';
import TerminateModal from './components/TerminateModal';
import AddMemberModal from './components/AddMemberModal';

export default function Contracts() {
    const queryClient = useQueryClient();

    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal States
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [editContractData, setEditContractData] = useState<any>(null); // Null if create, obj if edit

    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [terminateContractData, setTerminateContractData] = useState<any>(null);

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState<number | null>(null);

    // Fetch Contracts
    const { data: contractsData, isLoading } = useQuery({
        queryKey: ['contracts', statusFilter],
        queryFn: () => contractService.getContracts(statusFilter)
    });
    const contractsList = contractsData?.result || [];

    // Filter by search term locally
    const filteredContracts = contractsList.filter((c: any) => 
        c.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.members?.some((m: any) => m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Members Remove Mutation
    const removeMemberMutation = useMutation({
        mutationFn: async ({ contractId, tenantId }: { contractId: number, tenantId: number }) => 
            contractService.removeMember(contractId, tenantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            alert("Đã xóa thành viên khỏi hợp đồng.");
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa thành viên.');
        }
    });

    const deleteContractMutation = useMutation({
        mutationFn: (id: number) => contractService.deleteContract(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            alert("Đã xóa hợp đồng thành công (Xóa mềm).");
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa hợp đồng.');
        }
    });

    const handleOpenCreate = () => {
        setEditContractData(null);
        setIsContractModalOpen(true);
    };

    const handleOpenEdit = (contract: any) => {
        setEditContractData(contract);
        setIsContractModalOpen(true);
    };

    const handleOpenTerminate = (contract: any) => {
        setTerminateContractData(contract);
        setIsTerminateModalOpen(true);
    };

    const handleOpenAddMember = (contractId: number) => {
        setSelectedContractId(contractId);
        setIsAddMemberModalOpen(true);
    };

    const handleDownload = async (contractId: number) => {
        try {
            await contractService.downloadContractWord(contractId);
        } catch (error) {
            alert("Lỗi khi tải file hợp đồng.");
        }
    };

    const handleRemoveMember = (contractId: number, tenantId: number, isRep: boolean) => {
        if (isRep) {
            alert("Không thể xóa người đại diện hợp đồng.");
            return;
        }
        if (window.confirm("Bạn có chắc muốn xóa thành viên này khỏi phòng?")) {
            removeMemberMutation.mutate({ contractId, tenantId });
        }
    };

    const handleDeleteContract = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này? (Hành động này sẽ xóa mềm hợp đồng và giải phóng phòng nếu đang ở)")) {
            deleteContractMutation.mutate(id);
        }
    };

    return (
        <Layout>
            {/* Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Quản lý Hợp đồng</h1>
                    <p className="text-slate-400 text-sm">Quản lý vòng đời lưu trú, lập hợp đồng và thanh lý phòng.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleOpenCreate}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                        <Plus size={18} /> Lập hợp đồng mới
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-visible min-h-[500px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Tra cứu người thuê, phòng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500 font-mono"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 cursor-pointer outline-none font-medium"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="ACTIVE">Đang hiệu lực (Active)</option>
                            <option value="EXPIRED">Đã hết hạn (Expired)</option>
                            <option value="TERMINATED">Đã thanh lý (Terminated)</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 size={32} className="animate-spin text-emerald-500" />
                    </div>
                ) : filteredContracts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>Không tìm thấy hợp đồng nào phù hợp.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Mã HĐ</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider w-64">Người Đại diện / Thành viên</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Phòng</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Thời Hạn</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Giá thuê/Cọc</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Trạng Thái</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredContracts.map((contract: any) => {
                                    const representative = contract.members?.find((m: any) => m.isRepresentative);
                                    const otherMembers = contract.members?.filter((m: any) => !m.isRepresentative) || [];
                                    const isActive = contract.contractStatus === 'ACTIVE';

                                    return (
                                        <tr key={contract.contractId} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className="font-mono text-slate-200 font-medium text-xs">#{contract.contractId}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-top">
                                                {/* Đại diện */}
                                                <div className="font-medium text-slate-200 mb-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Người đại diện"></span>
                                                    {representative ? representative.fullName : 'Chưa định danh'}
                                                </div>
                                                
                                                {/* Các thành viên khác */}
                                                {otherMembers.length > 0 && (
                                                    <div className="space-y-1.5 mt-3 border-t border-slate-800 pt-3">
                                                        <div className="text-[10px] uppercase text-slate-500 font-semibold mb-2">Thành viên khác ({otherMembers.length})</div>
                                                        {otherMembers.map((m: any) => (
                                                            <div key={m.tenantId} className="flex items-center justify-between group/member">
                                                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                                    <Users size={12} className="opacity-50" />
                                                                    <span>{m.fullName}</span>
                                                                </div>
                                                                {isActive && (
                                                                <button 
                                                                    onClick={() => handleRemoveMember(contract.contractId, m.tenantId, m.isRepresentative)}
                                                                    className="text-slate-600 hover:text-rose-500 opacity-0 group-hover/member:opacity-100 transition-opacity"
                                                                    title="Xóa khỏi phòng"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {isActive && (
                                                    <button 
                                                        onClick={() => handleOpenAddMember(contract.contractId)}
                                                        className="mt-3 text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                                                    >
                                                        <UserPlus size={12} /> Thêm thành viên
                                                    </button>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 align-top text-center">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-950 text-slate-200 border border-slate-700 mt-1">
                                                    {contract.roomNumber}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col gap-1.5 text-xs mt-1">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <span className="text-slate-500 w-8">Từ:</span> 
                                                        {contract.startDate ? format(new Date(contract.startDate), 'dd/MM/yyyy') : '-'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <span className="w-8">Đến:</span> 
                                                        {contract.endDate ? format(new Date(contract.endDate), 'dd/MM/yyyy') : 'Vô thời hạn'}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-top text-right">
                                                <div className="flex flex-col gap-1.5 mt-1">
                                                    <div className="font-medium text-emerald-400" title="Giá Thuê">
                                                        {new Intl.NumberFormat('vi-VN').format(contract.rentalPrice || 0)}đ
                                                    </div>
                                                    <div className="text-xs text-slate-500" title="Tiền Cọc">
                                                        Cọc: {new Intl.NumberFormat('vi-VN').format(contract.depositAmount || 0)}đ
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-top text-center">
                                                <div className="mt-1">
                                                    <ContractStatusBadge status={contract.contractStatus} />
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-top text-right">
                                                <div className="flex items-center justify-end gap-2 mt-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {isActive && (
                                                        <button 
                                                            onClick={() => handleOpenEdit(contract)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors rounded-md hover:bg-slate-800"
                                                            title="Cập nhật Hợp đồng"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDownload(contract.contractId)}
                                                        className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors rounded-md hover:bg-slate-800"
                                                        title="Xuất File Word (.docx)"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    {isActive && (
                                                        <button 
                                                            onClick={() => handleOpenTerminate(contract)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-md hover:bg-slate-800"
                                                            title="Thanh lý / Trả phòng"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteContract(contract.contractId)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-slate-800"
                                                        title="Xóa Hợp đồng (Xóa mềm)"
                                                    >
                                                        <Trash2 size={16} className="fill-current opacity-20 group-hover:opacity-100" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ContractModal 
                isOpen={isContractModalOpen} 
                onClose={() => setIsContractModalOpen(false)} 
                editData={editContractData} 
            />

            <TerminateModal 
                isOpen={isTerminateModalOpen}
                onClose={() => setIsTerminateModalOpen(false)}
                contractData={terminateContractData}
            />

            <AddMemberModal 
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                contractId={selectedContractId}
            />

        </Layout>
    );
}

function ContractStatusBadge({ status }: { status: string }) {
    let styles = '';
    let label = status;

    switch (status) {
        case 'ACTIVE':
            styles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            label = 'Đang hiệu lực';
            break;
        case 'EXPIRED':
            styles = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            label = 'Hết hạn';
            break;
        case 'TERMINATED':
            styles = 'bg-slate-800 text-slate-400 border-slate-700';
            label = 'Đã thanh lý';
            break;
        case 'WAITING_DEPOSIT':
            styles = 'bg-pink-500/10 text-pink-500 border-pink-500/20';
            label = 'Chờ tiền cọc';
            break;
        default:
            styles = 'bg-slate-800 text-slate-400 border-slate-700';
    }

    return (
        <span className={`inline-flex px-2.5 py-1.5 rounded-md text-[11px] uppercase tracking-wider font-bold border ${styles}`}>
            {label}
        </span>
    );
}
