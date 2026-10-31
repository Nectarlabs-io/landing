import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/learn/committed-quotes-notice-periods-and-commitment-fees";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
