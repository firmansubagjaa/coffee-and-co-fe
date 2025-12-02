
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Mail, 
  MapPin, 
  UserPlus, 
  Filter,
  Check,
  Edit2
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../../components/ui/dialog";
import { toast } from 'sonner';
import { useAuthStore } from '../../../features/auth/store';
import { Role } from '@/types';
import { useLanguage } from '../../../contexts/LanguageContext';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: 'Active' | 'Inactive' | 'Suspended';
    lastActive: string;
    location: string;
    avatarColor: string;
}

// Initial Mock Data
const INITIAL_USERS: UserData[] = [
    { id: '1', name: 'Admin User', email: 'admin@coffee.co', role: 'admin', status: 'Active', lastActive: 'Just now', location: 'Jakarta, ID', avatarColor: '795548' },
    { id: '2', name: 'Sarah Barista', email: 'sarah.b@coffee.co', role: 'barista', status: 'Active', lastActive: '10 min ago', location: 'Bali, ID', avatarColor: 'D7CCC8' },
    { id: '3', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'Active', lastActive: '2 days ago', location: 'London, UK', avatarColor: '4E342E' },
    { id: '4', name: 'Mike Data', email: 'mike@analytics.io', role: 'data_analyst', status: 'Inactive', lastActive: '5 days ago', location: 'Singapore, SG', avatarColor: '1e40af' },
    { id: '5', name: 'Jane Smith', email: 'jane@example.com', role: 'customer', status: 'Suspended', lastActive: '1 month ago', location: 'New York, US', avatarColor: 'b91c1c' },
    { id: '6', name: 'Tom Brewer', email: 'tom@coffee.co', role: 'barista', status: 'Active', lastActive: '1 hour ago', location: 'Bandung, ID', avatarColor: '166534' },
    { id: '7', name: 'Super Admin', email: 'super@coffee.co', role: 'superadmin', status: 'Active', lastActive: 'Just now', location: 'Global', avatarColor: '000000' },
];

import { motion } from 'framer-motion';

