import type { Metadata } from "next";
import { ThemeScript } from "@/components/theme/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Policy Platform",
  description: "Enterprise workspace for policy assistance, governance, and evaluations"
};

export default function RootLayout({
  children
}: Readonly<{
  children: import("react").ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
