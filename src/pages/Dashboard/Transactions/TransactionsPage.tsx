import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal,
  Download,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/ui/input';
import { CURRENCY } from '../../../utils/constants';
import { Badge } from '../../../components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { toast } from 'sonner';
import { exportData } from '../../../utils/export';
import { useLanguage } from '../../../contexts/LanguageContext';

// --- Types ---
interface Transaction {
    id: string;
    customer: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    date: string;
    method: 'Credit Card' | 'Cash' | 'Digital Wallet';
    items: string;
}

// --- Mock Data ---
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'TXN-8821', customer: 'Alice Johnson', amount: 12.50, status: 'completed', date: '2024-05-24 10:30 AM', method: 'Credit Card', items: 'Latte, Croissant' },
    { id: 'TXN-8822', customer: 'Bob Smith', amount: 8.00, status: 'completed', date: '2024-05-24 10:35 AM', method: 'Cash', items: 'Cappuccino' },
    { id: 'TXN-8823', customer: 'Charlie Brown', amount: 24.00, status: 'pending', date: '2024-05-24 10:42 AM', method: 'Digital Wallet', items: 'Cold Brew, Bagel, Muffin' },
    { id: 'TXN-8824', customer: 'David Lee', amount: 5.50, status: 'failed', date: '2024-05-24 10:45 AM', method: 'Credit Card', items: 'Espresso' },
    { id: 'TXN-8825', customer: 'Eva Green', amount: 15.00, status: 'refunded', date: '2024-05-24 09:15 AM', method: 'Credit Card', items: 'Matcha Latte, Cake' },
    { id: 'TXN-8826', customer: 'Frank White', amount: 9.50, status: 'completed', date: '2024-05-24 11:00 AM', method: 'Cash', items: 'Americano, Cookie' },
];

export const TransactionsPage: React.FC = () => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const getMethodKey = (method: string) => {
        switch (method) {
            case 'Credit Card': return 'creditCard';
            case 'Cash': return 'cash';
            case 'Digital Wallet': return 'digitalWallet';
            default: return 'cash';
        }
    };

    // Filter Logic
    const filteredTxns = MOCK_TRANSACTIONS.filter(txn => {
        const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) || txn.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalVolume = MOCK_TRANSACTIONS.reduce((sum, t) => t.status === 'completed' ? sum + t.amount : sum, 0);
    const successCount = MOCK_TRANSACTIONS.filter(t => t.status === 'completed').length;
    const refundCount = MOCK_TRANSACTIONS.filter(t => t.status === 'refunded').length;

    const handleExport = (format: string) => {
        exportData(filteredTxns, 'transactions_report', format as 'csv' | 'json');
        toast.success(t('dashboard.transactions.exportSuccess', { format: format.toUpperCase() }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
                        {t('dashboard.transactions.title')}
                    </h1>
                    <p className="text-coffee-500 dark:text-coffee-400 mt-1">{t('dashboard.transactions.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Select onValueChange={handleExport}>
                        <SelectTrigger className="w-[140px] bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700">
                            <div className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                <span className="text-sm">{t('dashboard.transactions.export')}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="csv">{t('dashboard.admin.exportFormats.csv')}</SelectItem>
                            <SelectItem value="json">{t('dashboard.admin.exportFormats.json')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{t('dashboard.transactions.totalVolume')}</p>
                        <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">{CURRENCY}{totalVolume.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{t('dashboard.transactions.successfulPayments')}</p>
                        <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">{successCount}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                        <ArrowDownRight className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{t('dashboard.transactions.refunds')}</p>
                        <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">{refundCount}</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee-400" />
                    <Input 
                        placeholder={t('dashboard.transactions.searchPlaceholder')}
                        className="pl-10 bg-white dark:bg-coffee-900 border-coffee-200 dark:border-coffee-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
                         <Button 
                            key={status}
                            variant={filterStatus === status ? 'primary' : 'outline'}
                            onClick={() => setFilterStatus(status)}
                            className={`capitalize whitespace-nowrap ${filterStatus === status ? 'bg-coffee-600 text-white' : 'bg-white dark:bg-coffee-900 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-800'}`}
                        >
                            {t(`dashboard.transactions.status.${status}`)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-coffee-100 dark:border-coffee-800">
                    <h3 className="font-bold text-coffee-900 dark:text-white">{t('dashboard.transactions.showingRecent', { count: filteredTxns.length })}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.transactions.id')}</th>
                                <th className="px-6 py-4">{t('dashboard.transactions.customer')}</th>
                                <th className="px-6 py-4">{t('dashboard.transactions.date')}</th>
                                <th className="px-6 py-4">{t('dashboard.transactions.amount')}</th>
                                <th className="px-6 py-4">{t('dashboard.transactions.payment')}</th>
                                <th className="px-6 py-4">{t('dashboard.inventory.status')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.inventory.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
                            {filteredTxns.length > 0 ? (
                                filteredTxns.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-coffee-600 dark:text-coffee-400 text-xs">
                                            {txn.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-coffee-900 dark:text-white">{txn.customer}</div>
                                            <div className="text-xs text-coffee-400 truncate max-w-[150px]">{txn.items}</div>
                                        </td>
                                        <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400 text-xs">
                                            {txn.date}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-coffee-900 dark:text-white">
                                            {CURRENCY}{txn.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400">
                                            {t(`dashboard.transactions.method.${getMethodKey(txn.method)}`)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                txn.status === 'completed' ? 'secondary' : // Using secondary (greenish in this theme usually) or default
                                                txn.status === 'failed' ? 'destructive' : 
                                                txn.status === 'refunded' ? 'outline' : 'warning'
                                            } className={`capitalize ${txn.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200' : ''}`}>
                                                {txn.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                {txn.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                                                {txn.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                                {t(`dashboard.transactions.status.${txn.status}`)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-coffee-400">
                                        <p>{t('dashboard.transactions.noTransactions')}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
