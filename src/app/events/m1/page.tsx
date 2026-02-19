'use client';

import Link from "next/link";
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
import { m1Winners } from "@/data/m1-winners";

export default function M1WinnersPage() {
  return (
    <DottedBackground
      variant="dots"
      dotColor="var(--color-neutrals-white-alpha-300)"
      className="min-h-screen py-32"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-guild-green-400 mb-4">
            M1 Hackathon Winners
          </Typography>
          <Text className="text-muted-foreground text-lg">
            Winning projects built on Movement during the M1 Hackathon hosted
            by Encode Club.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {m1Winners.map((winner) => (
            <Card
              key={winner.name}
              className="border-guild-green-400-20 hover:border-guild-green-400 transition-colors"
            >
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">
                  {winner.prize}
                </Badge>
                <CardTitle className="text-white">{winner.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{winner.description}</CardDescription>
              </CardHeader>
              <CardFooter className="gap-2">
                {winner.videoUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={winner.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Video
                    </Link>
                  </Button>
                )}
                {winner.demoUrl && (
                  <Button variant="default" size="sm" asChild>
                    <Link
                      href={winner.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Demo
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    </DottedBackground>
  );
}
