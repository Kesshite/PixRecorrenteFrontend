import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixRecorrente - Cobrança Recorrente via Pix para Negócios com Mensalistas",
  description:
    "Plataforma de cobrança recorrente via Pix com WhatsApp integrado. Reduza a inadimplência do seu negócio automatizando cobranças. Para academias, estúdios, escolas, coworkings e mais.",
  keywords: [
    "pix recorrente",
    "cobranca recorrente",
    "pix mensalidade",
    "inadimplencia",
    "cobranca automatica",
    "pix whatsapp",
    "mensalidade recorrente",
    "coworking cobranca",
    "escola cobranca",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
