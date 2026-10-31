import Link from "next/link";

import { Dot } from "@/components/ui/Badge";
import { routes } from "@/lib/site";

import styles from "./AnnouncementBar.module.css";

export function AnnouncementBar({ showCta = true }: { showCta?: boolean }) {
  return (
    <div className={styles.bar}>
      <span className={styles.item}>
        <Dot pulse />
        Pilot cohort now forming
      </span>
      {showCta && <Link href={routes.contact}>Talk to us →</Link>}
    </div>
  );
}
