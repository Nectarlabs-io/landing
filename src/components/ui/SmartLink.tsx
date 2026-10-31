import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export type SmartLinkProps = ComponentPropsWithoutRef<"a"> & { href: string };

/** Uses next/link for in-app paths and a plain anchor for everything else. */
export function SmartLink({ href, ...rest }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return <Link href={href} {...rest} />;
  }
  return <a href={href} {...rest} />;
}
