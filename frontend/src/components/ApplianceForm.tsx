'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appliance } from '@/types';

interface ApplianceFormProps {
    initialData?: Partial<Appliance>;
    isEditing?: boolean;
}

export default function ApplianceForm({ initialData, isEditing }: ApplianceFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        model_number: initialData?.model_number || '',
        purchased_date: initialData?.purchased_date || '',
        disposed_date: initialData?.disposed_date || '',
        price: initialData?.price || '',
        memo: initialData?.memo || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const url = isEditing
                ? `http://localhost:3001/appliances/${initialData?.id}`
                : 'http://localhost:3001/appliances';

            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appliance: formData }),
            });

            if (response.ok) {
                router.push('/appliances');
                router.refresh();
            } else {
                alert('エラーが発生しました');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            alert('通信エラーが発生しました');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">名称 *</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="例: 冷蔵庫"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">型番</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.model_number}
                        onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                        placeholder="例: MR-WX52G"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">参考価格 (円)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="例: 150000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">購入日</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.purchased_date}
                        onChange={(e) => setFormData({ ...formData, purchased_date: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">廃棄日</label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.disposed_date}
                        onChange={(e) => setFormData({ ...formData, disposed_date: e.target.value })}
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">メモ</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-32"
                        value={formData.memo}
                        onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                        placeholder="保証期間や修理履歴など"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:bg-indigo-400 disabled:shadow-none"
                >
                    {isSubmitting ? '処理中...' : (isEditing ? '更新する' : '登録する')}
                </button>
            </div>
        </form>
    );
}
