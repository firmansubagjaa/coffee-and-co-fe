import { LucideIcon, Coffee, Award, Crown, Star } from 'lucide-react';

export interface RewardTier {
  id: string;
  name: string;
  minPoints: number;
  color: string;
  icon: LucideIcon;
  benefits: string[];
  nextTierId?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  icon: LucideIcon;
  minTierId?: string; // If null, available to all
  isPopular?: boolean;
}

export interface UserRewards {
  currentPoints: number;
  lifetimePoints: number;
  currentTierId: string;
  nextRewardProgress: number; // 0-100
  streak: number;
}

export const REWARD_TIERS: Record<string, RewardTier> = {
  bronze: {
    id: 'bronze',
    name: 'Bean Starter',
    minPoints: 0,
    color: 'from-orange-400 to-orange-600',
    icon: Coffee,
    benefits: ['Earn 1 pt per $1', 'Birthday Reward'],
    nextTierId: 'silver'
  },
  silver: {
    id: 'silver',
    name: 'Brew Master',
    minPoints: 500,
    color: 'from-gray-300 to-gray-500',
    icon: Award,
    benefits: ['Earn 1.2 pts per $1', 'Free Size Upgrade', 'Exclusive Merch Access'],
    nextTierId: 'gold'
  },
  gold: {
    id: 'gold',
    name: 'Coffee Legend',
    minPoints: 1500,
    color: 'from-yellow-400 to-yellow-600',
    icon: Crown,
    benefits: ['Earn 1.5 pts per $1', 'Free Delivery', 'Priority Support', 'Secret Menu'],
    nextTierId: undefined
  }
};

export const MOCK_USER_REWARDS: UserRewards = {
  currentPoints: 850,
  lifetimePoints: 2350,
  currentTierId: 'silver',
  nextRewardProgress: 65,
  streak: 12
};

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: '1',
    title: 'Free Espresso Shot',
    pointsCost: 150,
    icon: Coffee,
    isPopular: true
  },
  {
    id: '2',
    title: 'Any Pastry',
    pointsCost: 300,
    icon: Coffee,
  },
  {
    id: '3',
    title: 'Signature Latte',
    pointsCost: 450,
    icon: Star,
    isPopular: true
  },
  {
    id: '4',
    title: 'Coffee Beans (250g)',
    pointsCost: 1000,
    icon: Award,
    minTierId: 'silver'
  },
  {
    id: '5',
    title: 'Barista Workshop',
    pointsCost: 5000,
    icon: Crown,
    minTierId: 'gold'
  }
];
