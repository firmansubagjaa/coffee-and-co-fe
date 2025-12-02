
import React from 'react';
import { useAuthStore } from '../../features/auth/store';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "../../components/ui/Breadcrumb";
import { User, Shield, Mail, Edit2, Palette, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { cn } from '../../utils/cn';
import { SEO } from '@/components/common/SEO';

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
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const { 
    register, 
    handleSubmit,
    control,
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
      // Split name for backward compatibility if needed, or just update name
      const nameParts = data.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      await updateProfile({
        ...data,
        firstName,
        lastName,
        name: data.fullName
      });
      toast.success("Profile updated", {
        description: "Your contact information has been saved."
      });
    } catch (error) {
      toast.error("Update failed", {
        description: "Something went wrong. Please try again."
      });
    }
  };

  const handleColorChange = async (color: string) => {
    try {
        await updateProfile({ avatarColor: color });
        toast.success("Avatar updated", { description: "Your profile color looks great!" });
    } catch (error) {
        toast.error("Failed to update avatar");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6">
      <SEO 
        title="Account Settings" 
        description="Manage your profile, preferences, and account security. Update your personal information and customize your Coffee & Co experience."
      />
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-8">
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

        <h1 className="text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-8">Account Settings</h1>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl">
          
          {/* Profile Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-cream-50 dark:bg-coffee-900 rounded-[2.5rem] p-8 border border-coffee-100 dark:border-coffee-800 flex flex-col items-center text-center shadow-lg sticky top-32 overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-6 border-4 border-white dark:border-coffee-800 shadow-xl ring-4 ring-coffee-50 dark:ring-coffee-800/50">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${user.avatarColor || '795548'}&color=fff`} />
                    <AvatarFallback className="text-3xl font-serif">{user.firstName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-3xl font-serif font-bold text-coffee-900 dark:text-white mb-1 tracking-tight">{user.firstName} {user.lastName}</h2>
                  <p className="text-coffee-500 dark:text-coffee-300 mb-8 font-medium">{user.email}</p>

                  {/* Avatar Color Picker */}
                  <div className="w-full mb-8 bg-white/50 dark:bg-black/20 p-6 rounded-3xl backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Palette className="w-4 h-4 text-coffee-400" />
                        <span className="text-xs font-bold text-coffee-400 uppercase tracking-wider">Avatar Appearance</span>
                    </div>
                    <div className="flex justify-center gap-3 flex-wrap mb-6">
                        {AVATAR_COLORS.map((c) => (
                            <button
                                key={c.hex}
                                onClick={() => handleColorChange(c.hex)}
                                className={cn(
                                    "w-8 h-8 rounded-full border-2 border-white dark:border-coffee-800 shadow-sm transition-all hover:scale-110",
                                    user.avatarColor === c.hex ? "ring-2 ring-coffee-400 ring-offset-2 scale-110" : ""
                                )}
                                style={{ backgroundColor: `#${c.hex}` }}
                                title={c.name}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-3 pt-4 border-t border-coffee-100 dark:border-coffee-700/50">
                        <span className="text-xs font-bold text-coffee-400 uppercase tracking-wider">App Theme</span>
                    </div>
                    <div className="flex justify-center">
                        <ThemeToggle />
                    </div>
                  </div>

                  <div className="w-full bg-white dark:bg-coffee-800 rounded-2xl p-4 border border-coffee-50 dark:border-coffee-700 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600 dark:text-yellow-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-coffee-800 dark:text-coffee-200">Account Role</span>
                     </div>
                     <span className="text-xs font-bold bg-coffee-100 dark:bg-coffee-950 text-coffee-800 dark:text-coffee-200 px-4 py-1.5 rounded-full uppercase tracking-wider border border-coffee-200 dark:border-coffee-700">
                        {user.role}
                     </span>
                  </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3">
             <div className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-8 md:p-12 border border-coffee-100 dark:border-coffee-800 shadow-lg">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-coffee-50 dark:border-coffee-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-coffee-100 dark:bg-coffee-800 rounded-2xl">
                            <User className="w-6 h-6 text-coffee-900 dark:text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white">Contact Information</h3>
                            <p className="text-sm text-coffee-500 dark:text-coffee-400">Manage your personal details and delivery preferences</p>
                        </div>
                    </div>
                    {/* Visual Edit Indicator */}
                    <span className="hidden md:flex text-xs font-bold text-coffee-400 uppercase tracking-widest items-center gap-2 bg-coffee-50 dark:bg-coffee-800 px-4 py-2 rounded-full">
                        Editable <Edit2 className="w-3 h-3" />
                    </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                   
                   {/* Name Row */}
                   <div className="space-y-3">
                        <Label htmlFor="fullName" className={cn("text-base font-medium pl-1", errors.fullName ? "text-red-500" : "text-coffee-700 dark:text-coffee-200")}>Full Name</Label>
                        <Input 
                            id="fullName"
                            {...register("fullName")}
                            readOnly
                            className={cn(
                                "h-14 rounded-2xl bg-gray-50 dark:bg-coffee-800/50 border-gray-200 dark:border-coffee-700 text-lg cursor-not-allowed opacity-70",
                                errors.fullName && "border-red-500 focus-visible:ring-red-400"
                            )}
                        />
                        {errors.fullName && <p className="text-sm text-red-500 pl-1">{errors.fullName.message}</p>}
                   </div>

                   {/* Contact Row */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="mobile" className={cn("text-base font-medium pl-1", errors.mobile ? "text-red-500" : "text-coffee-700 dark:text-coffee-200")}>Mobile Number</Label>
                            <Input 
                                id="mobile"
                                {...register("mobile")}
                                className={cn(
                                    "h-14 rounded-2xl bg-white dark:bg-coffee-900 border-coffee-200 dark:border-coffee-700 text-lg focus:ring-2 focus:ring-coffee-400 focus:border-transparent transition-all",
                                    errors.mobile && "border-red-500 focus-visible:ring-red-400"
                                )}
                            />
                            {errors.mobile && <p className="text-sm text-red-500 pl-1">{errors.mobile.message}</p>}
                        </div>
                        <div className="space-y-3 opacity-70 pointer-events-none cursor-not-allowed">
                            <Label htmlFor="email" className="text-base font-medium pl-1 text-coffee-700 dark:text-coffee-200">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coffee-400" />
                                <Input 
                                    id="email"
                                    value={user.email}
                                    readOnly
                                    className="h-14 pl-12 rounded-2xl bg-gray-50 dark:bg-coffee-800/50 border-transparent text-lg text-coffee-500 dark:text-coffee-400"
                                />
                            </div>
                        </div>
                   </div>

                   <div className="border-t border-coffee-50 dark:border-coffee-800 my-4"></div>

                   {/* Location Row */}
                   <div className="space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="address" className={cn("text-base font-medium pl-1", errors.address ? "text-red-500" : "text-coffee-700 dark:text-coffee-200")}>Delivery Address</Label>
                            <Input 
                                id="address"
                                {...register("address")}
                                className={cn(
                                    "h-14 rounded-2xl bg-white dark:bg-coffee-900 border-coffee-200 dark:border-coffee-700 text-lg focus:ring-2 focus:ring-coffee-400 focus:border-transparent transition-all",
                                    errors.address && "border-red-500 focus-visible:ring-red-400"
                                )}
                            />
                            {errors.address && <p className="text-sm text-red-500 pl-1">{errors.address.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="deliveryNote" className={cn("text-base font-medium pl-1", errors.deliveryNote ? "text-red-500" : "text-coffee-700 dark:text-coffee-200")}>Delivery Note (Optional)</Label>
                            <Input 
                                id="deliveryNote"
                                {...register("deliveryNote")}
                                placeholder="e.g. Leave at front door, Gate code 1234"
                                className={cn(
                                    "h-14 rounded-2xl bg-white dark:bg-coffee-900 border-coffee-200 dark:border-coffee-700 text-lg focus:ring-2 focus:ring-coffee-400 focus:border-transparent transition-all",
                                    errors.deliveryNote && "border-red-500 focus-visible:ring-red-400"
                                )}
                            />
                            {errors.deliveryNote && <p className="text-sm text-red-500 pl-1">{errors.deliveryNote.message}</p>}
                        </div>
                   </div>

                   <div className="pt-8 flex items-center gap-6">
                      <Button 
                        type="submit" 
                        size="lg"
                        disabled={isLoading || !isDirty}
                        className="shadow-xl px-10 rounded-full h-14 text-lg font-bold hover:scale-105 transition-transform"
                      >
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                      </Button>
                      
                      {!isDirty && (
                          <span className="text-sm font-medium text-coffee-400 italic flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              All changes saved
                          </span>
                      )}
                   </div>
                </form>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};