import { ContentRoute, contentMetadata } from "@/components/content/ContentRoute";

const PATH = "/learn/what-is-an-exit-backed-borrowing-limit";

export const metadata = contentMetadata(PATH);

export default function Page() {
  return <ContentRoute path={PATH} />;
}
