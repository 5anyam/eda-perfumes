"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Hides header/footer chrome on the home page ("/") while the online
// store is paused, so the coming-soon message shows on its own.
export default function SiteChrome({
  top,
  bottom,
  children,
}: {
  top: ReactNode;
  bottom: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = pathname === "/";

  if (hideChrome) {
    return <main role="main">{children}</main>;
  }

  return (
    <>
      {top}
      <main role="main">{children}</main>
      {bottom}
    </>
  );
}
