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
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <SearchPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
