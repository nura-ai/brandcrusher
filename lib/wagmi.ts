import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Brand Crusher",
  projectId: "3a99e6a4c1728900bb1f525e8b7dbc2a",
  chains: [arbitrumSepolia],
  ssr: true,
});

