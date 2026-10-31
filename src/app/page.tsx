import { BorrowingLimits } from "@/components/home/BorrowingLimits";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { graphFor } from "@/lib/seo/jsonld";
import { metadataFor } from "@/lib/seo/metadata";

export const metadata = metadataFor("/");

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <BorrowingLimits />
        <HowItWorks />
        <Pilot />
        <WhoItsFor />
        <Protocols />
        <Products />
        <Collateral />
        <Security />
        <ClosingCta />
      </main>
      <SiteFooter />
      <JsonLd data={graphFor("/")} />
    </>
  );
}
