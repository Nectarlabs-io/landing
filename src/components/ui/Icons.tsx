import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SunIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Circled check with an animated stroke, for success states. */
export function CheckCircleIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" width="56" height="56" viewBox="0 0 56 56" fill="none" {...props}>
      <circle cx="28" cy="28" r="26" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5" />
      <path
        className="draw"
        d="M17 29 25 37 40 20"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
