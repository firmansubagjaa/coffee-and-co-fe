
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
import { User, Shield, Mail, Edit2, Palette } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { cn } from '../../utils/cn';

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
    <div className="min-h-screen bg-white dark:bg-coffee-950 pt-4 pb-20">
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
            <div className="bg-cream-50 dark:bg-coffee-900 rounded-[2.5rem] p-8 border border-coffee-100 dark:border-coffee-800 flex flex-col items-center text-center shadow-sm sticky top-32">
              <Avatar className="h-32 w-32 mb-6 border-4 border-white dark:border-coffee-800 shadow-md">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${user.avatarColor || '795548'}&color=fff`} />
                <AvatarFallback className="text-3xl">{user.firstName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-1">{user.firstName} {user.lastName}</h2>
              <p className="text-coffee-500 dark:text-coffee-300 mb-6">{user.email}</p>

              {/* Avatar Color Picker */}
              <div className="w-full mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-coffee-400" />
                    <span className="text-xs font-bold text-coffee-400 uppercase tracking-wider">Avatar Appearance</span>
                </div>
                <div className="flex justify-center gap-2 flex-wrap mb-6">
                    {AVATAR_COLORS.map((c) => (
                        <button
                            key={c.hex}
                            onClick={() => handleColorChange(c.hex)}
                            className={cn(
                                "w-6 h-6 rounded-full border border-white dark:border-coffee-800 shadow-sm transition-transform",
                                user.avatarColor === c.hex ? "ring-2 ring-coffee-400 ring-offset-2" : ""
                            )}
                            style={{ backgroundColor: `#${c.hex}` }}
                            title={c.name}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs font-bold text-coffee-400 uppercase tracking-wider">App Theme</span>
                </div>
                <div className="flex justify-center">
                    <ThemeToggle />
                </div>
              </div>

              <div className="w-full bg-white dark:bg-coffee-800 rounded-2xl p-4 border border-coffee-50 dark:border-coffee-700 flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                        <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-coffee-800 dark:text-coffee-200">Account Role</span>
                 </div>
                 <span className="text-xs font-bold bg-coffee-100 dark:bg-coffee-950 text-coffee-800 dark:text-coffee-200 px-3 py-1 rounded-full uppercase tracking-wider">
                    {user.role}
                 </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3">
             <div className="bg-white dark:bg-coffee-900 rounded-[2.5rem] p-8 md:p-10 border border-coffee-100 dark:border-coffee-800 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-coffee-50 dark:border-coffee-800">
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-coffee-600 dark:text-coffee-400" />
                        <h3 className="text-xl font-serif font-bold text-coffee-900 dark:text-white">Contact Information</h3>
                    </div>
                    {/* Visual Edit Indicator (Non-functional, form is always editable) */}
                    <span className="text-sm font-medium text-coffee-500 dark:text-coffee-400 flex items-center gap-1">
                        Edit Mode <Edit2 className="w-3 h-3" />
                    </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                   
                   {/* Name Row */}
                   <div className="space-y-2">
                        <Label htmlFor="fullName" className={errors.fullName ? "text-red-500" : ""}>Full Name</Label>
                        <Input 
                            id="fullName"
                            {...register("fullName")}
                            readOnly
                            className={cn(
                                "bg-gray-100 dark:bg-coffee-800/50 cursor-not-allowed opacity-80",
                                errors.fullName && "border-red-500 focus-visible:ring-red-400"
                            )}
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                   </div>

                   {/* Contact Row */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="mobile" className={errors.mobile ? "text-red-500" : ""}>Mobile</Label>
                            <Input 
                                id="mobile"
                                {...register("mobile")}
                                className={cn(errors.mobile && "border-red-500 focus-visible:ring-red-400")}
                            />
                            {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
                        </div>
                        <div className="space-y-2 opacity-80 pointer-events-none cursor-not-allowed">
                            <Label htmlFor="email">Email (Read Only)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                                <Input 
                                    id="email"
                                    value={user.email}
                                    readOnly
                                    className="pl-10 bg-coffee-50/50 dark:bg-coffee-800/50 border-transparent dark:text-coffee-300"
                                />
                            </div>
                        </div>
                   </div>

                   <div className="border-t border-coffee-50 dark:border-coffee-800 my-2"></div>

                   {/* Location Row */}
                   <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="address" className={errors.address ? "text-red-500" : ""}>Delivery Address</Label>
                            <Input 
                                id="address"
                                {...register("address")}
                                className={cn(errors.address && "border-red-500 focus-visible:ring-red-400")}
                            />
                            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deliveryNote" className={errors.deliveryNote ? "text-red-500" : ""}>Delivery Note (Optional)</Label>
                            <Input 
                                id="deliveryNote"
                                {...register("deliveryNote")}
                                placeholder="e.g. Leave at front door, Gate code 1234"
                                className={cn(errors.deliveryNote && "border-red-500 focus-visible:ring-red-400")}
                            />
                            {errors.deliveryNote && <p className="text-xs text-red-500">{errors.deliveryNote.message}</p>}
                        </div>
                   </div>

                   <div className="pt-6 flex items-center gap-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading || !isDirty}
                        className="shadow-lg px-8"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      
                      {!isDirty && (
                          <span className="text-sm text-coffee-400 italic">No changes made</span>
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