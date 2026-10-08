/*
# Create infrastructure damage reports schema (single-tenant, no auth)

1. New Tables
- `reports`: Stores citizen-reported road/bridge damage incidents across Banyuasin.
  - `id` (uuid PK)
  - `infrastructure_type` (text): e.g., "Jalan Aspal", "Jalan Beton", "Jembatan Kayu Antar-Desa", "Dermaga Tambatan Perahu"
  - `damage_type` (text): e.g., "Retak Buaya / Alligator Cracking", "Amblas / Depression", "Lubang / Potholes"
  - `description` (text): short description from the citizen
  - `latitude` (double precision): GPS latitude
  - `longitude` (double precision): GPS longitude
  - `subdistrict` (text): auto-resolved kecamatan via reverse geocoding simulation
  - `responsible_officer` (text): auto-resolved pengawas from subdistrict + infrastructure type
  - `officer_phone_masked` (text): masked phone number for WhatsApp alert
  - `status` (text): "Pending Validation", "In Progress", "Repaired"
  - `image_url` (text): optional image URL/placeholder
  - `created_at` (timestamptz): when the report was submitted

2. Security
- Enable RLS on `reports`.
- Allow anon + authenticated CRUD (single-tenant public app, intentionally shared data).
- 4 separate policies for SELECT, INSERT, UPDATE, DELETE.
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  infrastructure_type text NOT NULL,
  damage_type text NOT NULL,
  description text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  subdistrict text NOT NULL,
  responsible_officer text NOT NULL,
  officer_phone_masked text NOT NULL,
  status text NOT NULL DEFAULT 'Pending Validation',
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reports" ON reports;
CREATE POLICY "anon_select_reports" ON reports FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reports" ON reports;
CREATE POLICY "anon_insert_reports" ON reports FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reports" ON reports;
CREATE POLICY "anon_update_reports" ON reports FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reports" ON reports;
CREATE POLICY "anon_delete_reports" ON reports FOR DELETE
TO anon, authenticated USING (true);

-- Index for frequently-queried status
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
