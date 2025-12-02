
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Search } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { motion } from 'framer-motion';
import { SEO } from '@/components/common/SEO';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 flex items-center justify-center p-4 text-center">
      <SEO 
        title="Page Not Found" 
        description="The page you are looking for does not exist. Return to Coffee & Co home to continue your journey."
      />
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-coffee-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-cream-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center relative z-10"
      >
        <div className="relative inline-block mb-8">
            <Coffee className="w-32 h-32 text-coffee-200" />
            <div className="absolute -bottom-2 -right-2 bg-coffee-900 text-white text-xs font-bold px-2 py-1 rounded-lg transform rotate-12">
                Empty
            </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-coffee-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-coffee-800 mb-4">Page Not Found</h2>
        
        <p className="text-coffee-600 mb-8 max-w-sm mx-auto">
            Looks like you've ventured too far. The page you are looking for has been moved or doesn't exist.
        </p>

        <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/menu')} variant="secondary" className="shadow-lg">
                View Menu
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
                Go Home
            </Button>
        </div>
      </motion.div>
    </div>
  );
};
