import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/media-kit";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
