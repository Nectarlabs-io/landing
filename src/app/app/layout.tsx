import { AppHeader, PreviewBar } from "@/components/app/AppHeader";
import styles from "@/components/app/AppChrome.module.css";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className={styles.shell}>
      <PreviewBar />
      <AppHeader />
      {children}
    </div>
  );
}
