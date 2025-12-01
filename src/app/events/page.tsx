'use client';

import Link from 'next/link';
import {
  Typography,
  Text,
  Button,
  DottedBackground,
  List,
  ListItem,
} from '@movementlabsxyz/movement-design-system';

export default function EventsPage() {
  return (
    <DottedBackground
      variant="dots"
      dotColor="var(--color-neutrals-white-alpha-300)"
      className="min-h-screen py-32"
    >
      <div className="max-w-3xl mx-auto px-4">
        <Typography variant="h1" className="text-guild-green-400 mb-8 text-center">
          Events & Resources
        </Typography>

        {/* M1 Hackathon Announcement */}
        <div className="mb-8 p-6 rounded-xl border border-guild-green-400 bg-black/50">
          <Typography variant="h3" className="text-guild-green-400 mb-3">
            M1 Hackathon is Live!
          </Typography>
          <Text className="text-muted-foreground mb-4">
            Join the Movement M1 Hackathon hosted by Encode Club. Build on Movement and compete for prizes!
          </Text>
          <Button variant="default" size="lg" asChild>
            <Link
              href="https://www.encodeclub.com/programmes/movement-m1-hackathon"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the Hackathon
            </Link>
          </Button>
        </div>

        {/* Building on Movement Cheatsheet */}
        <div className="p-6 rounded-xl border border-guild-green-400 bg-black/50">
          <Typography variant="h3" className="text-guild-green-400 mb-4">
            Building on Movement Cheatsheet
          </Typography>

          <List className="space-y-3">
            <ListItem>
              <Link
                href="https://docs.movementnetwork.xyz/devs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Movement Docs
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://docs.movementnetwork.xyz/devs/networkEndpoints"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Network Endpoints (RPC, Indexer, etc.)
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://docs.movementnetwork.xyz/devs/movementcli#testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Install Movement CLI for Testnet (highly recommended)
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="/"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Alternatively, use Replit contract repos (Builder Kits)
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://docs.movementnetwork.xyz/devs/firstMoveContract"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Build and Deploy Your First Move Contract
              </Link>
            </ListItem>
          </List>

          <Text className="text-guild-green-400 mt-6 mb-3 font-medium">
            If you are new to Move:
          </Text>

          <List className="space-y-3">
            <ListItem>
              <Link
                href="https://docs.movementnetwork.xyz/devs/move-book/modules"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Learn Basic Syntax
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://movespiders.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Interactive Way of Learning (MoveSpiders)
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://docs.movementnetwork.xyz/devs/move2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-guild-green-400 transition-colors"
              >
                Learn About Move 2
              </Link>
            </ListItem>
          </List>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </DottedBackground>
  );
}
