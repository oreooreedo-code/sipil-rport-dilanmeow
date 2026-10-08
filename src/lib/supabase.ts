import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ReportStatus = 'Pending Validation' | 'In Progress' | 'Repaired';

export interface Report {
  id: string;
  infrastructure_type: string;
  damage_type: string;
  description: string;
  latitude: number;
  longitude: number;
  subdistrict: string;
  responsible_officer: string;
  officer_phone_masked: string;
  status: ReportStatus;
  image_url: string | null;
  created_at: string;
}