export const UsersPage: React.FC = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    
    // Editing Role State
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Auto-filter based on URL query param (e.g. ?view=employees)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const view = params.get('view');
        
        if (view === 'employees') {
            // Filter mainly operational roles
            // We set a custom filter state that behaves slightly different from the Select dropdown
            // For simplicity in this demo, we'll just pre-set the dropdown if it matches, 
            // but complex "Employee" group filtering is done in the derived list below.
        }
    }, [location.search]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                              user.email.toLowerCase().includes(search.toLowerCase());
        
        // Custom URL Filter Logic
        const params = new URLSearchParams(location.search);
        const view = params.get('view');
        
        let matchesView = true;
        if (view === 'employees') {
            matchesView = ['admin', 'barista', 'superadmin', 'data_analyst'].includes(user.role);
        } else if (view === 'customers') {
            matchesView = user.role === 'customer';
        }

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole && matchesView;
    });

    const canEditUser = (targetUser: UserData) => {
        if (!currentUser) return false;
        if (currentUser.role === 'superadmin') return true;
        if (currentUser.role === 'admin') {
            // Admin cannot edit Superadmin or other Admins
            return !['superadmin', 'admin'].includes(targetUser.role);
        }
        return false;
    };

    const handleEditClick = (userToEdit: UserData) => {
        setEditingUser(userToEdit);
        setSelectedRole(userToEdit.role);
    };

    const saveRoleChange = () => {
        if (editingUser && selectedRole) {
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, role: selectedRole } : u));
            toast.success(t('dashboard.users.toast.updated', { name: editingUser.name }), { description: t('dashboard.users.toast.desc', { role: selectedRole.replace('_', ' ') }) });
            setEditingUser(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.4, 
            staggerChildren: 0.05 
          }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
                        {t('dashboard.users.title')}
                    </h1>
                    <p className="text-coffee-500 dark:text-coffee-400 mt-1">{t('dashboard.users.subtitle')}</p>
                </div>
                {currentUser?.role === 'superadmin' && (
                    <Button className="gap-2 shadow-lg">
                        <UserPlus className="w-4 h-4" /> {t('dashboard.users.addUser')}
                    </Button>
                )}
            </div>

            {/* Filters & Content */}
            <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-coffee-100 dark:border-coffee-800 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 dark:text-coffee-500" />
                        <Input 
                            placeholder={t('dashboard.users.searchPlaceholder')}
                            className="pl-10 bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[160px] bg-coffee-50/50 dark:bg-coffee-800/50 border-coffee-200 dark:border-coffee-700">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-coffee-500 dark:text-coffee-400" />
                                    <SelectValue placeholder={t('dashboard.users.filterRole')} />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('dashboard.users.allRoles')}</SelectItem>
                                <SelectItem value="admin">{t('common.roles.admin')}</SelectItem>
                                <SelectItem value="barista">{t('common.roles.barista')}</SelectItem>
                                <SelectItem value="data_analyst">{t('common.roles.data_analyst')}</SelectItem>
                                <SelectItem value="customer">{t('common.roles.customer')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider border-b border-coffee-100 dark:border-coffee-800">
                            <tr>
                                <th className="px-6 py-4">{t('dashboard.users.table.user')}</th>
                                <th className="px-6 py-4">{t('dashboard.users.table.role')}</th>
                                <th className="px-6 py-4">{t('dashboard.users.table.status')}</th>
                                <th className="px-6 py-4">{t('dashboard.users.table.location')}</th>
                                <th className="px-6 py-4">{t('dashboard.users.table.lastActive')}</th>
                                <th className="px-6 py-4 text-right">{t('dashboard.users.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-coffee-400">
                                        {t('dashboard.users.noUsers')}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <motion.tr 
                                        key={user.id} 
                                        variants={itemVariants}
                                        className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-coffee-100 dark:border-coffee-700">
                                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.avatarColor}&color=fff`} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-coffee-900 dark:text-white">{user.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-coffee-500 dark:text-coffee-400">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="capitalize bg-white dark:bg-coffee-800 text-coffee-700 dark:text-coffee-300 border-coffee-200 dark:border-coffee-700">
                                                {t(('common.roles.' + user.role) as any)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.status === 'Active' ? 'bg-green-50 text-green-700' :
                                                user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                                                'bg-red-50 text-red-700'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    user.status === 'Active' ? 'bg-green-500' :
                                                    user.status === 'Inactive' ? 'bg-gray-400' :
                                                    'bg-red-500'
                                                }`}></span>
                                                {t(('common.userStatus.' + user.status.toLowerCase()) as any)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-coffee-400" />
                                                {user.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-coffee-500 dark:text-coffee-400">
                                            {user.lastActive}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {canEditUser(user) && (
                                                <button 
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 text-coffee-400 dark:text-coffee-500 hover:text-coffee-900 dark:hover:text-white hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-lg transition-colors flex items-center gap-2 ml-auto"
                                                    title="Change Role"
                                                >
                                                    <span className="text-xs font-medium hidden group-hover:block">{t('dashboard.users.table.editRole')}</span>
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-coffee-100 dark:border-coffee-800 bg-coffee-50/30 dark:bg-coffee-800/30 text-xs text-coffee-400 text-center">
                    {t('dashboard.users.showing', { count: filteredUsers.length })}
                </div>
            </div>

            {/* Edit Role Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dashboard.users.dialog.title')}</DialogTitle>
                        <DialogDescription>
                            {t('dashboard.users.dialog.desc', { name: editingUser?.name })}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <label className="text-sm font-medium text-coffee-700 dark:text-coffee-300 mb-2 block">{t('dashboard.users.dialog.selectLabel')}</label>
                        <Select value={selectedRole || ''} onValueChange={(val) => setSelectedRole(val as Role)}>
                            <SelectTrigger className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white">
                                <SelectValue placeholder={t('dashboard.users.dialog.selectPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">{t('common.roles.customer')}</SelectItem>
                                <SelectItem value="barista">{t('common.roles.barista')}</SelectItem>
                                <SelectItem value="data_analyst">{t('common.roles.data_analyst')}</SelectItem>
                                <SelectItem value="admin">{t('common.roles.admin')}</SelectItem>
                                {/* Only Superadmin can promote to Superadmin */}
                                {currentUser?.role === 'superadmin' && (
                                    <SelectItem value="superadmin">{t('common.roles.superadmin')}</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-coffee-500 dark:text-coffee-400 mt-2 bg-coffee-50 dark:bg-coffee-800 p-2 rounded">
                            {t('dashboard.users.dialog.note')}
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditingUser(null)}>{t('dashboard.users.dialog.cancel')}</Button>
                        <Button onClick={saveRoleChange} className="gap-2">
                            <Check className="w-4 h-4" /> {t('dashboard.users.dialog.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};
