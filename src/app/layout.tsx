import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/contexts/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AXIOM Robotics Club — Engineer the Future",
  description: "The official portal of Axiom Robotics Club. Where hardware meets high-fidelity AI and engineering excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <div className="scanlines" />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
