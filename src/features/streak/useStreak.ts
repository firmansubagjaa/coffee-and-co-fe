import { useState, useEffect } from 'react';

// Simple mock implementation of daily visit streaks
export const useStreak = () => {
  const [streak, setStreak] = useState(0);
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would come from a backend or local storage
    // Simulating a user who has visited 3 days in a row
    setStreak(3);
    setLastVisit(new Date().toISOString());
  }, []);

  return { streak, lastVisit };
};
