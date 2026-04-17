import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { ConvexClientProvider } from "@/lib/providers/ConvexClientProvider";
import { Toaster } from "sonner";
import { CharacterThemeProvider } from "@/lib/providers/CharacterThemeProvider";
import { THEME_CONFIG } from "@/lib/themes";
import { QueryProvider } from "@/lib/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bounty Monster",
  description: "Bounty Monster",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider
              appearance={{
                theme: shadesOfPurple,
              }}
            >
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  (function() {
                    try {
                      var savedTheme = localStorage.getItem("user-theme-color");
                      if (savedTheme) {
                        var themes = ${JSON.stringify(THEME_CONFIG)};
                        var theme = themes[savedTheme];
                        if (theme) {
                          document.documentElement.style.setProperty("--dynamic-primary", theme.primary);
                          document.documentElement.style.setProperty("--dynamic-secondary", theme.secondary);
                        }
                      }
                    } catch (e) {}
                  })()
                `,
                }}
              />
              <ConvexClientProvider>
                <CharacterThemeProvider>
                  <main>{children}</main>
                </CharacterThemeProvider>
              </ConvexClientProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "rgba(5, 5, 5, 0.85)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "500",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
                    fontFamily: "var(--font-geist-sans)",
                    padding: "12px 16px",
                  },
                  className: "bounty-toast",
                }}
              />
            </ClerkProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
