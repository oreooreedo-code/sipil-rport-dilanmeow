export const INFRASTRUCTURE_TYPES = [
  'Jalan Aspal',
  'Jalan Beton',
  'Jembatan Kayu Antar-Desa',
  'Dermaga Tambatan Perahu',
] as const;

export const DAMAGE_TYPES = [
  'Retak Buaya / Alligator Cracking',
  'Amblas / Depression',
  'Lubang / Potholes',
] as const;

// Simulated reverse-geocoding: maps approximate lat/lng ranges to Banyuasin subdistricts
const SUBDISTRICT_ZONES: { name: string; latMin: number; latMax: number; lngMin: number; lngMax: number }[] = [
  { name: 'Kecamatan Muara Telang', latMin: -2.82, latMax: -2.68, lngMin: 104.40, lngMax: 104.58 },
  { name: 'Kecamatan Tanjung Lago', latMin: -2.72, latMax: -2.66, lngMin: 104.48, lngMax: 104.56 },
  { name: 'Kecamatan Banyuasin I', latMin: -2.76, latMax: -2.70, lngMin: 104.55, lngMax: 104.65 },
  { name: 'Kecamatan Banyuasin III', latMin: -2.72, latMax: -2.68, lngMin: 104.56, lngMax: 104.62 },
  { name: 'Kecamatan Talang Kelapa', latMin: -2.70, latMax: -2.64, lngMin: 104.48, lngMax: 104.55 },
  { name: 'Kecamatan Rambutan', latMin: -2.66, latMax: -2.60, lngMin: 104.50, lngMax: 104.60 },
  { name: 'Kecamatan Banyuasin II', latMin: -2.64, latMax: -2.58, lngMin: 104.55, lngMax: 104.70 },
];

// Maps subdistrict + infrastructure type to responsible pengawas
const OFFICER_MAP: Record<string, { officer: string; phone: string }> = {
  'Kecamatan Muara Telang': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah II',
    phone: '+62 8xx-xxxx-4521',
  },
  'Kecamatan Tanjung Lago': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah I',
    phone: '+62 8xx-xxxx-8832',
  },
  'Kecamatan Banyuasin I': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah III',
    phone: '+62 8xx-xxxx-1094',
  },
  'Kecamatan Banyuasin III': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah III',
    phone: '+62 8xx-xxxx-1094',
  },
  'Kecamatan Talang Kelapa': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah I',
    phone: '+62 8xx-xxxx-8832',
  },
  'Kecamatan Rambutan': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah II',
    phone: '+62 8xx-xxxx-4521',
  },
  'Kecamatan Banyuasin II': {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah IV',
    phone: '+62 8xx-xxxx-7765',
  },
};

export function reverseGeocode(lat: number, lng: number): string {
  for (const zone of SUBDISTRICT_ZONES) {
    if (lat >= zone.latMin && lat <= zone.latMax && lng >= zone.lngMin && lng <= zone.lngMax) {
      return zone.name;
    }
  }
  return 'Kecamatan Muara Telang';
}

export function lookupOfficer(subdistrict: string): { officer: string; phone: string } {
  return OFFICER_MAP[subdistrict] ?? {
    officer: 'Dinas PU Banyuasin - Pengawas Wilayah I',
    phone: '+62 8xx-xxxx-8832',
  };
}

// Simulated GPS coordinates for "Gunakan Lokasi GPS Saya" button
export function simulateGPS(): { lat: number; lng: number } {
  const lat = -2.6600 + Math.random() * 0.15;
  const lng = 104.5000 + Math.random() * 0.12;
  return { lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) };
}
