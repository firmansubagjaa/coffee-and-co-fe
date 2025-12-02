import React, { useState } from 'react';
import { useStreak } from '../../features/streak/useStreak';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Gift, Lock, Sparkles, Star, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_USER_REWARDS, REWARD_TIERS, REWARD_ITEMS, RewardTier } from '../../data/mockRewards';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-4">{t('rewards.title')}</h1>
                <p className="text-coffee-600 dark:text-coffee-300">{t('rewards.subtitle')}</p>
            </div>

            {/* Tier Status Card */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden",
                    "bg-gradient-to-br",
                    currentTier.color
                )}
            >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20">
                    <currentTier.icon className="w-96 h-96" />
                </div>
                
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <currentTier.icon className="w-6 h-6" />
                            </div>
                            <span className="font-bold tracking-wider uppercase text-sm bg-black/20 px-3 py-1 rounded-full">
                                {t(`rewards.tiers.${currentTier.id}`)}
                            </span>
                        </div>
                        
                        <h2 className="text-6xl md:text-7xl font-bold mb-2">{user.currentPoints}</h2>
                        <p className="text-white/80 text-lg mb-8">{t('rewards.currentPoints')}</p>

                        {nextTier && (
                            <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span>{t('rewards.tiers.nextTier', { tier: t(`rewards.tiers.${nextTier.id}`) })}</span>
                                    <span>{t('rewards.tiers.pointsToGo', { points: pointsToNextTier })}</span>
                                </div>
                                <div className="w-full bg-black/30 h-4 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="bg-white h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                                {t('rewards.benefits')}
                            </h3>
                            <ul className="space-y-3">
                                {currentTier.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm md:text-base">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-4 bg-orange-500/20 p-4 rounded-2xl border border-orange-500/30">
                            <Flame className="w-8 h-8 text-orange-400 fill-current" />
                            <div>
                                <p className="text-xs uppercase tracking-wide opacity-80">{t('rewards.currentStreak')}</p>
                                <p className="font-bold text-xl">{streak} {t('common.days')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mystery Reward Section */}
            <div className="mb-16">
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-[2rem] p-1 relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                    <div className="bg-coffee-950/80 backdrop-blur-xl rounded-[1.8rem] p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
                        
                        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-3xl font-bold text-white mb-2">{t('rewards.mystery.title')}</h3>
                        <p className="text-purple-200 mb-8">{t('rewards.mystery.subtitle')}</p>

                        <div className="flex justify-center">
                            <Button 
                                size="lg"
                                onClick={handleMysterySpin}
                                disabled={mysteryRevealed || isSpinning}
                                className={cn(
                                    "rounded-full px-12 py-8 text-lg font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all transform hover:scale-105",
                                    mysteryRevealed ? "bg-green-500 hover:bg-green-600" : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500"
                                )}
                            >
                                {isSpinning ? (
                                    <Zap className="w-6 h-6 animate-spin" />
                                ) : mysteryRevealed ? (
                                    t('rewards.mystery.won', { reward: '50 pts' })
                                ) : (
                                    t('rewards.mystery.cta')
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rewards Grid */}
            <h3 className="text-2xl font-bold text-coffee-900 dark:text-white mb-8 flex items-center gap-3">
                <Gift className="w-6 h-6 text-coffee-600" />
                {t('rewards.redeem')}
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REWARD_ITEMS.map((item) => {
                    const isLocked = item.minTierId && 
                        (Object.keys(REWARD_TIERS).indexOf(user.currentTierId) < Object.keys(REWARD_TIERS).indexOf(item.minTierId));
                    
                    return (
                        <motion.div 
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className={cn(
                                "bg-white dark:bg-coffee-900 p-6 rounded-[2rem] shadow-sm border border-coffee-100 dark:border-coffee-800 flex flex-col relative overflow-hidden group",
                                isLocked && "opacity-75 grayscale-[0.5]"
                            )}
                        >
                            {item.isPopular && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                    {t('rewards.popular')}
                                </div>
                            )}

                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                                isLocked ? "bg-gray-100 dark:bg-coffee-800 text-gray-400" : "bg-cream-100 dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 group-hover:bg-yellow-500 group-hover:text-white"
                            )}>
                                {isLocked ? <Lock className="w-8 h-8" /> : <item.icon className="w-8 h-8" />}
                            </div>

                            <h4 className="font-bold text-coffee-900 dark:text-white text-lg mb-1">{item.title}</h4>
                            <p className="text-coffee-500 dark:text-coffee-400 text-sm mb-6 flex items-center gap-1">
                                <span className="font-bold text-yellow-600 dark:text-yellow-400">{item.pointsCost}</span>
                                {t('rewards.points')}
                            </p>

                            <div className="mt-auto">
                                {isLocked ? (
                                    <div className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-coffee-800 text-gray-500 text-sm font-medium text-center flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t('rewards.tiers.nextTier', { tier: t(`rewards.tiers.${item.minTierId}`) })}
                                    </div>
                                ) : (
                                    <Button variant="outline" className="w-full rounded-xl group-hover:bg-coffee-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-coffee-900 border-coffee-200 dark:border-coffee-700">
                                        {t('rewards.redeem')}
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