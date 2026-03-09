import { NextRequest, NextResponse } from "next/server";
import { Ed25519PrivateKey, AccountAddress, Serializer } from "@aptos-labs/ts-sdk";

const PARTHENON_API_URL = "https://parthenon-api.movementlabs.xyz/api/users/xp-by-address";
const XP_THRESHOLD = 100;
const ELIGIBILITY_TTL_SECONDS = 300; // 5 min

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const candidateId = searchParams.get("candidate_id");

  if (!address || candidateId === null) {
    return NextResponse.json(
      { error: "address and candidate_id required" },
      { status: 400 }
    );
  }

  const candidateIdNum = parseInt(candidateId, 10);
  if (isNaN(candidateIdNum) || candidateIdNum < 0 || candidateIdNum > 4) {
    return NextResponse.json(
      { error: "candidate_id must be 0-4" },
      { status: 400 }
    );
  }

  try {
    const xp = await fetchXP(address);

    if (xp < XP_THRESHOLD) {
      return NextResponse.json({ eligible: false, xp });
    }

    const expiry = Math.floor(Date.now() / 1000) + ELIGIBILITY_TTL_SECONDS;
    const signature = await signEligibility(address, candidateIdNum, expiry);

    return NextResponse.json({
      eligible: true,
      xp,
      signature,
      expiry,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}

async function fetchXP(address: string): Promise<number> {
  const apiKey = process.env.PARTHENON_API_KEY;
  if (!apiKey) throw new Error("PARTHENON_API_KEY not configured");

  const url = `${PARTHENON_API_URL}?address=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`Parthenon API returned ${res.status}`);
  }

  const data = await res.json();
  return data?.data?.xp ?? 0;
}

async function signEligibility(
  address: string,
  candidateId: number,
  expiry: number
): Promise<string> {
  const privateKeyHex = process.env.ELIGIBILITY_SIGNER_KEY;
  if (!privateKeyHex) throw new Error("ELIGIBILITY_SIGNER_KEY not configured");

  const privateKey = new Ed25519PrivateKey(privateKeyHex);

  const addrBytes = AccountAddress.from(address).bcsToBytes();

  const candidateSer = new Serializer();
  candidateSer.serializeU64(candidateId);
  const candidateBytes = candidateSer.toUint8Array();

  const expirySer = new Serializer();
  expirySer.serializeU64(expiry);
  const expiryBytes = expirySer.toUint8Array();

  const message = new Uint8Array(addrBytes.length + candidateBytes.length + expiryBytes.length);
  message.set(addrBytes, 0);
  message.set(candidateBytes, addrBytes.length);
  message.set(expiryBytes, addrBytes.length + candidateBytes.length);

  const signature = privateKey.sign(message);
  return signature.toString();
}
