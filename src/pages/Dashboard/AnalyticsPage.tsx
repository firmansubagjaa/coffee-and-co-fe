
import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { CURRENCY } from '../../utils/constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { exportData } from '../../utils/export';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

const SALES_DATA = [12, 15, 18, 16, 22, 28, 26, 35, 42, 38, 48, 55]; // in k$


export const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();

  const months = [
    t('common.months.jan'), t('common.months.feb'), t('common.months.mar'), t('common.months.apr'),
    t('common.months.may'), t('common.months.jun'), t('common.months.jul'), t('common.months.aug'),
    t('common.months.sep'), t('common.months.oct'), t('common.months.nov'), t('common.months.dec')
  ];

  const handleExport = (format: string) => {
    const exportPayload = months.map((month, index) => ({
        month,
        revenue_k: SALES_DATA[index],
        projected_k: SALES_DATA[index] * 1.1, 
        year: 2024
    }));
    
    exportData(exportPayload, 'sales_analytics_2024', format as 'csv' | 'json');
    toast.success(t('dashboard.analytics.exportSuccess', { format: format.toUpperCase() }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
            <div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    {t('dashboard.analytics.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('dashboard.analytics.subtitle')}</p>
            </div>
            <div className="flex gap-3 items-center w-full md:w-auto">
                <Button variant="outline" className="bg-white dark:bg-coffee-900 gap-2 border-gray-200 dark:border-coffee-800 text-gray-600 dark:text-gray-300 h-11">
                    <Calendar className="w-4 h-4" /> 2024
                </Button>
                
                <Select onValueChange={handleExport}>
                    <SelectTrigger className="w-full md:w-[140px] bg-white dark:bg-coffee-900 h-11 rounded-full border border-gray-200 dark:border-coffee-800">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">{t('dashboard.analytics.export')}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="csv">{t('dashboard.admin.exportFormats.csv')}</SelectItem>
                        <SelectItem value="json">{t('dashboard.admin.exportFormats.json')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Top Metrics Grid - Clean Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: t('dashboard.analytics.netSales'), val: '355,240', trend: 12.5, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                { title: t('dashboard.analytics.avgOrderValue'), val: '42.80', trend: 5.2, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { title: t('dashboard.analytics.refundRate'), val: '1.2%', trend: -2.1, icon: ArrowDownRight, color: 'text-purple-600', bg: 'bg-purple-50', isBad: false } // Refund down is good
            ].map((m, i) => (
                <div key={i} className="bg-white dark:bg-coffee-900 p-8 rounded-[2rem] border border-gray-100 dark:border-coffee-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3.5 rounded-2xl ${m.bg} ${m.color} dark:bg-opacity-10`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                        <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${m.trend > 0 && !m.isBad ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400'}`}>
                            <ArrowUpRight className="w-3 h-3 mr-1" /> {Math.abs(m.trend)}%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">{m.title}</p>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{m.title === t('dashboard.analytics.refundRate') ? '' : CURRENCY}{m.val}</h3>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Trend Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-coffee-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-coffee-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-10">{t('dashboard.analytics.revenueTrend')}</h3>
                <div className="h-72 flex items-end justify-between gap-2 sm:gap-4">
                    {SALES_DATA.map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col justify-end group h-full">
                            <div className="relative w-full h-full flex items-end">
                                <div 
                                    className="w-full bg-coffee-900 dark:bg-coffee-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-300 relative"
                                    style={{ height: `${(val / 60) * 100}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        {val}k
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-4 font-bold uppercase tracking-wider">{months[idx]}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white dark:bg-coffee-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-coffee-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">{t('dashboard.analytics.salesByCategory')}</h3>
                <div className="space-y-8">
                    {[
                        { name: t('common.categories.coffee'), pct: 45, color: 'bg-coffee-800' },
                        { name: t('common.categories.drinks'), pct: 30, color: 'bg-coffee-600' },
                        { name: t('common.categories.pastry'), pct: 15, color: 'bg-yellow-500' },
                        { name: t('common.categories.merch'), pct: 10, color: 'bg-gray-300' }
                    ].map((cat, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="font-bold text-gray-700 dark:text-gray-200">{cat.name}</span>
                                <span className="text-gray-500 dark:text-gray-400 font-mono">{cat.pct}%</span>
                            </div>
                            <div className="h-4 w-full bg-gray-100 dark:bg-coffee-800 rounded-full overflow-hidden">
                                <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Cohort Analysis Simulation */}
        <div className="bg-white dark:bg-coffee-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-coffee-800 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">{t('dashboard.analytics.customerRetention')}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">
                    <thead>
                        <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-coffee-800">
                            <th className="text-left py-4 pl-4 font-bold uppercase tracking-wider text-xs">{t('dashboard.analytics.cohort')}</th>
                            <th className="py-4 font-bold uppercase tracking-wider text-xs">{t('dashboard.analytics.month')} 1</th>
                            <th className="py-4 font-bold uppercase tracking-wider text-xs">{t('dashboard.analytics.month')} 2</th>
                            <th className="py-4 font-bold uppercase tracking-wider text-xs">{t('dashboard.analytics.month')} 3</th>
                            <th className="py-4 font-bold uppercase tracking-wider text-xs">{t('dashboard.analytics.month')} 4</th>
                            <th className="py-4 font-bold uppercase tracking-wider text-xs">{t('dashboard.analytics.month')} 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { m: t('common.months.jan'), retention: [100, 45, 38, 35, 32] },
                            { m: t('common.months.feb'), retention: [100, 48, 40, 38, null] },
                            { m: t('common.months.mar'), retention: [100, 52, 45, null, null] },
                            { m: t('common.months.apr'), retention: [100, 55, null, null, null] },
                        ].map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 dark:border-coffee-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-coffee-800/30 transition-colors">
                                <td className="py-5 pl-4 text-left font-bold text-gray-900 dark:text-gray-200">{row.m} 2024</td>
                                {row.retention.map((val, idx) => (
                                    <td key={idx} className="py-5">
                                        {val ? (
                                            <span 
                                                className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                                                    val === 100 ? 'bg-gray-100 text-gray-400 dark:bg-coffee-800 dark:text-gray-500' :
                                                    val > 50 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    val > 40 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                }`}
                                            >
                                                {val}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-200">--</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
