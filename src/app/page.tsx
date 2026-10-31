import type { Metadata } from "next";

import { Collateral } from "@/components/home/Collateral";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pilot } from "@/components/home/Pilot";
import { Problem } from "@/components/home/Problem";
import { Products } from "@/components/home/Products";
import { Protocols } from "@/components/home/Protocols";
import { Security } from "@/components/home/Security";
import { WhoItsFor } from "@/components/home/WhoItsFor";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: { absolute: "Nectar — The buyer behind every loan" },
};

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Pilot />
        <HowItWorks />
        <WhoItsFor />
        <Protocols />
        <Products />
        <Collateral />
        <Security />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
