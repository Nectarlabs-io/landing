"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import form from "@/components/ui/form.module.css";
import { CheckCircleIcon } from "@/components/ui/Icons";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { cx } from "@/lib/cx";
import {
  CAPACITY_OPTIONS,
  EMPTY_PILOT_REQUEST,
  HONEYPOT_FIELD,
  PILOT_ROLES,
  describeMissing,
  isValidEmail,
  maxLengthFor,
  missingPilotFields,
  roleLabel,
  type PilotErrorCode,
  type PilotRequest,
  type PilotTextField,
} from "@/lib/pilot";
import { routes, site } from "@/lib/site";

import styles from "./Contact.module.css";

type Status = "editing" | "sending" | "sent";

const emailUs = (
  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
);

/** What to show for each failure the API can report. */
function errorMessage(code: PilotErrorCode | null, serverMessage?: string): ReactNode {
  switch (code) {
    case "invalid":
      return serverMessage ?? "Check the form and send again.";
    case "too_fast":
      return "That was quick. Check your details, then send again.";
    case "rate_limited":
      return <>We&apos;ve had several requests from your network in the last hour. Email us instead at {emailUs}.</>;
    default:
      return <>We couldn&apos;t send that just now. Email us instead at {emailUs}.</>;
  }
}

export function PilotForm() {
  const [values, setValues] = useState<PilotRequest>(EMPTY_PILOT_REQUEST);
  const [status, setStatus] = useState<Status>("editing");
  const [error, setError] = useState<ReactNode>(null);
  const [attempted, setAttempted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const loadedAt = useRef(0);
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    loadedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (status === "sent") successHeading.current?.focus();
  }, [status]);

  const bind = (key: PilotTextField | "capacity") => ({
    value: values[key],
    maxLength: key === "capacity" ? undefined : maxLengthFor(key),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value })),
  });

  const invalid = {
    name: attempted && !values.name.trim(),
    email: attempted && !isValidEmail(values.email),
    organisation: attempted && !values.organisation.trim(),
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const missing = missingPilotFields(values);
    if (missing.length > 0) {
      setError(describeMissing(missing));
      return;
    }

    setStatus("sending");
    setError(null);
    try {
      const response = await fetch("/api/pilot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: honeypot,
          elapsedMs: Math.round(performance.now() - loadedAt.current),
        }),
      });
      if (response.ok) {
        setStatus("sent");
        return;
      }
      const payload = (await response.json().catch(() => null)) as {
        error?: PilotErrorCode;
        message?: string;
      } | null;
      setStatus("editing");
      setError(errorMessage(payload?.error ?? null, payload?.message));
    } catch {
      setStatus("editing");
      setError(errorMessage(null));
    }
  }

  function reset() {
    setValues(EMPTY_PILOT_REQUEST);
    setAttempted(false);
    setError(null);
    setStatus("editing");
  }

  if (status === "sent") {
    const firstName = values.name.trim().split(/\s+/)[0] || "there";
    return (
      <div role="status" className={styles.success}>
        <CheckCircleIcon />
        <h2 ref={successHeading} tabIndex={-1} className={cx(styles.successTitle, "rise")}>
          Thanks, {firstName}. We&apos;ve got it.
        </h2>
        <p className={cx(styles.successText, "rise")} style={{ animationDelay: "0.1s" }}>
          We&apos;ll reply to {values.email.trim()} to set up a short call. For curators and
          protocols, the next step is a depth study of the markets you named.
        </p>
        <dl className={cx(styles.summary, "rise")} style={{ animationDelay: "0.2s" }}>
          <dt>Role</dt>
          <dd>{roleLabel(values.role)}</dd>
          <dt>Chains</dt>
          <dd>{values.chains.trim() || "Not specified"}</dd>
        </dl>
        <div className={styles.successActions}>
          <ButtonLink href={routes.home} variant="secondary">
            Back to home
          </ButtonLink>
          <button type="button" className={styles.textButton} onClick={reset}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form aria-labelledby="form-h" className={styles.form} noValidate onSubmit={handleSubmit}>
      <h2 id="form-h" className={styles.formTitle}>
        Tell us about you
      </h2>

      <fieldset className={styles.roles}>
        <legend className={styles.rolesLegend}>
          I&apos;m a… <span className={styles.dim}>(pick one)</span>
        </legend>
        <div className={styles.roleOptions}>
          {PILOT_ROLES.map((role) => (
            <ToggleButton
              key={role.id}
              pressed={values.role === role.id}
              onClick={() => {
                setValues((current) => ({ ...current, role: role.id }));
                setError(null);
              }}
            >
              {role.label}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <div className={cx(form.field, styles.narrowField)}>
        <label htmlFor="c-chains" className={form.label}>
          Chains you&apos;re on <span>(optional)</span>
        </label>
        <input id="c-chains" className={form.control} type="text" {...bind("chains")} />
      </div>

      <div className={styles.grid}>
        <div className={form.field}>
          <label htmlFor="c-name" className={form.label}>
            Name
          </label>
          <input
            id="c-name"
            className={form.control}
            type="text"
            autoComplete="name"
            required
            aria-invalid={invalid.name || undefined}
            {...bind("name")}
          />
        </div>
        <div className={form.field}>
          <label htmlFor="c-email" className={form.label}>
            Work email
          </label>
          <input
            id="c-email"
            className={form.control}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={invalid.email || undefined}
            {...bind("email")}
          />
        </div>
        <div className={form.field}>
          <label htmlFor="c-org" className={form.label}>
            Organisation
          </label>
          <input
            id="c-org"
            className={form.control}
            type="text"
            autoComplete="organization"
            required
            aria-invalid={invalid.organisation || undefined}
            {...bind("organisation")}
          />
        </div>
        <div className={form.field}>
          <label htmlFor="c-handle" className={form.label}>
            Telegram or X <span>(optional)</span>
          </label>
          <input
            id="c-handle"
            className={form.control}
            type="text"
            placeholder="@"
            {...bind("handle")}
          />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={form.field}>
          <label htmlFor="c-markets" className={form.label}>
            Markets or collateral <span>(optional)</span>
          </label>
          <input
            id="c-markets"
            className={form.control}
            type="text"
            placeholder="e.g. cirBTC on Morpho"
            {...bind("markets")}
          />
        </div>
        <div className={form.field}>
          <label htmlFor="c-size" className={form.label}>
            Capacity you&apos;d want covered <span>(optional)</span>
          </label>
          <select id="c-size" className={form.control} {...bind("capacity")}>
            {CAPACITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={form.field}>
        <label htmlFor="c-msg" className={form.label}>
          Anything else <span>(optional)</span>
        </label>
        <textarea
          id="c-msg"
          className={form.control}
          placeholder="What you're trying to solve, timelines, questions"
          {...bind("message")}
        />
      </div>

      {/* Hidden from people; the server drops submissions that fill it in. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="c-website">Leave this field empty</label>
        <input
          id="c-website"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.formFooter}>
        <span className={styles.privacy}>
          We use this only to reply about the pilot. No newsletter.
        </span>
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
