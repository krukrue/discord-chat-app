// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/navigation/nav";
import { cn } from "@/lib/utils";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-context";
import { ThemeProvider } from "@/components/theme/theme-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body
          className={cn(
              `${geistSans.variable} ${geistMono.variable} antialiased`,
              "px-6 md:px-12 max-w-7xl mx-auto"
          )}
      >
      <ThemeProvider>
          <AuthProvider>
              <Nav />
              {children}
          </AuthProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}
