
import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  Zap, 
  HeartCrack, 
  Sprout, 
  Search,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { toast } from 'sonner';
import { CURRENCY } from '../../../utils/constants';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Customer {
    id: string;
    name: string;
    email: string;
    segment: 'Champion' | 'Loyalist' | 'At Risk' | 'New' | 'Hibernating';
    totalSpent: number;
    orders: number;
    lastVisit: string; // ISO date
}

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', segment: 'Champion', totalSpent: 850.50, orders: 24, lastVisit: '2024-05-24' },
    { id: '2', name: 'Michael Chen', email: 'm.chen@tech.co', segment: 'Champion', totalSpent: 720.00, orders: 18, lastVisit: '2024-05-22' },
    { id: '3', name: 'Amara Ndiaye', email: 'amara@design.io', segment: 'Loyalist', totalSpent: 450.25, orders: 12, lastVisit: '2024-05-15' },
    { id: '4', name: 'David Smith', email: 'd.smith@corp.net', segment: 'At Risk', totalSpent: 520.00, orders: 15, lastVisit: '2024-03-10' },
    { id: '5', name: 'Emma Wilson', email: 'emma.w@art.org', segment: 'New', totalSpent: 45.00, orders: 2, lastVisit: '2024-05-20' },
    { id: '6', name: 'Tom Hardy', email: 'tom@movies.com', segment: 'Hibernating', totalSpent: 120.00, orders: 5, lastVisit: '2023-12-01' },
    { id: '7', name: 'Lisa Kudrow', email: 'lisa@friends.tv', segment: 'Loyalist', totalSpent: 380.00, orders: 10, lastVisit: '2024-05-18' },
];

const SEGMENT_INFO = {
    Champion: { 
        icon: Crown, 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100', 
        desc: 'Big spenders, frequent visitors.',
        action: 'Offer VIP Perks'
    },
    Loyalist: { 
        icon: Zap, 
        color: 'text-purple-600', 
        bg: 'bg-purple-100', 
        desc: 'Steady regulars.',
        action: 'Upsell / Loyalty Points'
    },
    'At Risk': { 
        icon: HeartCrack, 
        color: 'text-orange-600', 
        bg: 'bg-orange-100', 
        desc: 'High value, hasn\'t visited lately.',
        action: 'Win-back Campaign'
    },
    New: { 
        icon: Sprout, 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        desc: 'Recent first purchase.',
        action: 'Welcome Series'
    },
    Hibernating: {
        icon: Users,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        desc: 'Low frequency, low recency.',
        action: 'Re-engagement'
    }
};

