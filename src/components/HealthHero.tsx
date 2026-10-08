import { AlertTriangle, Clock, Loader2, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';

interface HealthHeroProps {
  healthIndex: number;
  totalReports: number;
  pending: number;
  inProgress: number;
  repaired: number;
}

export default function HealthHero({ healthIndex, totalReports, pending, inProgress, repaired }: HealthHeroProps) {
  const isGood = healthIndex >= 70;
  const isFair = healthIndex >= 50 && healthIndex < 70;

  const ringColor = isGood ? 'stroke-green-500' : isFair ? 'stroke-[#F57C00]' : 'stroke-red-500';
  const glowColor = isGood ? 'shadow-green-500/20' : isFair ? 'shadow-orange-500/20' : 'shadow-red-500/20';
  const bgColor = isGood ? 'from-green-500/10' : isFair ? 'from-[#F57C00]/10' : 'from-red-500/10';

  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (healthIndex / 100) * circumference;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgColor} to-[#0B1929] border border-white/10 p-6 sm:p-8 shadow-xl ${glowColor}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F57C00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        {/* Health Index Circle */}
        <div className="relative flex-shrink-0">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle
              cx="90" cy="90" r="80" fill="none"
              className={ringColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{healthIndex}%</span>
            <span className="text-xs text-gray-400 mt-1">Roads Functional</span>
          </div>
        </div>

        {/* Description + Trend */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F57C00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F57C00]"></span>
            </span>
            Indeks Kesehatan Infrastruktur
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Kabupaten Banyuasin
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md">
            Pemantauan real-time kondisi jalan dan jembatan di koridor lahan basah dan transit Banyuasin.
          </p>
          <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
            {isFair ? (
              <div className="flex items-center gap-1.5 text-[#F57C00] text-sm font-medium">
                <TrendingDown className="w-4 h-4" />
                Perlu perhatian — {pending} laporan menunggu validasi
              </div>
            ) : isGood ? (
              <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                Kondisi stabil — pemeliharaan berjalan
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                Kritis — {pending} laporan mendesak
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Total Reports" value={totalReports} color="text-white" bg="bg-white/5" border="border-white/10" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Pending Validation" value={pending} color="text-[#FFB74D]" bg="bg-[#F57C00]/10" border="border-[#F57C00]/20" />
        <StatCard icon={<Loader2 className="w-5 h-5 animate-spin" />} label="In Progress" value={inProgress} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Repaired" value={repaired} color="text-green-400" bg="bg-green-500/10" border="border-green-500/20" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg, border }: {
  icon: React.ReactNode; label: string; value: number; color: string; bg: string; border: string;
}) {
  return (
    <div className={`${bg} ${border} border rounded-xl p-4 transition-all hover:scale-[1.02] hover:border-white/20`}>
      <div className="flex items-center justify-between mb-2">
        <span className={color}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}
