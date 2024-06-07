import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  return { title: 'Sign in' }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://play-lh.googleusercontent.com/8xSX7C0edYgitTGwdbqgoB9jt5lp4nO7VY_jkE3jWUCypcugn5aRHSn9Y8-qQA53GSo" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className={inter.className}>
      <Providers>{children}</Providers>
      </body>
    </html>
  );
}