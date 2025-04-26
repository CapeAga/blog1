import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import { ToastProvider } from "@/components/providers/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: {
    template: "%s | 个人博客",
    default: "个人博客",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  description: "这是一个分享技术、知识和见解的个人博客网站",
  keywords: ["博客", "技术", "知识分享", "编程", "AI工具"],
  authors: [{ name: "博客作者" }],
  creator: "博客作者",
  publisher: "个人博客",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "个人博客",
    title: "个人博客",
    description: "这是一个分享技术、知识和见解的个人博客网站",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "个人博客",
    description: "这是一个分享技术、知识和见解的个人博客网站",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  verification: {
    google: "google-site-verification-code",
    // 其他验证码根据需要添加
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`min-h-screen flex flex-col bg-background text-foreground font-sans`}>
        <ToastProvider />
        <SiteHeader />
        <main className="flex-grow px-4 py-12 sm:px-6 md:container md:mx-auto md:py-16">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
