import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import HealthHero from '@/components/HealthHero';
import SLAList from '@/components/SLAList';
import MapView from '@/components/MapView';
import ReportFormModal from '@/components/ReportFormModal';
import { supabase, type Report } from '@/lib/supabase';

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch reports:', error);
    } else if (data) {
      setReports(data as Report[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSubmitted = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    setToast({
      title: 'Laporan Berhasil Dikirim',
      message: 'Notifikasi WhatsApp telah diteruskan ke dinas pengawas terkait.',
    });
    setTimeout(() => setToast(null), 5000);
  };

  // Calculate stats
  const totalReports = reports.length;
  const pending = reports.filter((r) => r.status === 'Pending Validation').length;
  const inProgress = reports.filter((r) => r.status === 'In Progress').length;
  const repaired = reports.filter((r) => r.status === 'Repaired').length;
  const healthIndex = totalReports > 0
    ? Math.round((repaired / totalReports) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-[#08111F] text-white">
      <Header />

      {/* Report CTA Banner */}
      <div className="bg-gradient-to-r from-[#F57C00] to-[#E65100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 text-white">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Lihat kerusakan jalan atau jembatan? Laporkan sekarang!
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#E65100] font-semibold text-sm hover:bg-gray-50 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Laporkan Kerusakan Jalan/Jembatan
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Health Hero + Stats */}
            <HealthHero
              healthIndex={healthIndex}
              totalReports={totalReports}
              pending={pending}
              inProgress={inProgress}
              repaired={repaired}
            />

            {/* Map + SLA List */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <MapView reports={reports} />
              </div>
              <div className="lg:col-span-2">
                <SLAList reports={reports} />
              </div>
            </div>

            {/* Footer */}
            <footer className="pt-6 pb-4 border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                <p>Sipil-Report Banyuasin — Smart City Infrastructure Monitoring System</p>
                <p>Simulasi terhubung dengan Dinas PU Kab. Banyuasin &amp; WhatsApp Gateway</p>
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Report Form Modal */}
      <ReportFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={handleSubmitted}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-[#13243B] border border-green-500/30 rounded-xl shadow-2xl p-4 max-w-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{toast.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
