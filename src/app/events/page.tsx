'use client';

import Link from 'next/link';
import {
  Typography,
  Text,
  Button,
  DottedBackground,
} from '@movementlabsxyz/movement-design-system';

export default function EventsPage() {
  return (
    <DottedBackground
      variant="dots"
      dotColor="var(--color-neutrals-white-alpha-300)"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto text-center px-4">
        <Typography variant="h1" className="text-guild-green-400 mb-6">
          Under Construction
        </Typography>
        <Text className="text-muted-foreground mb-8 text-lg">
          We&apos;re working on something exciting! The Events & Rewards page will be available soon.
        </Text>

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

        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </DottedBackground>
  );
}
