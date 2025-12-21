import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
            HAMS
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light">
            Home Appliance Management System
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link
            href="/appliances"
            className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            ダッシュボードを開く
            <span className="ml-2 group-hover:ml-4 transition-all">→</span>
          </Link>

          <Link
            href="/appliances/new"
            className="px-10 py-5 bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all duration-300"
          >
            新しい機器を登録
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-bold mb-2">一括管理</h3>
            <p className="text-sm text-slate-400">家中にある全ての家電を一つの場所で管理。</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold mb-2">資産把握</h3>
            <p className="text-sm text-slate-400">購入価格や時期を記録し、買い替え時を逃しません。</p>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-bold mb-2">直感操作</h3>
            <p className="text-sm text-slate-400">モダンなインターフェースで快適な管理体験。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
