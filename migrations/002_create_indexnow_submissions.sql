-- What has been submitted to IndexNow, so each deploy pings only URLs whose
-- sitemap lastmod changed since the last accepted submission.

CREATE TABLE indexnow_submissions (
  url           text PRIMARY KEY,
  last_modified timestamptz NOT NULL,
  submitted_at  timestamptz NOT NULL DEFAULT now()
);