export const CustomerSegmentsPage: React.FC = () => {
    const { t } = useLanguage();
    const [selectedSegment, setSelectedSegment] = useState<string>('All');
    const [search, setSearch] = useState('');

    const getSegmentKey = (key: string) => key === 'At Risk' ? 'atRisk' : key.toLowerCase();

    const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
        const matchSegment = selectedSegment === 'All' || c.segment === selectedSegment;
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
        return matchSegment && matchSearch;
    });

    const handleEmail = (segment: string) => {
        toast.success(t('dashboard.customers.toast.campaignDrafted', { segment }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
                    {t('dashboard.customers.title')}
                </h1>
                <p className="text-coffee-500 dark:text-coffee-400 mt-1">{t('dashboard.customers.subtitle')}</p>
            </div>

            {/* Segment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <button 
                    onClick={() => setSelectedSegment('All')}
                    className={`p-4 rounded-2xl border text-left transition-all ${selectedSegment === 'All' ? 'bg-coffee-900 dark:bg-coffee-700 text-white border-coffee-900 dark:border-coffee-700 shadow-md' : 'bg-white dark:bg-coffee-900 border-coffee-100 dark:border-coffee-800 hover:border-coffee-300 dark:hover:border-coffee-600'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{t('dashboard.customers.all')}</span>
                        <Users className="w-5 h-5 opacity-70" />
                    </div>
                    <p className="text-2xl font-bold">{MOCK_CUSTOMERS.length}</p>
                    <p className={`text-xs mt-1 ${selectedSegment === 'All' ? 'text-coffee-200' : 'text-coffee-500 dark:text-coffee-400'}`}>{t('dashboard.customers.totalDatabase')}</p>
                </button>

                {(Object.keys(SEGMENT_INFO) as Array<keyof typeof SEGMENT_INFO>).map(key => {
                    const info = SEGMENT_INFO[key];
                    const count = MOCK_CUSTOMERS.filter(c => c.segment === key).length;
                    const isSelected = selectedSegment === key;
                    const Icon = info.icon;

                    return (
                        <button 
                            key={key}
                            onClick={() => setSelectedSegment(key)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${isSelected ? 'ring-2 ring-offset-2 ring-coffee-900 dark:ring-coffee-400 border-transparent shadow-md' : 'bg-white dark:bg-coffee-900 border-coffee-100 dark:border-coffee-800 hover:shadow-sm'}`}
                        >
                            <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <Icon className={`w-16 h-16 ${info.color}`} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-bold ${info.color}`}>{t(`dashboard.customers.segments.${getSegmentKey(key)}.name`)}</span>
                                    <div className={`p-1.5 rounded-lg ${info.bg} ${info.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-coffee-900 dark:text-white">{count}</p>
                                <p className="text-xs text-coffee-500 dark:text-coffee-400 mt-1 truncate">{t(`dashboard.customers.segments.${getSegmentKey(key)}.desc`)}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* List Section */}
            <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-coffee-100 dark:border-coffee-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <h3 className="font-serif font-bold text-xl text-coffee-900 dark:text-white whitespace-nowrap">
                            {selectedSegment === 'All' ? t('dashboard.customers.all') : t(`dashboard.customers.segments.${getSegmentKey(selectedSegment)}.name`)}
                        </h3>
                        <div className="h-6 w-px bg-coffee-200 dark:bg-coffee-700 mx-2 hidden sm:block"></div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 dark:text-coffee-500" />
                            <Input 
                                placeholder={t('dashboard.customers.searchPlaceholder')} 
                                className="pl-10 h-10 bg-coffee-50/50 dark:bg-coffee-800/50 border-coffee-200 dark:border-coffee-700"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {selectedSegment !== 'All' && (
                        <Button onClick={() => handleEmail(selectedSegment)} className="gap-2 shadow-lg">
                            <Mail className="w-4 h-4" /> {t(`dashboard.customers.segments.${getSegmentKey(selectedSegment)}.action`)}
                        </Button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.customers.table.customer')}</th>
                                <th className="px-6 py-4">{t('dashboard.customers.table.segment')}</th>
                                <th className="px-6 py-4">{t('dashboard.customers.table.totalSpent')}</th>
                                <th className="px-6 py-4">{t('dashboard.customers.table.orders')}</th>
                                <th className="px-6 py-4">{t('dashboard.customers.table.lastVisit')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.customers.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-50">
                            {filteredCustomers.map(customer => {
                                const segment = SEGMENT_INFO[customer.segment];
                                return (
                                    <tr key={customer.id} className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 bg-coffee-100 dark:bg-coffee-800 border border-coffee-200 dark:border-coffee-700">
                                                    <AvatarFallback className="text-coffee-700 dark:text-coffee-300 font-bold text-xs">
                                                        {customer.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-coffee-900 dark:text-white">{customer.name}</p>
                                                    <p className="text-xs text-coffee-500 dark:text-coffee-400">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`${segment.bg} ${segment.color} border-0`}>
                                                {t(`dashboard.customers.segments.${getSegmentKey(customer.segment)}.name`)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-coffee-800 dark:text-coffee-200">
                                            {CURRENCY}{customer.totalSpent.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400">
                                            {customer.orders}
                                        </td>
                                        <td className="px-6 py-4 text-coffee-500 dark:text-coffee-400">
                                            {new Date(customer.lastVisit).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-coffee-400 dark:text-coffee-500 hover:text-coffee-900 dark:hover:text-white hover:bg-coffee-50 dark:hover:bg-coffee-800 rounded-full transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredCustomers.length === 0 && (
                        <div className="p-12 text-center text-coffee-400">
                            {t('dashboard.customers.noCustomers')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
