import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/learn/funded-quote-settlement";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
