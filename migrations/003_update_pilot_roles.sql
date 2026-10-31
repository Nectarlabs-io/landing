-- Pilot form roles after the Oct 31 repositioning (src/lib/pilot.ts).
-- New: 'lender' (Lender or curator). 'curator' is no longer offered by the
-- form but stays allowed, so rows stored earlier remain valid unchanged.

ALTER TABLE pilot_requests DROP CONSTRAINT pilot_requests_role_check;

ALTER TABLE pilot_requests
  ADD CONSTRAINT pilot_requests_role_check
  CHECK (role IN ('app', 'lender', 'buyer', 'protocol', 'issuer', 'keeper', 'other', 'curator'));
