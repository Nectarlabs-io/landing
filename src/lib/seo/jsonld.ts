import type {
  Article,
  BreadcrumbList,
  CollectionPage,
  ContactPage,
  DefinedTermSet,
  FAQPage,
  Graph,
  IdReference,
  Organization,
  Person,
  Thing,
  WebPage,
  WebSite,
} from "schema-dts";

import { allPages, getPage, isVisible, visiblePage } from "@/lib/content/load";
import type { ContentPage } from "@/lib/content/types";
import { site } from "@/lib/site";

import { fullTitle } from "./metadata";
import { absoluteUrl, ogImagePath } from "./urls";

/*
 * JSON-LD for every page, as one @graph. Entities are linked by @id:
 * #organization and #website are defined on the home page and referenced
 * everywhere else. Every value mirrors text that is visible on the page.
 */

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const FOUNDER_ID = `${site.url}/#founder`;

const ref = (id: string): IdReference => ({ "@id": id });
// Root IDs keep the slash ("https://nectarnetwork.fun/#webpage"), like #organization.
const idBase = (pathname: string) => (pathname === "/" ? `${site.url}/` : absoluteUrl(pathname));
const pageId = (pathname: string) => `${idBase(pathname)}#webpage`;

/** Profiles that describe the organization. */
export const SAME_AS = [site.xUrl, site.githubOrgUrl, site.docsUrl];

function founder(): Person {
  const about = visiblePage("/about");
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: site.founderName,
    ...(about ? { url: absoluteUrl(about.path) } : {}),
  };
}

function organizationRef(): Organization {
  return { "@type": "Organization", "@id": ORG_ID, name: site.name, url: absoluteUrl("/") };
}

export function organization(): Organization {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: absoluteUrl(site.logoPath),
      contentUrl: absoluteUrl(site.logoPath),
      width: "512",
      height: "512",
      caption: site.name,
    },
    email: site.contactEmail,
    description: site.definition,
    sameAs: SAME_AS,
    founder: founder(),
  };
}

export function website(): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    alternateName: [site.alternateName],
    url: absoluteUrl("/"),
    inLanguage: "en",
    publisher: ref(ORG_ID),
  };
}

/** Crumbs for a path: Home › section hub › page. Names match the visible trail. */
export function breadcrumbTrail(pathname: string): Array<{ name: string; path: string }> {
  if (pathname === "/") return [];
  const crumbs = [{ name: "Home", path: "/" }];
  const segments = pathname.split("/").filter(Boolean);
  for (let i = 1; i < segments.length; i++) {
    const hubPath = `/${segments.slice(0, i).join("/")}`;
    const hub = getPage(hubPath);
    crumbs.push({ name: crumbName(hub), path: hubPath });
  }
  crumbs.push({ name: crumbName(getPage(pathname)), path: pathname });
  return crumbs;
}

export function crumbName(page: ContentPage): string {
  return page.crumb ?? page.title;
}

function breadcrumbList(pathname: string): BreadcrumbList {
  const trail = breadcrumbTrail(pathname);
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(pathname)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      // The last crumb is the current page; Google uses the page URL for it.
      ...(index < trail.length - 1 ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

function webPageBase(page: ContentPage) {
  return {
    "@id": pageId(page.path),
    url: absoluteUrl(page.path),
    name: fullTitle(page.path),
    description: page.description,
    inLanguage: "en",
    isPartOf: ref(WEBSITE_ID),
    ...(page.path === "/" ? {} : { breadcrumb: ref(`${absoluteUrl(page.path)}#breadcrumb`) }),
  };
}

function article(page: ContentPage): Article {
  const author = founder();
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(page.path)}#article`,
    headline: page.title,
    description: page.description,
    url: absoluteUrl(page.path),
    image: absoluteUrl(ogImagePath(page.path)),
    ...(page.published ? { datePublished: page.published } : {}),
    dateModified: page.updated,
    author,
    publisher: organizationRef(),
    mainEntityOfPage: ref(pageId(page.path)),
    isPartOf: ref(WEBSITE_ID),
    inLanguage: "en",
  };
}

function faqPage(page: ContentPage): FAQPage {
  return {
    "@type": "FAQPage",
    ...webPageBase(page),
    mainEntity: page.sections.map((section) => ({
      "@type": "Question",
      name: section.heading,
      acceptedAnswer: { "@type": "Answer", text: section.text },
    })),
  };
}

function definedTermSet(page: ContentPage): DefinedTermSet {
  const setId = `${absoluteUrl(page.path)}#terms`;
  return {
    "@type": "DefinedTermSet",
    "@id": setId,
    name: page.title,
    description: page.description,
    url: absoluteUrl(page.path),
    hasDefinedTerm: page.sections.map((section) => ({
      "@type": "DefinedTerm",
      "@id": `${absoluteUrl(page.path)}#${section.id}`,
      name: section.heading,
      description: section.text,
      url: `${absoluteUrl(page.path)}#${section.id}`,
      inDefinedTermSet: ref(setId),
    })),
  };
}

function collectionPage(page: ContentPage): CollectionPage {
  const prefix = `${page.path}/`;
  const children = allPages().filter((p) => p.path.startsWith(prefix) && isVisible(p));
  return {
    "@type": "CollectionPage",
    ...webPageBase(page),
    hasPart: children.map((child) => ({
      "@type": child.type === "glossary" ? "WebPage" : "Article",
      "@id":
        child.type === "glossary"
          ? pageId(child.path)
          : `${absoluteUrl(child.path)}#article`,
      url: absoluteUrl(child.path),
      name: child.title,
    })),
  };
}

/** Everything a page's JSON-LD graph contains. */
export function graphFor(pathname: string): Graph {
  const page = getPage(pathname);
  const nodes: Thing[] = [];

  switch (page.type) {
    case "home":
      nodes.push(organization(), website(), {
        "@type": "WebPage",
        ...webPageBase(page),
        about: ref(ORG_ID),
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(ogImagePath("/")) },
      } satisfies WebPage);
      break;
    case "contact":
      nodes.push({ "@type": "ContactPage", ...webPageBase(page), about: ref(ORG_ID) } satisfies ContactPage);
      break;
    case "about":
      nodes.push({ "@type": "AboutPage", ...webPageBase(page), about: ref(ORG_ID) });
      break;
    case "faq":
      nodes.push(faqPage(page));
      break;
    case "glossary":
      nodes.push({ "@type": "WebPage", ...webPageBase(page), mainEntity: ref(`${absoluteUrl(page.path)}#terms`) });
      nodes.push(definedTermSet(page));
      break;
    case "collection":
      nodes.push(collectionPage(page));
      break;
    case "article":
      nodes.push({ "@type": "WebPage", ...webPageBase(page) });
      nodes.push(article(page));
      break;
    case "webpage":
      nodes.push({ "@type": "WebPage", ...webPageBase(page) });
      break;
  }

  if (pathname !== "/") nodes.push(breadcrumbList(pathname));
  return { "@context": "https://schema.org", "@graph": nodes };
}
