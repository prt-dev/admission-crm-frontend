import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admission CRM - NLETA",
    template: "%s | Admission CRM",
  },
  description: "National Lift Escalator Testing Agency - Admission CRM & Student Lifecycle Management Platform",
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/logo/logo-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/favicon.ico",
    apple: "/images/logo/nleta-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo/nleta-logo.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
