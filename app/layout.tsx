import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "./clientLayout";
import { AuthProvider } from "@/hooks/useAuth";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CMS For GWT - Content Management System",
    template: "%s | CMS For GWT"
  },
  description: "Comprehensive Content Management System for GWT Projects. Manage posts, media, users, vendors, clients, portfolio, and more with ease.",
  keywords: [
    "CMS",
    "Content Management System", 
    "GWT",
    "Blog Management",
    "Media Management",
    "User Management",
    "Portfolio Management",
    "Vendor Management",
    "Client Management"
  ],
  authors: [{ name: "GWT Team" }],
  creator: "GWT",
  publisher: "GWT",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CMS For GWT - Content Management System",
    description: "Comprehensive Content Management System for GWT Projects. Manage your content efficiently with our powerful CMS platform.",
    siteName: "CMS For GWT",
    images: [
      {
        url: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748769180/gwt-projects/LOGO_GWT_7_t99m9w.png",
        width: 1200,
        height: 630,
        alt: "CMS For GWT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CMS For GWT - Content Management System",
    description: "Comprehensive Content Management System for GWT Projects. Manage your content efficiently with our powerful CMS platform.",
    images: ["https://res.cloudinary.com/du0tz73ma/image/upload/v1748769180/gwt-projects/LOGO_GWT_7_t99m9w.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512", 
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code", // Ganti dengan kode verifikasi Google Anda
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{fontFamily: "Roboto"}} className={`${roboto.variable} antialiased`}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}