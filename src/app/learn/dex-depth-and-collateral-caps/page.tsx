import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/learn/dex-depth-and-collateral-caps";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
