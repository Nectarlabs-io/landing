import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/research/cirbtc-collateral-vs-dex-depth";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
