export const MOVEMENT_MAINNET_URL = "https://mainnet.movementnetwork.xyz/v1";
export const MOVEMENT_TESTNET_URL = "https://testnet.movementnetwork.xyz/v1";

export const PEOPLES_CHOICE_MODULE = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x1",
  moduleName: "peoples_choice",
  functions: {
    vote: "vote",
    pause: "pause",
    unpause: "unpause",
    initialize: "initialize",
  },
  views: {
    getVotes: "get_votes",
    hasVoted: "has_voted",
    getVoterChoice: "get_voter_choice",
  },
} as const;

export const MOVEMENT_NETWORK = {
  name: "Movement Mainnet" as const,
  chainId: 126,
  url: MOVEMENT_MAINNET_URL,
};
