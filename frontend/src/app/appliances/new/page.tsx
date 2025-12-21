import ApplianceForm from '@/components/ApplianceForm';

export default function NewAppliance() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">新しい家電を登録</h1>
                <ApplianceForm />
            </div>
        </div>
    );
}
