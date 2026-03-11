import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UWO HR Policy Assistant",
  description: "Grounded, citation-first answers for approved HR policy sources"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
