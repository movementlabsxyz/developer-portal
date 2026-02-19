export interface M1Winner {
  name: string;
  prize: string;
  description: string;
  videoUrl?: string;
  demoUrl?: string;
}

export const m1Winners: M1Winner[] = [
  {
    name: "The Fallen Court",
    prize: "Best Gaming App",
    description:
      "Narrative-driven ASCII dungeon crawler with blockchain integration for real stakes and on-chain NFTs.",
    videoUrl: "https://youtu.be/GAcvInDh69Y",
    demoUrl: "https://www.thefallencourt.com/",
  },
  {
    name: "Trace",
    prize: "Best New Devex Tool",
    description:
      "Developer tool suite to test and debug smart contract transactions before executing on the real network.",
    videoUrl: "https://youtu.be/7biqhmXmMyM",
    demoUrl: "https://www.tracce.lol/",
  },
  {
    name: "SportsMove",
    prize: "Best Consumer App",
    description:
      "Decentralized sports betting platform for major American sports leagues with abstracted on-ramp.",
    videoUrl: "https://www.youtube.com/watch?v=qUISbA7AOHI",
    demoUrl: "https://sports-move.vercel.app/",
  },
  {
    name: "AlgoArena",
    prize: "Best x402 App",
    description:
      "Competitive auto-battler game with AI trading agents on live crypto using x402 micropayments.",
    videoUrl: "https://www.youtube.com/watch?v=CaYiyJwoorY",
    demoUrl: "https://movealgoarena.vercel.app/",
  },
  {
    name: "Predictly",
    prize: "Best DeFi App",
    description:
      "Social-first prediction market platform for small, trusted communities.",
    videoUrl: "https://youtu.be/afQTpguUa4E",
    demoUrl: "https://predictly-movement.vercel.app/",
  },
  {
    name: "Movehat",
    prize: "Best Devex",
    description:
      "Developer toolkit that streamlines Move smart contract development, testing, and deployment.",
    videoUrl: "https://www.youtube.com/watch?v=tZuyFDI5jAg",
  },
];
