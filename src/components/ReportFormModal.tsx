import { useState, useEffect } from 'react';
import { X, MapPin, Camera, Loader2, CheckCircle2, Navigation, AlertTriangle, Send, Phone, Shield } from 'lucide-react';
import { INFRASTRUCTURE_TYPES, DAMAGE_TYPES, reverseGeocode, lookupOfficer, simulateGPS } from '@/lib/constants';
import { supabase, type Report } from '@/lib/supabase';

interface ReportFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: (report: Report) => void;
}

type Step = 'form' | 'processing' | 'success';

export default function ReportFormModal({ open, onClose, onSubmitted }: ReportFormModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [infrastructureType, setInfrastructureType] = useState<string>('');
  const [damageType, setDamageType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    subdistrict: string;
    officer: string;
    phone: string;
  } | null>(null);

  if (!open) return null;

  const resetForm = () => {
    setStep('form');
    setInfrastructureType('');
    setDamageType('');
    setDescription('');
    setImageFileName(null);
    setGps(null);
    setError(null);
    setResult(null);
  };

  const handleClose = () => {
    if (step === 'processing') return;
    resetForm();
    onClose();
  };

  const handleGetGPS = () => {
    setLocating(true);
    setTimeout(() => {
      const coords = simulateGPS();
      setGps(coords);
      setLocating(false);
    }, 1200);
  };

  const handleSubmit = async () => {
    if (!infrastructureType || !damageType || !description || !gps) {
      setError('Mohon lengkapi semua kolom dan ambil koordinat GPS.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const subdistrict = reverseGeocode(gps.lat, gps.lng);
    const officerInfo = lookupOfficer(subdistrict);

    setStep('processing');

    try {
      const { data, error: insertError } = await supabase
        .from('reports')
        .insert({
          infrastructure_type: infrastructureType,
          damage_type: damageType,
          description,
          latitude: gps.lat,
          longitude: gps.lng,
          subdistrict,
          responsible_officer: officerInfo.officer,
          officer_phone_masked: officerInfo.phone,
          status: 'Pending Validation',
          image_url: imageFileName,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setResult({ subdistrict, officer: officerInfo.officer, phone: officerInfo.phone });

      setTimeout(() => {
        setStep('success');
        setSubmitting(false);
        if (data) onSubmitted(data as Report);
      }, 2500);
    } catch (err) {
      setStep('form');
      setSubmitting(false);
      setError('Gagal mengirim laporan. Silakan coba lagi.');
    }
  };

  const handleDone = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#0E1D33] border border-white/10 rounded-2xl shadow-2xl animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0E1D33]/95 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F57C00] to-[#FF9800] flex items-center justify-center">
              <AlertTriangle className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Laporkan Kerusakan</h2>
              <p className="text-gray-500 text-[10px]">Jalan / Jembatan Banyuasin</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={step === 'processing'}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <div className="p-5 space-y-5">
            {/* Infrastructure Type */}
            <div>
              <label className="text-gray-300 text-xs font-medium mb-2 block">Jenis Infrastruktur</label>
              <div className="grid grid-cols-2 gap-2">
                {INFRASTRUCTURE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setInfrastructureType(type)}
                    className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${
                      infrastructureType === type
                        ? 'bg-[#F57C00]/15 border-[#F57C00]/50 text-[#FFB74D]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Damage Type */}
            <div>
              <label className="text-gray-300 text-xs font-medium mb-2 block">Jenis Kerusakan (Teknis)</label>
              <div className="space-y-2">
                {DAMAGE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setDamageType(type)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      damageType === type
                        ? 'bg-[#F57C00]/15 border-[#F57C00]/50 text-[#FFB74D]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span>{type}</span>
                    {damageType === type && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-gray-300 text-xs font-medium mb-2 block">Foto Kerusakan</label>
              <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-white/10 hover:border-[#F57C00]/30 transition-colors cursor-pointer bg-white/[0.02]">
                <Camera className="w-7 h-7 text-gray-500" />
                <span className="text-xs text-gray-400">
                  {imageFileName ? imageFileName : 'Klik untuk upload foto'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFileName(file.name);
                  }}
                />
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="text-gray-300 text-xs font-medium mb-2 block">Deskripsi Singkat</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Jelaskan kondisi kerusakan yang Anda lihat..."
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#F57C00]/50 transition-colors resize-none"
              />
            </div>

            {/* GPS Location */}
            <div>
              <label className="text-gray-300 text-xs font-medium mb-2 block">Lokasi GPS</label>
              <button
                onClick={handleGetGPS}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/15 transition-colors disabled:opacity-50"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mendapatkan lokasi...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Gunakan Lokasi GPS Saya
                  </>
                )}
              </button>
              {gps && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs text-green-300">
                    Latitude: {gps.lat}, Longitude: {gps.lng}
                  </span>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#F57C00] to-[#FF9800] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim Laporan...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Laporan
                </>
              )}
            </button>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="p-8 flex flex-col items-center text-center min-h-[320px] justify-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-[#F57C00] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#F57C00] animate-spin" />
              </div>
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">Memproses Laporan...</h3>
            <div className="space-y-2 mt-4 text-left w-full max-w-xs">
              <ProcessingStep text="Reverse-geocoding koordinat GPS" delay={0} />
              <ProcessingStep text="Mencocokkan kecamatan & dinas pengawas" delay={600} />
              <ProcessingStep text="Mengirim notifikasi WhatsApp Gateway" delay={1400} />
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && result && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-3 animate-[scaleIn_0.4s_ease-out]">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-base">Laporan Terkirim!</h3>
              <p className="text-gray-400 text-xs mt-1 max-w-xs">
                Laporan Anda telah diterima dan diteruskan ke dinas terkait.
              </p>
            </div>

            {/* WhatsApp Alert Card */}
            <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
                <Phone className="w-4 h-4" />
                WhatsApp Alert Terkirim
              </div>
              <div className="space-y-2 text-xs">
                <InfoRow label="Kecamatan" value={result.subdistrict} icon={<MapPin className="w-3.5 h-3.5" />} />
                <InfoRow label="Dinas Pengawas" value={result.officer} icon={<Shield className="w-3.5 h-3.5" />} />
                <InfoRow label="No. WhatsApp" value={result.phone} icon={<Phone className="w-3.5 h-3.5" />} />
              </div>
              <div className="bg-green-500/10 rounded-lg px-3 py-2 text-[10px] text-green-300/80 italic">
                Notifikasi real-time telah dikirim secara aman melalui WhatsApp Gateway ke nomor pejabat terkait (nomor dimasking untuk privasi).
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Selesai
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scaleIn { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}

function ProcessingStep({ text, delay }: { text: string; delay: number }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-green-500/20' : 'bg-white/5'}`}>
        {active ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
        )}
      </div>
      <span className={`text-xs transition-colors ${active ? 'text-gray-200' : 'text-gray-500'}`}>{text}</span>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-500 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-gray-500">{label}: </span>
        <span className="text-gray-200 font-medium break-words">{value}</span>
      </div>
    </div>
  );
}
