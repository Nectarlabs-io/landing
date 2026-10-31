import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/faq";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
