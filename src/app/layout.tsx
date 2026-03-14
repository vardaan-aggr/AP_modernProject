import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "University ERP – Modern Academic Portal",
  description:
    "A modern web-based university academic management system for students, instructors, and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
