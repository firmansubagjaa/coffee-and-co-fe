
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  MoreHorizontal,
  Download,
  RefreshCw,
  Box
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
import { toast } from 'sonner';
import { exportData } from '../../../utils/export';
import { useLanguage } from '../../../contexts/LanguageContext';

// --- Types ---
interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    stockLevel: number;
    unit: string;
    parLevel: number;
    costPerUnit: number;
    supplier: string;
    lastRestock: string;
    status: 'optimal' | 'low' | 'critical';
}

// --- Mock Data ---
const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv_1', name: 'Arabica Beans (Premium)', sku: 'BEAN-001', category: 'Coffee Beans', stockLevel: 45, unit: 'kg', parLevel: 20, costPerUnit: 18.50, supplier: 'Global Coffee Co.', lastRestock: '2024-05-20', status: 'optimal' },
    { id: 'inv_2', name: 'Oat Milk (Barista)', sku: 'MILK-002', category: 'Dairy & Alternatives', stockLevel: 12, unit: 'L', parLevel: 15, costPerUnit: 4.20, supplier: 'Oatly', lastRestock: '2024-05-22', status: 'low' },
    { id: 'inv_3', name: 'Paper Cups (12oz)', sku: 'PKG-103', category: 'Packaging', stockLevel: 850, unit: 'pcs', parLevel: 500, costPerUnit: 0.15, supplier: 'EcoPack', lastRestock: '2024-05-10', status: 'optimal' },
    { id: 'inv_4', name: 'Vanilla Syrup', sku: 'SYR-201', category: 'Syrups', stockLevel: 2, unit: 'btl', parLevel: 5, costPerUnit: 12.00, supplier: 'Monin', lastRestock: '2024-04-28', status: 'critical' },
    { id: 'inv_5', name: 'Croissants (Frozen)', sku: 'FOOD-301', category: 'Food', stockLevel: 24, unit: 'pcs', parLevel: 30, costPerUnit: 1.50, supplier: 'Bakery Supplies', lastRestock: '2024-05-23', status: 'low' },
];

export const InventoryPage: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'critical'>('all');

    // Filter Logic
    const filteredItems = MOCK_INVENTORY.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalValuation = MOCK_INVENTORY.reduce((sum, item) => sum + (item.stockLevel * item.costPerUnit), 0);
    const lowStockCount = MOCK_INVENTORY.filter(i => i.status === 'low' || i.status === 'critical').length;

    const handleRestockRequest = (itemName: string) => {
        toast.success(t('dashboard.inventory.restockSuccess'), {
            description: t('dashboard.inventory.toast.orderInitiated', { itemName })
        });
    };

    const handleExport = () => {
        exportData(filteredItems, 'inventory_report', 'csv');
        toast.success(t('dashboard.inventory.exportSuccess'));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
                        <Box className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
                        {t('dashboard.inventory.title')}
                    </h1>
                    <p className="text-coffee-500 dark:text-coffee-400 mt-1">{t('dashboard.inventory.subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExport} className="bg-white dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-700">
                        <Download className="w-4 h-4 mr-2" /> {t('dashboard.inventory.report')}
                    </Button>
                    <Button onClick={() => navigate('/dashboard/inventory/new')} className="bg-coffee-600 hover:bg-coffee-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> {t('dashboard.inventory.addItem')}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                        <DollarSignIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{t('dashboard.inventory.totalValuation')}</p>
                        <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">{CURRENCY}{totalValuation.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{t('dashboard.inventory.totalItems')}</p>
                        <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">{MOCK_INVENTORY.length}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{t('dashboard.inventory.restockNeeded')}</p>
                        <h3 className="text-2xl font-bold text-coffee-900 dark:text-white">{lowStockCount} Items</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee-400" />
                    <Input 
                        placeholder={t('dashboard.inventory.searchPlaceholder')}
                        className="pl-10 bg-white dark:bg-coffee-900 border-coffee-200 dark:border-coffee-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant={filterStatus === 'all' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('all')}
                        className={filterStatus === 'all' ? 'bg-coffee-600 text-white' : 'bg-white dark:bg-coffee-900 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-800'}
                    >
                        {t('dashboard.inventory.filters.all')}
                    </Button>
                    <Button 
                        variant={filterStatus === 'low' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('low')}
                        className={filterStatus === 'low' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-coffee-900 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-800'}
                    >
                        {t('dashboard.inventory.filters.lowStock')}
                    </Button>
                    <Button 
                        variant={filterStatus === 'critical' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('critical')}
                        className={filterStatus === 'critical' ? 'bg-red-500 text-white' : 'bg-white dark:bg-coffee-900 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-800'}
                    >
                        {t('dashboard.inventory.filters.critical')}
                    </Button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider border-b border-coffee-100 dark:border-coffee-800">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.inventory.itemDetails')}</th>
                                <th className="px-6 py-4">{t('dashboard.inventory.category')}</th>
                                <th className="px-6 py-4">{t('dashboard.inventory.stockLevel')}</th>
                                <th className="px-6 py-4">{t('dashboard.inventory.value')}</th>
                                <th className="px-6 py-4">{t('dashboard.inventory.supplier')}</th>
                                <th className="px-6 py-4">{t('dashboard.inventory.status')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.inventory.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-coffee-900 dark:text-white">{item.name}</div>
                                            <div className="text-xs text-coffee-400 font-mono">{item.sku}</div>
                                        </td>
                                        <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400">
                                            <Badge variant="outline" className="bg-white dark:bg-coffee-800 dark:text-coffee-300 dark:border-coffee-700">{item.category}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-coffee-900 dark:text-white">{item.stockLevel} <span className="text-xs font-normal text-coffee-400">{item.unit}</span></span>
                                                {item.stockLevel <= item.parLevel && (
                                                    <span className="text-xs text-red-500 font-bold">{t('dashboard.inventory.parLevel', { level: item.parLevel })}</span>
                                                )}
                                            </div>
                                            <div className="w-24 h-1.5 bg-coffee-100 dark:bg-coffee-800 rounded-full mt-1.5 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        item.status === 'critical' ? 'bg-red-500' : 
                                                        item.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`} 
                                                    style={{ width: `${Math.min((item.stockLevel / (item.parLevel * 2)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-coffee-600 dark:text-coffee-400">
                                            {CURRENCY}{(item.stockLevel * item.costPerUnit).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400">
                                            {item.supplier}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                item.status === 'critical' ? 'destructive' : 
                                                item.status === 'low' ? 'warning' : 'secondary'
                                            } className="capitalize">
                                                {t(`dashboard.inventory.statusLevels.${item.status}`)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('dashboard.inventory.action')}</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleRestockRequest(item.name)}>
                                                        <RefreshCw className="mr-2 h-4 w-4" /> {t('dashboard.inventory.restock')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>{t('dashboard.inventory.actions.viewHistory')}</DropdownMenuItem>
                                                    <DropdownMenuItem>{t('dashboard.inventory.actions.editItem')}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-coffee-400">
                                        <Package className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                        <p>{t('dashboard.inventory.noItems')}</p>
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

// Helper Icon Component
function DollarSignIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
};

