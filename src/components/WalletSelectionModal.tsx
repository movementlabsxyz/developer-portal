"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@movementlabsxyz/movement-design-system";

interface WalletSelectionModalProps {
  children: React.ReactNode;
}

export function WalletSelectionModal({ children }: WalletSelectionModalProps) {
  const [open, setOpen] = useState(false);
  const { wallets, connect } = useWallet();

  const filteredWallets = wallets
    .filter((wallet) => {
      const name = wallet.name.toLowerCase();
      return (
        !name.includes("petra") &&
        !name.includes("google") &&
        !name.includes("apple")
      );
    })
    .filter((wallet, index, self) => {
      return index === self.findIndex((w) => w.name === wallet.name);
    })
    .sort((a, b) => {
      if (a.name.toLowerCase().includes("nightly")) return -1;
      if (b.name.toLowerCase().includes("nightly")) return 1;
      return 0;
    });

  const handleWalletSelect = async (walletName: string) => {
    try {
      await connect(walletName);
      setOpen(false);
    } catch {
      // wallet adapter handles error display
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to Movement Network. Make sure your
            wallet is set to Movement Mainnet before connecting.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {filteredWallets.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No compatible wallets detected. Please install a supported wallet.
            </p>
          ) : (
            filteredWallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full justify-start h-12"
                onClick={() => handleWalletSelect(wallet.name)}
              >
                <div className="flex items-center space-x-3">
                  {wallet.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="w-6 h-6"
                    />
                  )}
                  <span>{wallet.name}</span>
                </div>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
