"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({
  network: Network.MAINNET,
  fullnode: "https://mainnet.movementnetwork.xyz/v1",
});

export default function PeoplesChoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={aptosConfig}
      onError={(error) => {
        console.error("Wallet error:", JSON.stringify(error, null, 2));
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
