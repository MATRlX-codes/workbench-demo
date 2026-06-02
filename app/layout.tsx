import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { DEMO_MODE } from "@/lib/dev/demo-mode";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Workbench — & Again",
  description: "Automated operations — Claude proposes, you approve.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const html = (
    <html lang="en" className={hanken.variable}>
      <body className="antialiased" style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );

  // Demo deploys run without Clerk keys, so skip the provider entirely.
  if (DEMO_MODE) return html;

  return <ClerkProvider>{html}</ClerkProvider>;
}
