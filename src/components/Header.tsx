import { Shield, MapPin, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1929] border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F57C00] to-[#FF9800] flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0B1929] flex items-center justify-center">
                <Activity className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-bold text-base sm:text-lg leading-tight tracking-tight">
                Sipil<span className="text-[#F57C00]">-</span>Report Banyuasin
              </h1>
              <p className="text-gray-400 text-[10px] sm:text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Smart City Infrastructure Monitoring
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Sistem Aktif
            </div>
            <div className="text-xs text-gray-500 font-medium border-l border-white/10 pl-4">
              Dinas PU Kab. Banyuasin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
