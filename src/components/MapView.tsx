import { useState } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import type { Report } from '@/lib/supabase';

interface MapViewProps {
  reports: Report[];
}

export default function MapView({ reports }: MapViewProps) {
  const [selected, setSelected] = useState<Report | null>(null);

  const statusColor = (status: string) => {
    if (status === 'Repaired') return 'bg-green-500';
    if (status === 'In Progress') return 'bg-blue-500';
    return 'bg-[#F57C00]';
  };

  const statusRing = (status: string) => {
    if (status === 'Repaired') return 'ring-green-500/30';
    if (status === 'In Progress') return 'ring-blue-500/30';
    return 'ring-[#F57C00]/30';
  };

  return (
    <div className="bg-[#0B1929] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <h3 className="text-white font-semibold text-sm">Peta Sebaran Kerusakan</h3>
          <p className="text-gray-500 text-xs mt-0.5">Koridor Banyuasin — lahan basah & transit</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#F57C00]"></span> Pending
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Progress
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Selesai
          </span>
        </div>
      </div>

      <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br from-[#0A1525] to-[#0E1D33] overflow-hidden">
        {/* Simulated map grid */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Simulated river / wetland corridors */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 500" preserveAspectRatio="none">
          <path d="M 0,180 Q 200,140 400,200 T 800,160" fill="none" stroke="#1E5F8E" strokeWidth="20" strokeLinecap="round" opacity="0.5" />
          <path d="M 0,320 Q 300,380 500,300 T 800,340" fill="none" stroke="#1E5F8E" strokeWidth="15" strokeLinecap="round" opacity="0.4" />
          <path d="M 150,0 Q 180,200 260,500" fill="none" stroke="#1E5F8E" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
        </svg>

        {/* Map controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white/20 transition-colors">
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
          <Navigation className="w-3.5 h-3.5 text-[#F57C00]" />
          <span className="text-[10px] text-gray-300 font-medium">Banyuasin, Sumsel</span>
        </div>

        {/* Mock pins positioned by lat/lng mapped to grid */}
        {reports.map((report) => {
          const latNorm = (report.latitude - (-2.82)) / ((-2.55) - (-2.82));
          const lngNorm = (report.longitude - 104.40) / (104.72 - 104.40);
          const left = `${Math.max(5, Math.min(92, lngNorm * 100))}%`;
          const top = `${Math.max(5, Math.min(90, (1 - latNorm) * 100))}%`;

          return (
            <button
              key={report.id}
              onClick={() => setSelected(selected?.id === report.id ? null : report)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none`}
              style={{ left, top }}
            >
              {report.status !== 'Repaired' && (
                <span className={`absolute inset-0 rounded-full ${statusColor(report.status)} animate-ping opacity-40`}></span>
              )}
              <span className={`relative block w-3 h-3 rounded-full ${statusColor(report.status)} ring-4 ${statusRing(report.status)} group-hover:scale-150 transition-transform`}></span>
              {selected?.id === report.id && (
                <div className="absolute z-20 left-1/2 -translate-x-1/2 -top-2 -translate-y-full w-56 bg-[#13243B] border border-white/15 rounded-xl shadow-2xl p-3 text-left">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F57C00] flex-shrink-0" />
                    <span className="text-white text-xs font-semibold truncate">{report.infrastructure_type}</span>
                  </div>
                  <p className="text-gray-400 text-[10px] mb-1.5 line-clamp-2">{report.description}</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">{report.subdistrict.replace('Kecamatan ', '')}</span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      report.status === 'Repaired' ? 'bg-green-500/10 text-green-400' :
                      report.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-[#F57C00]/10 text-[#FFB74D]'
                    }`}>{report.status}</span>
                  </div>
                  <div className="text-[9px] text-gray-600 mt-1.5">
                    {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {/* Compass */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-[9px] text-gray-400 font-bold">N</span>
        </div>
      </div>
    </div>
  );
}
