"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import {
  Typography,
  Text,
  Button,
  DottedBackground,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
} from "@movementlabsxyz/movement-design-system";
import {
  peoplesChoiceNominees,
  PeoplesChoiceNominee,
} from "@/data/peoples-choice-nominees";
import {
  PEOPLES_CHOICE_MODULE,
  MOVEMENT_MAINNET_URL,
} from "@/lib/contracts";
import { WalletSelectionModal } from "@/components/WalletSelectionModal";

type VotingState =
  | "disconnected"
  | "checking"
  | "eligible"
  | "ineligible"
  | "already_voted"
  | "voting"
  | "voted"
  | "error";

const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: MOVEMENT_MAINNET_URL,
});
const aptos = new Aptos(aptosConfig);

const POLL_INTERVAL = 15_000;

export default function PeoplesChoicePage() {
  const { account, connected, disconnect, signAndSubmitTransaction } = useWallet();

  const [votingState, setVotingState] = useState<VotingState>("disconnected");
  const [voteCounts, setVoteCounts] = useState<number[]>(new Array(5).fill(0));
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [xp, setXp] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const fetchVoteCounts = useCallback(async () => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${PEOPLES_CHOICE_MODULE.address}::${PEOPLES_CHOICE_MODULE.moduleName}::${PEOPLES_CHOICE_MODULE.views.getVotes}`,
          typeArguments: [],
          functionArguments: [],
        },
      });
      if (result && Array.isArray(result[0])) {
        setVoteCounts(result[0].map(Number));
      }
    } catch {
      // Contract may not be deployed yet
    }
  }, []);

  const checkAlreadyVoted = useCallback(async (addr: string) => {
    try {
      const result = await aptos.view({
        payload: {
          function: `${PEOPLES_CHOICE_MODULE.address}::${PEOPLES_CHOICE_MODULE.moduleName}::${PEOPLES_CHOICE_MODULE.views.hasVoted}`,
          typeArguments: [],
          functionArguments: [addr],
        },
      });
      if (result && result[0] === true) {
        const choiceResult = await aptos.view({
          payload: {
            function: `${PEOPLES_CHOICE_MODULE.address}::${PEOPLES_CHOICE_MODULE.moduleName}::${PEOPLES_CHOICE_MODULE.views.getVoterChoice}`,
            typeArguments: [],
            functionArguments: [addr],
          },
        });
        setVotedFor(Number(choiceResult[0]));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const checkEligibility = useCallback(async (addr: string) => {
    setVotingState("checking");
    try {
      const alreadyVoted = await checkAlreadyVoted(addr);
      if (alreadyVoted) {
        setVotingState("already_voted");
        return;
      }

      const res = await fetch(`/api/check-eligibility?address=${addr}&candidate_id=0`);
      const data = await res.json();
      setXp(data.xp ?? 0);

      if (data.eligible) {
        setVotingState("eligible");
      } else {
        setVotingState("ineligible");
      }
    } catch {
      setVotingState("error");
      setErrorMsg("Failed to check eligibility. Please try again.");
    }
  }, [checkAlreadyVoted]);

  useEffect(() => {
    if (connected && account?.address) {
      checkEligibility(account.address.toString());
    } else {
      setVotingState("disconnected");
      setVotedFor(null);
      setXp(0);
    }
  }, [connected, account?.address, checkEligibility]);

  useEffect(() => {
    fetchVoteCounts();
    const interval = setInterval(fetchVoteCounts, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchVoteCounts]);

  const handleVote = async (candidateId: number) => {
    if (!account?.address) return;
    setSelectedCandidate(candidateId);
    setVotingState("voting");
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/check-eligibility?address=${account.address.toString()}&candidate_id=${candidateId}`
      );
      const data = await res.json();

      if (!data.eligible || !data.signature || !data.expiry) {
        setVotingState("error");
        setErrorMsg("Eligibility verification failed.");
        return;
      }

      const sigHex = (data.signature as string).replace(/^0x/, "");
      const sigBytes = new Uint8Array(
        sigHex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
      );

      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${PEOPLES_CHOICE_MODULE.address}::${PEOPLES_CHOICE_MODULE.moduleName}::${PEOPLES_CHOICE_MODULE.functions.vote}`,
          functionArguments: [
            candidateId,
            sigBytes,
            data.expiry,
          ],
        },
      });

      try {
        const txResult = await aptos.waitForTransaction({
          transactionHash: response.hash,
          options: { checkSuccess: true },
        });

        if (!txResult.success) {
          setVotingState("error");
          setErrorMsg("Transaction failed on-chain. Please try again.");
          return;
        }
      } catch {
        setVotingState("error");
        setErrorMsg("Transaction failed or timed out. Please try again.");
        return;
      }

      setVotedFor(candidateId);
      setVotingState("voted");
      fetchVoteCounts();
    } catch (err: unknown) {
      setVotingState("error");
      if (err instanceof Error) {
        if (err.message.includes("rejected") || err.message.includes("Rejected")) {
          setErrorMsg("Transaction was rejected. Please try again.");
        } else if (err.message.includes("ALREADY_VOTED")) {
          setErrorMsg("You have already voted.");
          setVotingState("already_voted");
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);

  return (
    <DottedBackground
      variant="dots"
      dotColor="var(--color-neutrals-white-alpha-300)"
      className="min-h-screen py-32"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-guild-green-400 mb-4">
            People&apos;s Choice Award
          </Typography>
          <Text className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vote for your favorite M1 Hackathon project. Connect your Movement
            wallet and cast your vote on-chain. Requires 100+ XP on Parthenon.
          </Text>
          {totalVotes > 0 && (
            <Text className="text-muted-foreground mt-2">
              {totalVotes} total vote{totalVotes !== 1 ? "s" : ""} cast
            </Text>
          )}
        </div>

        {/* Wallet / Status Section */}
        <div className="text-center mb-10">
          {votingState === "disconnected" && (
            <div className="flex flex-col items-center gap-3">
              <Text className="text-muted-foreground mb-2">
                Connect your wallet to vote
              </Text>
              <WalletSelectionModal>
                <Button variant="default" size="lg">
                  Connect Wallet
                </Button>
              </WalletSelectionModal>
            </div>
          )}

          {votingState === "checking" && (
            <Text className="text-guild-green-400">
              Checking eligibility...
            </Text>
          )}

          {votingState === "ineligible" && (
            <div className="p-4 rounded-xl border border-red-500/50 bg-red-500/10 inline-block">
              <Text className="text-red-400">
                You need at least 100 XP to vote. Your current XP: {xp}
              </Text>
            </div>
          )}

          {votingState === "eligible" && (
            <div className="p-4 rounded-xl border border-guild-green-400/50 bg-guild-green-400/10 inline-block">
              <Text className="text-guild-green-400">
                You&apos;re eligible to vote! Select a project below. (XP: {xp})
              </Text>
            </div>
          )}

          {(votingState === "already_voted" || votingState === "voted") && (
            <div className="p-4 rounded-xl border border-guild-green-400/50 bg-guild-green-400/10 inline-block">
              <Text className="text-guild-green-400">
                You voted for{" "}
                <span className="font-bold">
                  {votedFor !== null
                    ? peoplesChoiceNominees[votedFor]?.name
                    : "a project"}
                </span>
                !
              </Text>
            </div>
          )}

          {votingState === "voting" && (
            <Text className="text-guild-green-400">
              Submitting your vote...
            </Text>
          )}

          {votingState === "error" && (
            <div className="p-4 rounded-xl border border-red-500/50 bg-red-500/10 inline-flex flex-col items-center gap-3">
              <Text className="text-red-400">
                {errorMsg || "An error occurred"}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setErrorMsg("");
                  if (account?.address) {
                    checkEligibility(account.address.toString());
                  }
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {connected && votingState !== "disconnected" && (
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          )}
        </div>

        {/* Nominees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peoplesChoiceNominees.map((nominee: PeoplesChoiceNominee) => {
            const isVotedFor = votedFor === nominee.id;
            const count = voteCounts[nominee.id] ?? 0;

            return (
              <Card
                key={nominee.id}
                className={`flex flex-col transition-colors ${
                  isVotedFor
                    ? "border-guild-green-400 ring-2 ring-guild-green-400/50"
                    : "border-guild-green-400-20 hover:border-guild-green-400"
                }`}
              >
                <CardHeader className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{nominee.prize}</Badge>
                    <Badge variant="secondary">
                      {count} vote{count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{nominee.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {nominee.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="gap-2 flex-wrap mt-auto">
                  {nominee.videoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={nominee.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Video
                      </Link>
                    </Button>
                  )}
                  {nominee.demoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={nominee.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Demo
                      </Link>
                    </Button>
                  )}
                  {nominee.repoUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={nominee.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Repo
                      </Link>
                    </Button>
                  )}
                  {votingState === "eligible" && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleVote(nominee.id)}
                      disabled={votingState !== "eligible"}
                    >
                      Vote
                    </Button>
                  )}
                  {votingState === "voting" &&
                    selectedCandidate === nominee.id && (
                      <Button variant="default" size="sm" disabled>
                        Voting...
                      </Button>
                    )}
                  {isVotedFor && (
                    <Badge variant="secondary" className="bg-guild-green-400/20 text-guild-green-400">
                      Your Vote
                    </Badge>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    </DottedBackground>
  );
}
