ALTER TYPE alert_status ADD VALUE IF NOT EXISTS 'pending_location';

ALTER TABLE alerts
  ALTER COLUMN lat DROP NOT NULL,
  ALTER COLUMN lng DROP NOT NULL;

ALTER TABLE alerts
  DROP CONSTRAINT IF EXISTS alerts_lat_check,
  ADD CONSTRAINT alerts_lat_check CHECK (lat IS NULL OR lat BETWEEN -90 AND 90);

ALTER TABLE alerts
  DROP CONSTRAINT IF EXISTS alerts_lng_check,
  ADD CONSTRAINT alerts_lng_check CHECK (lng IS NULL OR lng BETWEEN -180 AND 180);

CREATE INDEX IF NOT EXISTS idx_alerts_pending_location
  ON alerts (created_at DESC)
  WHERE status = 'pending_location';
