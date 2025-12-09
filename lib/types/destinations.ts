// Types for Top Destinations Ranking component

export interface DestinationStats {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  rank: number;
  rankLabel: string;
  rankEmoji: string;
  growthPercentage: number;
  totalVisitors: number;
  rating: number;
  highlights?: string[];
  isTrending?: boolean;
}

export interface DestinationWithStats {
  packageId: string;
  location: string;
  totalVisitors: number;
  averageRating: number;
  totalBookings: number;
  growthPercentage: number;
  imageUrl?: string;
}
