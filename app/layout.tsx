import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/config/appConfig";

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.defaultTitle,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  icons: {
    icon: [
      { url: `${APP_CONFIG.favicon}?v=nleta_v3`, type: "image/png" },
    ],
    shortcut: `${APP_CONFIG.favicon}?v=nleta_v3`,
    apple: `${APP_CONFIG.logo}?v=nleta_v3`,
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
        <link rel="icon" type="image/png" href={`${APP_CONFIG.favicon}?v=nleta_v3`} />
        <link rel="shortcut icon" type="image/png" href={`${APP_CONFIG.favicon}?v=nleta_v3`} />
        <link rel="apple-touch-icon" href={`${APP_CONFIG.logo}?v=nleta_v3`} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
