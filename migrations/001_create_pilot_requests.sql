-- Pilot-cohort requests from the "Talk to us" form.
-- Length and role limits mirror src/lib/pilot.ts; the API enforces them first.

CREATE TABLE pilot_requests (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at   timestamptz NOT NULL DEFAULT now(),
  role         text NOT NULL
               CHECK (role IN ('curator', 'protocol', 'buyer', 'issuer', 'app', 'keeper', 'other')),
  chains       text CHECK (char_length(chains) <= 200),
  name         text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email        text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200),
  organisation text NOT NULL CHECK (char_length(organisation) BETWEEN 1 AND 200),
  handle       text CHECK (char_length(handle) <= 200),
  markets      text CHECK (char_length(markets) <= 200),
  capacity     text CHECK (capacity IN ('lt1', '1-10', '10-50', 'gt50')),
  message      text CHECK (char_length(message) <= 4000),
  user_agent   text CHECK (char_length(user_agent) <= 500),
  -- sha256(client IP + IP_HASH_SALT), hex. The raw IP is never stored.
  ip_hash      text CHECK (ip_hash ~ '^[0-9a-f]{64}$'),
  status       text NOT NULL DEFAULT 'new'
);

-- Rate limiting counts recent rows per ip_hash.
CREATE INDEX pilot_requests_ip_hash_created_at_idx ON pilot_requests (ip_hash, created_at);
