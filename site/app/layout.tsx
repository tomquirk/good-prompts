import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FEED_TYPES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "prompt-collectooor: auto-collecting good dev prompts from X.com",
  type: "image/png",
};

const homeTitle = "Good one-shot prompts for Claude Code and Codex, from X.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${homeTitle} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    title: homeTitle,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: SITE_DESCRIPTION, images: [OG_IMAGE] },
  alternates: { types: FEED_TYPES },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`} data-theme="dark">
      <body className="min-h-dvh">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
