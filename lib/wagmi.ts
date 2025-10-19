import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Brand Crusher",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [arbitrumSepolia],
  ssr: true,
});

