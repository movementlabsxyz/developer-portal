'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Typography,
  Text,
  Button,
  DottedBackground,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
} from '@movementlabsxyz/movement-design-system';

const AGENT_PROMPT = 'Read https://developer.movementnetwork.xyz/events/openclawhackathon.md and follow the instructions to start building';

export default function OpenClawHackathonPage() {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(AGENT_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DottedBackground
      variant="dots"
      dotColor="var(--color-neutrals-white-alpha-300)"
      className="min-h-screen py-32"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <Typography variant="h1" className="text-guild-green-400 mb-4">
            Open Claw Hackathon
          </Typography>
          <Text className="text-muted-foreground text-lg">
            ETH Denver | Thursday, February 19th | 5 Hour IRL Hack
          </Text>
        </div>

        {/* Prizes */}
        <div className="mb-12">
          <Card className="border-guild-green-400 bg-black/50 text-center p-8">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mx-auto mb-3">
                Prizes
              </Badge>
              <CardTitle className="text-white text-2xl">
                Two Mac Minis + Cool Swag
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs mt-2">
                Prizes are awarded at the sole discretion of the organizers. Eligibility, judging criteria, and distribution are subject to change.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tracks */}
        <div className="mb-12">
          <Typography variant="h2" className="text-guild-green-400 mb-6 text-center">
            Two Tracks
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-guild-green-400-20 hover:border-guild-green-400 transition-colors bg-black/50 p-6">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  Track 1
                </Badge>
                <CardTitle className="text-white">Build with an AI Agent</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Build a working app on Movement in 5 hours using an AI agent. Deploy a Move smart contract and connect a frontend to it.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-guild-green-400-20 hover:border-guild-green-400 transition-colors bg-black/50 p-6">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  Track 2
                </Badge>
                <CardTitle className="text-white">Agentic Infrastructure Proposal</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Propose bringing existing agentic infrastructure to Movement — ERCs, agentic wallets, agent standards from other chains, or novel tooling. Demo preferred, strong proposal also considered.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Agent Prompt */}
        <div className="mb-12">
          <Card className="border-guild-green-400 bg-black/80 p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-guild-green-400 text-2xl mb-4">
                Send your Agent to start hacking
              </CardTitle>
            </CardHeader>
            <div className="bg-black rounded-lg border border-guild-green-400-20 mb-6">
              <div className="flex justify-end p-2 pb-0">
                <button
                  onClick={copyPrompt}
                  className="px-3 py-1 text-xs rounded border border-guild-green-400 text-guild-green-400 hover:bg-guild-green-400 hover:text-black transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 pt-2">
                <code className="text-sm text-guild-green-400 break-all">
                  {AGENT_PROMPT}
                </code>
              </div>
            </div>
            <div className="space-y-3 text-center">
              <Text className="text-muted-foreground">
                <span className="text-guild-green-400 font-medium">1.</span> Send this prompt to your AI agent
              </Text>
              <Text className="text-muted-foreground">
                <span className="text-guild-green-400 font-medium">2.</span> Your agent reads the instructions
              </Text>
              <Text className="text-muted-foreground">
                <span className="text-guild-green-400 font-medium">3.</span> Start building together
              </Text>
            </div>
          </Card>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <Typography variant="h2" className="text-guild-green-400 mb-6 text-center">
            Resources
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-guild-green-400-20 hover:border-guild-green-400 transition-colors bg-black/50 p-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Move Plugin (Skills + MCP)</CardTitle>
                <CardDescription className="text-muted-foreground">
                  AI agent tooling for building and deploying Move smart contracts.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://github.com/Rahat-ch/move-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="border-guild-green-400-20 hover:border-guild-green-400 transition-colors bg-black/50 p-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Frontend Template</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Next.js template with wallet connection pre-configured for Movement Network.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://github.com/Rahat-ch/Movement-Network-ConnectWallet-Template"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Back */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    </DottedBackground>
  );
}
