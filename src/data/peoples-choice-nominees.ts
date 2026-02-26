export interface PeoplesChoiceNominee {
  id: number;
  name: string;
  description: string;
  prize: string;
  repoUrl?: string;
  videoUrl?: string;
  demoUrl?: string;
  slidesUrl?: string;
}

export const peoplesChoiceNominees: PeoplesChoiceNominee[] = [
  {
    id: 0,
    name: "The Fallen Court",
    prize: "People's Choice Nominee",
    description:
      "Narrative-driven ASCII dungeon crawler with blockchain integration for real stakes and on-chain NFTs.",
    videoUrl: "https://youtu.be/GAcvInDh69Y",
    demoUrl: "https://www.thefallencourt.com/",
  },
  {
    id: 1,
    name: "AlgoArena",
    prize: "People's Choice Nominee",
    description:
      "Competitive auto-battler game with AI trading agents on live crypto using x402 micropayments.",
    videoUrl: "https://www.youtube.com/watch?v=CaYiyJwoorY",
    demoUrl: "https://movealgoarena.vercel.app/",
  },
  {
    id: 2,
    name: "Movers Map",
    prize: "People's Choice Nominee",
    description:
      "Community-driven mapping platform built on Movement for decentralized location data.",
    videoUrl: "https://x.com/Soke_Decentra/status/2009928574921240808?s=20",
    demoUrl: "https://moversmap.netlify.app/",
  },
  {
    id: 3,
    name: "Ashfall",
    prize: "People's Choice Nominee",
    description:
      "Post-apocalyptic on-chain survival game with player-owned economies on Movement.",
  },
  {
    id: 4,
    name: "The Village",
    prize: "People's Choice Nominee",
    description:
      "Social coordination platform enabling community governance and collective decision-making on-chain.",
    videoUrl: "https://www.youtube.com/watch?v=60qJEG2PMDE",
    demoUrl: "https://github.com/jomarip/thevillage",
  },
];
