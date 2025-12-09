// Types for Landing Page Components

export interface Service {
  id: string;
  title: string;
  image: string;
}

export interface Destination {
  id: string;
  rank: number;
  name: string;
  description: string;
  image: string;
  growth: string;
  rating: number;
  highlights: string[];
  packages: number;
  visitors: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  date: string;
  rating: number;
  content: string;
  package: string;
  image: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Stats {
  experience: string;
  customers: string;
  destinations: string;
  satisfaction: string;
}

export interface HowToStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}
