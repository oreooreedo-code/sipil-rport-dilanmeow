import { AlertTriangle, Clock, Loader2, CheckCircle2, MapPin, ChevronRight } from 'lucide-react';
import type { Report } from '@/lib/supabase';

interface SLAListProps {
  reports: Report[];
}

function daysSince(dateStr: string): number {
  const now = new Date();
  const created = new Date(dateStr);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function getSLAStatus(report: Report): {
  label: string;
  icon: React.ReactNode;
  badge: string;
  dot: string;
} {
  if (report.status === 'Repaired') {
    return {
      label: 'Resolved',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: 'bg-green-500/10 text-green-400 border-green-500/20',
      dot: 'bg-green-500',
    };
  }
  if (report.status === 'In Progress') {
    return {
      label: 'Under Review',
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      dot: 'bg-blue-500',
    };
  }
  const days = daysSince(report.created_at);
  if (days > 7) {
    return {
      label: 'Rapor Merah / Ignored by Dinas',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: 'bg-red-500/10 text-red-400 border-red-500/20',
      dot: 'bg-red-500',
    };
  }
  return {
    label: 'Pending Validation',
    icon: <Clock className="w-4 h-4" />,
    badge: 'bg-[#F57C00]/10 text-[#FFB74D] border-[#F57C00]/20',
    dot: 'bg-[#F57C00]',
  };
}

export default function SLAList({ reports }: SLAListProps) {
  const sorted = [...reports].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="bg-[#0B1929] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <h3 className="text-white font-semibold text-sm">SLA Transparency List</h3>
          <p className="text-gray-500 text-xs mt-0.5">Status transparan laporan kerusakan terbaru</p>
        </div>
        <div className="text-xs text-gray-400">{sorted.length} laporan</div>
      </div>

      <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
        {sorted.map((report) => {
          const sla = getSLAStatus(report);
          const days = daysSince(report.created_at);

          return (
            <div
              key={report.id}
              className="px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${sla.dot} flex-shrink-0`}>
                    {report.status !== 'Repaired' && (
                      <div className={`w-2.5 h-2.5 rounded-full ${sla.dot} animate-ping opacity-75`}></div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {report.infrastructure_type}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {report.damage_type}
                      </p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${sla.badge} flex items-center gap-1 whitespace-nowrap flex-shrink-0`}>
                      {sla.icon}
                      {sla.label}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-1">{report.description}</p>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {report.subdistrict}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {days} hari lalu
                    </span>
                    <span className="text-[10px] text-gray-600 truncate max-w-[180px]">
                      {report.responsible_officer}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
