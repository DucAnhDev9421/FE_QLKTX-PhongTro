import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Upload, ImagePlus, Trash2, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../../../services/room';
import Alert from '../../../components/ui/Alert';

const MAX_FILES = 10;
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

interface Props {
    room: any;
    onClose: () => void;
}

export default function ImageUploadModal({ room, onClose }: Props) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const existingImages: string[] = room.imageUrls || [];
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const remainingSlots = MAX_FILES - existingImages.length;

    const validateAndAddFiles = useCallback((files: FileList | File[]) => {
        setErrorMsg('');
        const newFiles: File[] = [];
        const newPreviews: string[] = [];

        for (const file of Array.from(files)) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                setErrorMsg(`"${file.name}" không phải định dạng hỗ trợ (JPEG/PNG).`);
                return;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setErrorMsg(`"${file.name}" vượt quá ${MAX_SIZE_MB}MB.`);
                return;
            }
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        }

        const total = selectedFiles.length + newFiles.length;
        if (total > remainingSlots) {
            setErrorMsg(`Chỉ có thể upload thêm tối đa ${remainingSlots} ảnh nữa (đã có ${existingImages.length}/${MAX_FILES}).`);
            return;
        }

        setSelectedFiles(prev => [...prev, ...newFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    }, [selectedFiles, remainingSlots, existingImages.length]);

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) {
            validateAndAddFiles(e.dataTransfer.files);
        }
    };

    const mutation = useMutation({
        mutationFn: () => roomService.uploadRoomImages(room.roomId, selectedFiles),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            onClose();
        },
        onError: (err: any) => {
            setErrorMsg(err.response?.data?.message || 'Upload thất bại. Vui lòng thử lại.');
        }
    });

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5 shrink-0">
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <ImagePlus size={18} className="text-emerald-500" />
                        Ảnh Phòng {room.roomNumber}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 p-1.5 rounded-lg border border-white/5 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-y-auto space-y-5">
                    {errorMsg && <Alert type="error" message={errorMsg} />}

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-3">Ảnh hiện có ({existingImages.length}/{MAX_FILES})</p>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {existingImages.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={url} alt={`room-${i}`} className="w-full h-full object-cover" />
                                        {i === 0 && (
                                            <span className="absolute top-1 left-1 bg-emerald-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded">Chính</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload Zone */}
                    {remainingSlots > 0 ? (
                        <>
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                    isDragging
                                        ? 'border-emerald-500 bg-emerald-500/5'
                                        : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.02]'
                                }`}
                            >
                                <Upload size={32} className="mx-auto text-slate-500 mb-3" />
                                <p className="text-sm text-slate-300 font-medium">Kéo thả ảnh vào đây hoặc <span className="text-emerald-400">chọn file</span></p>
                                <p className="text-xs text-slate-500 mt-1">JPEG / PNG • Tối đa {MAX_SIZE_MB}MB • Còn {remainingSlots} slot trống</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => e.target.files && validateAndAddFiles(e.target.files)}
                                />
                            </div>

                            {/* Preview Selected */}
                            {previews.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-3">Ảnh sẽ upload ({previews.length})</p>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                        {previews.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-500/30 group">
                                                <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                    className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3 text-amber-400">
                            <AlertCircle size={20} />
                            <p className="text-sm">Phòng này đã đạt giới hạn {MAX_FILES} ảnh. Không thể upload thêm.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-white/5 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        Đóng
                    </button>
                    {selectedFiles.length > 0 && (
                        <button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                            className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-70"
                        >
                            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Upload {selectedFiles.length} ảnh
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
