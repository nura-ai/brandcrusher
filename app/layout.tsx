import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Brand Crusher - Web3 Game",
  description: "Crush brand logos and earn points!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

