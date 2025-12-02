import React from 'react';
import { useAuthStore } from '../../features/auth/store';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  User, 
  Shield, 
  Mail, 
  Edit2, 
  Palette, 
  CheckCircle, 
  ChevronRight, 
  Bell, 
  Lock, 
  HelpCircle, 
  LogOut,
  MapPin,
  Phone,
  Camera
} from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { cn } from '../../utils/cn';
import { SEO } from '@/components/common/SEO';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "../../components/ui/Breadcrumb";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  mobile: z.string().min(10, "Mobile number invalid"),
  address: z.string().min(5, "Address is too short"),
  deliveryNote: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AVATAR_COLORS = [
    { name: 'Coffee', hex: '795548' },
    { name: 'Cream', hex: 'D7CCC8' },
    { name: 'Mocha', hex: '4E342E' },
    { name: 'Matcha', hex: '166534' },
    { name: 'Blue', hex: '1e40af' },
    { name: 'Red', hex: 'b91c1c' },
];

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, isLoading, logout } = useAuthStore();
  
  const { 
    register, 
    handleSubmit,
    formState: { errors, isDirty } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || `${user?.firstName} ${user?.lastName}`.trim(),
      mobile: user?.mobile || '',
      address: user?.address || '',
      deliveryNote: user?.deliveryNote || '',
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const nameParts = data.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      await updateProfile({
        ...data,
        firstName,
        lastName,
        name: data.fullName
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleColorChange = async (color: string) => {
    try {
        await updateProfile({ avatarColor: color });
        toast.success("Avatar updated");
    } catch (error) {
        toast.error("Failed to update avatar");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO title="Settings" description="Manage your account settings." />
      
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink to="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-8">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Profile Card (Sticky on Desktop) */}
            <div className="w-full lg:w-1/3">
                <div className="bg-white dark:bg-[#3C2A21] rounded-[2.5rem] p-8 border border-coffee-100 dark:border-none shadow-lg sticky top-24">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-6 group cursor-pointer">
                            <Avatar className="h-32 w-32 border-4 border-coffee-50 dark:border-white/10 shadow-xl">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${user.avatarColor || '795548'}&color=fff`} />
                                <AvatarFallback className="text-4xl font-serif">{user.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-coffee-900 dark:text-white mb-1">{user.firstName} {user.lastName}</h2>
                        <p className="text-coffee-500 dark:text-white/60 mb-6">{user.email}</p>

                        <div className="flex gap-3 mb-8">
                            {AVATAR_COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => handleColorChange(c.hex)}
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-white dark:border-white/20 shadow-sm transition-transform hover:scale-110",
                                        user.avatarColor === c.hex && "ring-2 ring-offset-2 ring-coffee-400 scale-110"
                                    )}
                                    style={{ backgroundColor: `#${c.hex}` }}
                                />
                            ))}
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between p-4 bg-coffee-50 dark:bg-black/20 rounded-2xl">
                                <span className="text-sm font-medium text-coffee-600 dark:text-white/80">Member Role</span>
                                <span className="text-xs font-bold bg-white dark:bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider text-coffee-900 dark:text-white border border-coffee-100 dark:border-none">
                                    {user.role}
                                </span>
                            </div>
                            
                            <button 
                                onClick={logout}
                                className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Settings Forms */}
            <div className="w-full lg:w-2/3 space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Account Settings Group */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-coffee-500 dark:text-white/40 uppercase tracking-wider ml-4">Personal Information</h3>
                        <div className="bg-white dark:bg-[#3C2A21] rounded-[2.5rem] overflow-hidden shadow-sm border border-coffee-100 dark:border-none divide-y divide-coffee-50 dark:divide-white/5">
                            
                            {/* Name Input */}
                            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:bg-coffee-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 md:w-1/3">
                                    <div className="p-2.5 bg-coffee-100 dark:bg-white/10 rounded-xl text-coffee-900 dark:text-white">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Label htmlFor="fullName" className="text-base font-medium text-coffee-900 dark:text-white cursor-pointer">Full Name</Label>
                                </div>
                                <div className="flex-1">
                                    <Input 
                                        id="fullName"
                                        {...register("fullName")}
                                        className="h-10 p-0 border-none bg-transparent text-base text-coffee-600 dark:text-white/80 placeholder:text-coffee-300 focus-visible:ring-0 md:text-right"
                                    />
                                </div>
                            </div>

                            {/* Mobile Input */}
                            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:bg-coffee-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 md:w-1/3">
                                    <div className="p-2.5 bg-coffee-100 dark:bg-white/10 rounded-xl text-coffee-900 dark:text-white">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <Label htmlFor="mobile" className="text-base font-medium text-coffee-900 dark:text-white cursor-pointer">Mobile</Label>
                                </div>
                                <div className="flex-1">
                                    <Input 
                                        id="mobile"
                                        {...register("mobile")}
                                        className="h-10 p-0 border-none bg-transparent text-base text-coffee-600 dark:text-white/80 placeholder:text-coffee-300 focus-visible:ring-0 md:text-right"
                                    />
                                </div>
                            </div>

                             {/* Address Input */}
                             <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:bg-coffee-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4 md:w-1/3">
                                    <div className="p-2.5 bg-coffee-100 dark:bg-white/10 rounded-xl text-coffee-900 dark:text-white">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <Label htmlFor="address" className="text-base font-medium text-coffee-900 dark:text-white cursor-pointer">Address</Label>
                                </div>
                                <div className="flex-1">
                                    <Input 
                                        id="address"
                                        {...register("address")}
                                        className="h-10 p-0 border-none bg-transparent text-base text-coffee-600 dark:text-white/80 placeholder:text-coffee-300 focus-visible:ring-0 md:text-right"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* App Settings Group */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-coffee-500 dark:text-white/40 uppercase tracking-wider ml-4">Preferences</h3>
                        <div className="bg-white dark:bg-[#3C2A21] rounded-[2.5rem] overflow-hidden shadow-sm border border-coffee-100 dark:border-none divide-y divide-coffee-50 dark:divide-white/5">
                            
                            <div className="p-6 md:p-8 flex items-center justify-between hover:bg-coffee-50/50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-coffee-100 dark:bg-white/10 rounded-xl text-coffee-900 dark:text-white">
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <span className="text-base font-medium text-coffee-900 dark:text-white">Appearance</span>
                                </div>
                                <ThemeToggle />
                            </div>

                            <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-coffee-50/50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-coffee-100 dark:bg-white/10 rounded-xl text-coffee-900 dark:text-white">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <span className="text-base font-medium text-coffee-900 dark:text-white">Notifications</span>
                                </div>
                                <div className="flex items-center gap-2 text-coffee-400 group-hover:text-coffee-600 dark:group-hover:text-white transition-colors">
                                    <span className="text-sm">On</span>
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-coffee-50/50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-coffee-100 dark:bg-white/10 rounded-xl text-coffee-900 dark:text-white">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <span className="text-base font-medium text-coffee-900 dark:text-white">Privacy & Security</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-coffee-400 group-hover:text-coffee-600 dark:group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button 
                            type="submit" 
                            size="lg"
                            disabled={isLoading || !isDirty}
                            className="w-full md:w-auto rounded-xl font-bold h-14 px-12 shadow-xl text-lg hover:scale-105 transition-transform"
                        >
                            {isLoading ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};