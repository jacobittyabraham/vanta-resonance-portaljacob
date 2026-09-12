import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VANTA — The Signal Between People",
  description:
    "An immersive superhero help portal. When the world is loud, Vanta listens.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}