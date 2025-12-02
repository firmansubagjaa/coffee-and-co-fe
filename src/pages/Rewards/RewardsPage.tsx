import React, { useState } from 'react';
import { useStreak } from '../../features/streak/useStreak';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Gift, Lock, Sparkles, Star, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { MOCK_USER_REWARDS, REWARD_TIERS, REWARD_ITEMS, RewardTier } from '../../data/mockRewards';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';
import { SEO } from '@/components/common/SEO';

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
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6">
      <SEO 
        title="Rewards" 
        description="Earn points with every sip! Join our rewards program to unlock exclusive perks, free drinks, and special offers. Start earning today."
      />
      {/* Hero Section */}
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
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "rounded-[3rem] p-8 md:p-12 text-white shadow-2xl mb-16 relative overflow-hidden ring-1 ring-white/20",
                    "bg-gradient-to-br",
                    currentTier.color
                )}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 -mr-32 -mt-32 opacity-20 rotate-12">
                    <currentTier.icon className="w-[500px] h-[500px]" />
                </div>
                
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg border border-white/10">
                                <currentTier.icon className="w-8 h-8" />
                            </div>
                            <span className="font-bold tracking-[0.2em] uppercase text-sm bg-black/20 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                                {t(`rewards.tiers.${currentTier.id}`)}
                            </span>
                        </div>
                        
                        <div className="mb-8">
                            <h2 className="text-7xl md:text-8xl font-bold mb-2 tracking-tighter drop-shadow-lg">{user.currentPoints}</h2>
                            <p className="text-white/90 text-xl font-medium">{t('rewards.currentPoints')}</p>
                        </div>

                        {nextTier && (
                            <div className="bg-black/20 rounded-3xl p-6 backdrop-blur-md border border-white/10 shadow-inner">
                                <div className="flex justify-between text-sm mb-3 font-bold tracking-wide">
                                    <span className="text-white/90">{t('rewards.tiers.nextTier', { tier: t(`rewards.tiers.${nextTier.id}`) })}</span>
                                    <span className="text-yellow-300">{t('rewards.tiers.pointsToGo', { points: pointsToNextTier })}</span>
                                </div>
                                <div className="w-full bg-black/30 h-5 rounded-full overflow-hidden p-1 border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                        className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full shadow-[0_0_20px_rgba(253,224,71,0.5)] relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] skew-x-12"></div>
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl hover:bg-white/15 transition-colors">
                            <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
                                <div className="p-2 bg-yellow-400/20 rounded-xl">
                                    <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                </div>
                                {t('rewards.benefits')}
                            </h3>
                            <ul className="space-y-4">
                                {currentTier.benefits.map((benefit, idx) => (
                                    <motion.li 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                        key={idx} 
                                        className="flex items-center gap-4 text-base md:text-lg font-medium"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
                                        {benefit}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-5 bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-[2rem] border border-orange-500/30 backdrop-blur-md">
                            <div className="p-3 bg-orange-500/20 rounded-2xl">
                                <Flame className="w-8 h-8 text-orange-400 fill-orange-400 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] font-bold opacity-80 mb-1">{t('rewards.currentStreak')}</p>
                                <p className="font-bold text-2xl">{streak} {t('common.days')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mystery Reward Section */}
            <div className="mb-20">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[3rem] p-1.5 relative overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse"></div>
                    <div className="bg-coffee-950 rounded-[2.8rem] p-10 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />
                        
                        <div className="relative z-10">
                            <motion.div 
                                animate={{ rotate: isSpinning ? 360 : 0 }}
                                transition={{ duration: 1, repeat: isSpinning ? Infinity : 0, ease: "linear" }}
                                className="inline-block mb-6"
                            >
                                <Sparkles className="w-16 h-16 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
                            </motion.div>
                            
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{t('rewards.mystery.title')}</h3>
                            <p className="text-purple-200 text-xl mb-10 max-w-2xl mx-auto">{t('rewards.mystery.subtitle')}</p>

                            <div className="flex justify-center">
                                <Button 
                                    size="lg"
                                    onClick={handleMysterySpin}
                                    disabled={mysteryRevealed || isSpinning}
                                    className={cn(
                                        "rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all transform hover:scale-105 hover:shadow-[0_0_60px_rgba(168,85,247,0.8)] border-2 border-white/20",
                                        mysteryRevealed 
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500" 
                                            : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500"
                                    )}
                                >
                                    {isSpinning ? (
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-6 h-6 animate-spin" />
                                            <span>Spinning...</span>
                                        </div>
                                    ) : mysteryRevealed ? (
                                        <div className="flex items-center gap-3">
                                            <Gift className="w-6 h-6 animate-bounce" />
                                            <span>{t('rewards.mystery.won', { reward: '50 pts' })}</span>
                                        </div>
                                    ) : (
                                        t('rewards.mystery.cta')
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rewards Grid */}
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-coffee-100 dark:bg-coffee-800 rounded-2xl">
                    <Gift className="w-8 h-8 text-coffee-900 dark:text-white" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-coffee-900 dark:text-white">
                    {t('rewards.redeem')}
                </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {REWARD_ITEMS.map((item, idx) => {
                    const isLocked = item.minTierId && 
                        (Object.keys(REWARD_TIERS).indexOf(user.currentTierId) < Object.keys(REWARD_TIERS).indexOf(item.minTierId));
                    
                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
                            className={cn(
                                "bg-white dark:bg-coffee-900 p-8 rounded-[2.5rem] shadow-lg border border-coffee-100 dark:border-coffee-800 flex flex-col relative overflow-hidden group transition-all duration-300",
                                isLocked ? "opacity-80 grayscale-[0.8]" : "hover:shadow-2xl hover:border-coffee-300 dark:hover:border-coffee-600"
                            )}
                        >
                            {item.isPopular && (
                                <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 tracking-wide uppercase">
                                    {t('rewards.popular')}
                                </div>
                            )}

                            <div className={cn(
                                "w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-inner",
                                isLocked 
                                    ? "bg-gray-100 dark:bg-coffee-800 text-gray-400" 
                                    : "bg-cream-100 dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 group-hover:bg-coffee-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-coffee-900 group-hover:scale-110 group-hover:rotate-3"
                            )}>
                                {isLocked ? <Lock className="w-8 h-8" /> : <item.icon className="w-10 h-10" />}
                            </div>

                            <h4 className="font-bold text-coffee-900 dark:text-white text-2xl mb-2 group-hover:text-coffee-700 dark:group-hover:text-coffee-200 transition-colors">{item.title}</h4>
                            <p className="text-coffee-500 dark:text-coffee-400 text-base mb-8 flex items-center gap-2 font-medium">
                                <span className="font-bold text-xl text-yellow-600 dark:text-yellow-400">{item.pointsCost}</span>
                                {t('rewards.points')}
                            </p>

                            <div className="mt-auto">
                                {isLocked ? (
                                    <div className="w-full py-4 px-6 rounded-2xl bg-gray-100 dark:bg-coffee-800 text-gray-500 text-sm font-bold text-center flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-coffee-700">
                                        <Lock className="w-4 h-4" />
                                        {t('rewards.tiers.nextTier', { tier: t(`rewards.tiers.${item.minTierId}`) })}
                                    </div>
                                ) : (
                                    <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold group-hover:bg-coffee-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-coffee-900 border-coffee-200 dark:border-coffee-700 shadow-sm group-hover:shadow-lg transition-all">
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