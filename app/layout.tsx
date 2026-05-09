import type { Metadata } from "next";
import { Poppins, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimalProvider } from "./context/AnimalContext";
import StoreProvider from "./redux/storeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ONG Animal",
  description: "Projeto de ONG Animal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="pt-BR">
      <body>
        <StoreProvider>

          <AnimalProvider>
      {children}
      </AnimalProvider>

      </StoreProvider>
      </body>
    </html>
  );
}
