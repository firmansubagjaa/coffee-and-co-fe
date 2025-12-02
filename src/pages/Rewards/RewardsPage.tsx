import React, { useState } from 'react';
import { useStreak } from '../../features/streak/useStreak';
import { motion } from 'framer-motion';
import { Flame, Gift, Lock, Sparkles, Star, Zap, Trophy, ChevronRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_USER_REWARDS, REWARD_TIERS, REWARD_ITEMS } from '../../data/mockRewards';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';
import { SEO } from '@/components/common/SEO';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "../../components/ui/Breadcrumb";

export const RewardsPage: React.FC = () => {
  const { streak } = useStreak();
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);

  const user = MOCK_USER_REWARDS;
  const currentTier = REWARD_TIERS[user.currentTierId];
  const nextTier = currentTier.nextTierId ? REWARD_TIERS[currentTier.nextTierId] : null;
  
  const pointsToNextTier = nextTier ? nextTier.minPoints - user.currentPoints : 0;
  const progressPercent = nextTier 
    ? ((user.currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const handleMysterySpin = () => {
    if (mysteryRevealed) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setMysteryRevealed(true);
      toast.success(t('rewards.mystery.won', { reward: '50 ' + t('rewards.points') }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO title="Rewards" description="Your rewards dashboard." />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink to="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Rewards</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-2">{t('rewards.title')}</h1>
                <p className="text-coffee-500 dark:text-white/60">Unlock exclusive perks and enjoy free drinks.</p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-coffee-800 px-4 py-2 rounded-full shadow-sm border border-coffee-100 dark:border-white/10 self-start md:self-auto">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="font-bold text-base text-coffee-900 dark:text-white">{streak} Day Streak</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Hero Card - Expanded */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "lg:col-span-2 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl text-white min-h-[300px] flex flex-col justify-between",
                    "bg-gradient-to-br",
                    currentTier.color
                )}
            >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 rotate-12">
                    <currentTier.icon className="w-96 h-96" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-lg">
                            <currentTier.icon className="w-6 h-6" />
                        </div>
                        <span className="font-bold tracking-[0.2em] uppercase text-sm bg-black/20 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                            {t(`rewards.tiers.${currentTier.id}`)} Member
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-12 mb-8">
                        <div>
                            <h2 className="text-6xl md:text-7xl font-bold tracking-tighter drop-shadow-md">{user.currentPoints}</h2>
                            <p className="text-white/80 text-lg font-medium">{t('rewards.currentPoints')}</p>
                        </div>
                        
                        {/* Desktop Progress Circle */}
                        {nextTier && (
                            <div className="hidden md:flex items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                                <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center relative shrink-0">
                                    <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeDasharray={`${progressPercent}, 100`}
                                            className="text-yellow-400"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Next Reward</p>
                                    <p className="text-xs text-white/70">{pointsToNextTier} points to {t(`rewards.tiers.${nextTier.id}`)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile/Tablet Linear Progress */}
                {nextTier && (
                    <div className="relative z-10 md:hidden bg-black/20 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-white/90">Next: {t(`rewards.tiers.${nextTier.id}`)}</span>
                            <span className="text-yellow-300">{pointsToNextTier} pts to go</span>
                        </div>
                        <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className="bg-yellow-400 h-full rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                            />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Mystery Reward & Benefits Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                {/* Mystery Banner */}
                <div className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl text-white flex flex-col justify-center items-center text-center group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
                    <div className="relative z-10 w-full">
                        <Sparkles className="w-12 h-12 text-yellow-300 mb-4 mx-auto drop-shadow-lg" />
                        <h3 className="font-bold text-2xl mb-2">{t('rewards.mystery.title')}</h3>
                        <p className="text-sm text-white/80 mb-6">Spin daily for a chance to win bonus points and exclusive coupons!</p>
                        <Button 
                            size="lg"
                            onClick={handleMysterySpin}
                            disabled={mysteryRevealed || isSpinning}
                            className={cn(
                                "rounded-full px-8 font-bold shadow-lg border border-white/20 w-full h-12 text-lg transition-transform hover:scale-105",
                                mysteryRevealed ? "bg-green-500 hover:bg-green-600" : "bg-white text-purple-700 hover:bg-purple-50"
                            )}
                        >
                            {isSpinning ? <Zap className="w-5 h-5 animate-spin" /> : mysteryRevealed ? "Won 50 pts!" : "Spin Now"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Rewards Grid - Responsive */}
        <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-coffee-100 dark:bg-coffee-800 rounded-xl">
                        <Gift className="w-6 h-6 text-coffee-900 dark:text-white" />
                    </div>
                    {t('rewards.redeem')}
                </h3>
                <Button variant="ghost" className="text-coffee-600 dark:text-coffee-300 hover:bg-coffee-50 dark:hover:bg-coffee-800">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {REWARD_ITEMS.map((item, idx) => {
                    const isLocked = item.minTierId && 
                        (Object.keys(REWARD_TIERS).indexOf(user.currentTierId) < Object.keys(REWARD_TIERS).indexOf(item.minTierId));
                    
                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn(
                                "bg-white dark:bg-[#3C2A21] p-6 rounded-[2rem] shadow-sm border border-coffee-100 dark:border-none flex flex-col gap-4 group transition-all hover:shadow-xl hover:-translate-y-1",
                                isLocked && "opacity-60 grayscale"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-inner",
                                    isLocked ? "bg-gray-100 dark:bg-white/5" : "bg-cream-100 dark:bg-black/20 group-hover:bg-coffee-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-coffee-900"
                                )}>
                                    {isLocked ? <Lock className="w-6 h-6 text-gray-400" /> : <item.icon className="w-8 h-8 text-coffee-600 dark:text-coffee-200 group-hover:text-white dark:group-hover:text-coffee-900" />}
                                </div>
                                {item.isPopular && (
                                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                        Popular
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-coffee-900 dark:text-white mb-1 line-clamp-1">{item.title}</h4>
                                <p className="text-sm text-coffee-500 dark:text-white/60 font-medium mb-4">{item.pointsCost} pts</p>
                                
                                {isLocked ? (
                                    <div className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center justify-center gap-2">
                                        <Lock className="w-3 h-3" />
                                        {t(`rewards.tiers.${item.minTierId}`)}
                                    </div>
                                ) : (
                                    <Button variant="outline" className="w-full rounded-xl font-bold border-coffee-200 dark:border-white/10 hover:bg-coffee-900 hover:text-white dark:hover:bg-white dark:hover:text-coffee-900 transition-colors">
                                        Redeem
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};