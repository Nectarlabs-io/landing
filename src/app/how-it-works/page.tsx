import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/how-it-works";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
