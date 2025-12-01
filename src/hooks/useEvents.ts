import { useMemo } from 'react';
import eventsData from '../../content/events.json';

export interface Reward {
  title: string;
  description: string;
  benefits: string[];
  eligibility: string;
  ctaText: string;
  ctaLink: string;
}

export interface Hackathon {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'upcoming' | 'ended';
  description: string;
  dates: string;
  prizes: string;
  prizeBreakdown: string[];
  categories: string[];
  registrationLink: string;
  learnMoreLink: string;
  featured: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  schedule?: string;
  date?: string;
  registrationLink: string;
  recurring: boolean;
}

export interface EventsData {
  rewards: Reward;
  hackathons: Hackathon[];
  communityEvents: CommunityEvent[];
}

export function useEvents() {
  const data: EventsData = useMemo(() => eventsData as EventsData, []);

  const activeHackathons = useMemo(
    () => data.hackathons.filter((hackathon) => hackathon.status === 'active'),
    [data.hackathons]
  );

  const upcomingHackathons = useMemo(
    () => data.hackathons.filter((hackathon) => hackathon.status === 'upcoming'),
    [data.hackathons]
  );

  const featuredHackathons = useMemo(
    () => data.hackathons.filter((hackathon) => hackathon.featured),
    [data.hackathons]
  );

  const recurringEvents = useMemo(
    () => data.communityEvents.filter((event) => event.recurring),
    [data.communityEvents]
  );

  const upcomingEvents = useMemo(
    () => data.communityEvents.filter((event) => !event.recurring),
    [data.communityEvents]
  );

  return {
    rewards: data.rewards,
    hackathons: data.hackathons,
    activeHackathons,
    upcomingHackathons,
    featuredHackathons,
    communityEvents: data.communityEvents,
    recurringEvents,
    upcomingEvents,
  };
}
