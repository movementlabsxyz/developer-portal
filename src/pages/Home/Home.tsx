'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Typography,
  Text,
  DottedBackground,
  Tabs,
  TabsList,
  TabsTrigger,
  Input,
  MagnifyingGlass,
} from '@movementlabsxyz/movement-design-system';
import { useKits } from '@/hooks/useKits';

export default function Home() {
  const { kits } = useKits();
  const [activeTab, setActiveTab] = useState<'all' | 'app' | 'module'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => new Fuse(kits, {
    keys: ['name', 'description', 'tags'],
    threshold: 0.4,
    includeScore: true,
  }), [kits]);

  const filteredKits = useMemo(() => {
    let results = activeTab === 'all'
      ? kits
      : kits.filter((kit) => kit.type === activeTab);

    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      const matchedIds = new Set(searchResults.map(r => r.item.id));
      results = results.filter(kit => matchedIds.has(kit.id));
    }

    return results;
  }, [kits, activeTab, searchQuery, fuse]);

  return (
    <DottedBackground
      variant="dots"
      dotColor="var(--color-neutrals-white-alpha-300)"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="pt-32 pb-[50px] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Typography variant="h1" className="text-guild-green-400 mb-6">
            Everything you need to get started building on Movement.
          </Typography>
          <Text className="text-muted-foreground mb-8 text-lg">
            Build on Move Language and ship your idea faster, with support from Movement and partners like Replit.
          </Text>
          <Button variant="default" size="lg" asChild>
            <Link href="#kits">Explore Kits</Link>
          </Button>
        </div>
      </section>

      {/* Kits Grid Section */}
      <section id="kits" className="pt-0 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Typography variant="h2" className="text-guild-green-400 mb-4">
              Movement Builder Kits
            </Typography>
            <Text className="text-muted-foreground">
              Pre-configured development environments with everything you need to build on Movement
            </Text>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Tabs
              defaultValue="all"
              onValueChange={(value) => setActiveTab(value as 'all' | 'app' | 'module')}
            >
              <TabsList>
                <TabsTrigger value="all">All Kits</TabsTrigger>
                <TabsTrigger value="app">Apps</TabsTrigger>
                <TabsTrigger value="module">Modules</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-white z-10" size={18} />
              <Input
                type="search"
                placeholder="Search kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKits.map((kit) => (
              <Card
                key={kit.id}
                className="border-guild-green-400-20 hover:border-guild-green-400 transition-colors"
              >
                <CardHeader>
                  <CardTitle>{kit.name}</CardTitle>
                  <CardDescription>{kit.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2">
                    {kit.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={kit.githubLink} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="default" size="sm" asChild>
                    <Link href={kit.replitLink} target="_blank" rel="noopener noreferrer">
                      Open in Replit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4">
        <Card className="max-w-2xl mx-auto text-center border-guild-green-400">
          <CardHeader>
            <CardTitle>Ready to start building?</CardTitle>
            <CardDescription>
              Check out our events and rewards program to get even more out of your Movement development experience.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="default" asChild>
              <Link href="/events">View Events & Rewards</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </DottedBackground>
  );
}
