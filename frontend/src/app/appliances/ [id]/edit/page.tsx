'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ApplianceForm from '@/components/ApplianceForm';
import { Appliance } from '@/types';

export default function EditAppliance() {
    const params = useParams();
    const [appliance, setAppliance] = useState<Appliance | null>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/appliances/${params.id}`)
            .then((res) => res.json())
            .then((data) => setAppliance(data))
            .catch((err) => console.error(err));
    }, [params.id]);

    if (!appliance) return <div className="p-8">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">機器情報を編集</h1>
                <ApplianceForm initialData={appliance} isEditing />
            </div>
        </div>
    );
}
