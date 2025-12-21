'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Appliance } from '@/types';

export default function ApplianceList() {
    const [appliances, setAppliances] = useState<Appliance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/appliances')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setAppliances(data);
                } else {
                    console.error('Expected array but received:', data);
                    setAppliances([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">家電管理</h1>
                        <p className="text-slate-500 mt-2">家庭内の機器をスマートに管理します</p>
                    </div>
                    <Link
                        href="/appliances/new"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        <span>+</span> 新規登録
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appliances.map((appliance) => (
                            <div
                                key={appliance.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-slate-800">{appliance.name}</h2>
                                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">
                                        {appliance.model_number || 'N/A'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">購入日:</span>
                                        <span>{appliance.purchased_date || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">価格:</span>
                                        <span className="font-semibold text-slate-700">
                                            {appliance.price ? `¥${appliance.price.toLocaleString()}` : '-'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <Link
                                        href={`/appliances/${appliance.id}/edit`}
                                        className="flex-1 text-center py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        編集
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {appliances.length === 0 && (
                            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                                <p className="text-slate-400">登録されている機器はありません</p>
                                <Link href="/appliances/new" className="text-indigo-600 font-medium mt-2 inline-block">
                                    最初の機器を登録する
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
