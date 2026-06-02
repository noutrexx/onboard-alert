ALTER TABLE alerts
  ADD COLUMN IF NOT EXISTS source_url TEXT;

COMMENT ON COLUMN alerts.source_url IS 'Original source URL for copyright-safe rendering or redirection.';
COMMENT ON COLUMN alerts.description IS 'Short editorial snippet only. Do not store full article text or copied media.';
