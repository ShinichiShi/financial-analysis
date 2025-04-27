import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinStock",
  description: "Financial Stock Market App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}
