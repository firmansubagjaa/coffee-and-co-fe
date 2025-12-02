import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="bg-coffee-50 p-6 rounded-full mb-6">
        <Construction className="h-12 w-12 text-coffee-600" />
      </div>
      <h1 className="text-3xl font-serif font-bold text-coffee-900 mb-2">{title}</h1>
      <p className="text-gray-500 max-w-md">
        This page is currently under construction. Check back later for updates.
      </p>
    </div>
  );
};
