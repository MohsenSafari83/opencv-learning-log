import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import SearchPalette from "@/components/SearchPalette";
import "./globals.css";
import "./interactions.css";

export const metadata: Metadata = {
  title: "OpenCV Learning Log",
  description: "مسیر یادگیری من از مبانی OpenCV تا سیستم‌های واقعی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Runs synchronously before <body> paints, on every full page
            load (this site is a static export — every route is its own
            HTML file, so this has to happen per-page, not just once on
            first load). Sets the "dark" class immediately from
            localStorage/prefers-color-scheme so there's no flash from
            light to dark after React hydrates. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <SearchPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
