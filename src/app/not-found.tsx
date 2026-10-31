import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/content/Content.module.css";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Nectar Network" },
};

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.page}>
          <header className={styles.header}>
            <h1 className={styles.title}>Page not found</h1>
          </header>
          <div className={styles.prose}>
            <p>
              This page doesn&apos;t exist. The <Link href={routes.home}>home page</Link> explains
              what Nectar Network is and how it works.
            </p>
          </div>
          <div>
            <ButtonLink href={routes.contact} size="md">
              Talk to us
            </ButtonLink>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
