import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Brand Crusher - Web3 Mini-Game",
  description: "Crush brand logos and earn real ETH rewards! Play the innovative Web3 mini-game where brands pay for engagement and players win prizes.",
  openGraph: {
    title: "Brand Crusher - Web3 Mini-Game",
    description: "Crush brand logos and earn real ETH rewards! Play the innovative Web3 mini-game where brands pay for engagement and players win prizes.",
    images: [
      {
        url: "/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Brand Crusher Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Crusher - Web3 Mini-Game",
    description: "Crush brand logos and earn real ETH rewards!",
    images: ["/thumbnail.jpg"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/thumbnail.jpg",
    "fc:frame:button:1": "Play Game",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://brandcrusher.vercel.app",
  },
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
