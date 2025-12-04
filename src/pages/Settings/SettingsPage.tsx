import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../features/auth/store";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { AvatarUpload } from "../../components/ui/AvatarUpload";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Shield,
  Mail,
  Palette,
  ChevronRight,
  Bell,
  Lock,
  LogOut,
  MapPin,
  Phone,
  CreditCard,
  Smartphone,
  Check,
  Languages,
  Settings,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { cn } from "../../utils/cn";
import { SEO } from "@/components/common/SEO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";

// ============ Schemas ============
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobile: z.string().optional(),
  address: z.string().optional(),
  deliveryNote: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ============ Sub-components ============

// Settings Section Wrapper
const SettingsSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
  index?: number;
}> = ({ title, icon, description, children, danger, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="space-y-4"
  >
    <div className="flex items-center gap-3 px-1">
      <div
        className={cn(
          "p-2 rounded-xl",
          danger
            ? "bg-error/10 text-error"
            : "bg-coffee-100 dark:bg-coffee-800 text-coffee-900 dark:text-white"
        )}
      >
        {icon}
      </div>
      <div>
        <h3
          className={cn(
            "text-lg font-serif font-bold",
            danger ? "text-error" : "text-coffee-900 dark:text-white"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-coffee-500 dark:text-white/50">
            {description}
          </p>
        )}
      </div>
    </div>
    <div className="bg-white dark:bg-[#3C2A21] rounded-[2rem] overflow-hidden shadow-sm border border-coffee-100 dark:border-none">
      {children}
    </div>
  </motion.div>
);

// Settings Row Item
const SettingsItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  showArrow?: boolean;
  children?: React.ReactNode;
}> = ({ icon, label, value, onClick, danger, showArrow = true, children }) => (
  <div
    onClick={onClick}
    className={cn(
      "p-5 flex items-center justify-between gap-4 transition-all duration-200",
      "border-b border-coffee-50 dark:border-white/5 last:border-b-0",
      onClick &&
        "cursor-pointer hover:bg-coffee-50/50 dark:hover:bg-white/5 active:scale-[0.99]",
      danger && "text-error"
    )}
  >
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div
        className={cn(
          "p-2.5 rounded-xl shrink-0 transition-colors",
          danger
            ? "bg-error/10 text-error"
            : "bg-coffee-100 dark:bg-white/10 text-coffee-700 dark:text-white"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-base font-medium truncate",
          danger ? "text-error" : "text-coffee-900 dark:text-white"
        )}
      >
        {label}
      </span>
    </div>

    {children ? (
      children
    ) : (
      <div className="flex items-center gap-2 shrink-0">
        {value && (
          <span className="text-sm text-coffee-500 dark:text-white/50 truncate max-w-[150px]">
            {value}
          </span>
        )}
        {onClick && showArrow && (
          <ChevronRight
            className={cn(
              "w-5 h-5 transition-transform group-hover:translate-x-0.5",
              danger ? "text-error/70" : "text-coffee-300 dark:text-white/30"
            )}
          />
        )}
      </div>
    )}
  </div>
);

// ============ Main Component ============
export const SettingsPage: React.FC = () => {
  const { user, updateProfile, isLoading, logout } = useAuthStore();

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Local avatar state for preview (no backend integration yet)
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

  // Notification settings
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    pushNotifications: true,
  });

  // Language setting
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Forms
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      mobile: user?.mobile || "",
      address: user?.address || "",
      deliveryNote: user?.deliveryNote || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handlers
  const handleAvatarChange = async (blob: Blob | null) => {
    // Frontend only - just update local state for preview
    if (blob) {
      const url = URL.createObjectURL(blob);
      setLocalAvatarUrl(url);
      // Simulate success
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      setLocalAvatarUrl(null);
    }
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        ...data,
        name: `${data.firstName} ${data.lastName}`,
      });
      toast.success("Profile updated successfully");
      setShowEditProfile(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      // Simulate password change (frontend only)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password changed successfully");
      setShowChangePassword(false);
      passwordForm.reset();
    } catch {
      toast.error("Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate delete (frontend only)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Account deleted");
      logout();
    } catch {
      toast.error("Failed to delete account");
    }
  };

  if (!user) return null;

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  // Use local avatar if set, otherwise fall back to default
  const displayAvatar =
    localAvatarUrl ||
    `https://ui-avatars.com/api/?name=${user.firstName}+${
      user.lastName
    }&background=${user.avatarColor || "795548"}&color=fff&size=200`;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO title="Settings" description="Manage your account settings." />

      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
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

        {/* Header - Consistent with RewardsPage */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-coffee-500 dark:text-white/60">
              Manage your account preferences and security.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-coffee-800 px-4 py-2 rounded-full shadow-sm border border-coffee-100 dark:border-white/10 self-start md:self-auto">
            <Settings className="w-5 h-5 text-coffee-600 dark:text-white" />
            <span className="font-medium text-sm text-coffee-900 dark:text-white">
              {user?.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Section - Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-coffee-700 to-coffee-900 dark:from-coffee-800 dark:to-coffee-950 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl text-white"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
              <User className="w-64 h-64" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <AvatarUpload
                currentAvatar={displayAvatar}
                fallbackText={user.firstName}
                fallbackColor={user.avatarColor}
                size="xl"
                onAvatarChange={handleAvatarChange}
              />
              <h2 className="text-2xl md:text-3xl font-bold mt-4 drop-shadow-sm">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-white/70 text-sm mt-1">{user.email}</p>
              <span className="mt-3 text-xs font-bold bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                {user.role}
              </span>
            </div>
          </motion.div>

          {/* Profile Details */}
          <SettingsSection
            title="Profile"
            icon={<User className="w-5 h-5" />}
            index={1}
          >
            <SettingsItem
              icon={<User className="w-5 h-5" />}
              label="Edit Profile"
              value={`${user.firstName} ${user.lastName}`}
              onClick={() => setShowEditProfile(true)}
            />
            <SettingsItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={user.email}
              showArrow={false}
            />
            <SettingsItem
              icon={<Phone className="w-5 h-5" />}
              label="Phone"
              value={user.mobile || "Not set"}
              onClick={() => setShowEditProfile(true)}
            />
            <SettingsItem
              icon={<MapPin className="w-5 h-5" />}
              label="Address"
              value={user.address || "Not set"}
              onClick={() => setShowEditProfile(true)}
            />
          </SettingsSection>

          {/* Preferences */}
          <SettingsSection
            title="Preferences"
            icon={<Palette className="w-5 h-5" />}
            index={2}
          >
            <SettingsItem
              icon={<Palette className="w-5 h-5" />}
              label="Appearance"
              showArrow={false}
            >
              <ThemeToggle />
            </SettingsItem>
            <SettingsItem
              icon={<Languages className="w-5 h-5" />}
              label="Language"
              value={languages.find((l) => l.code === selectedLanguage)?.name}
              onClick={() => setShowLanguage(true)}
            />
            <SettingsItem
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              value={notifications.pushNotifications ? "On" : "Off"}
              onClick={() => setShowNotifications(true)}
            />
          </SettingsSection>

          {/* Security */}
          <SettingsSection
            title="Security"
            icon={<Shield className="w-5 h-5" />}
            index={3}
          >
            <SettingsItem
              icon={<Lock className="w-5 h-5" />}
              label="Change Password"
              onClick={() => setShowChangePassword(true)}
            />
            <SettingsItem
              icon={<Smartphone className="w-5 h-5" />}
              label="Two-Factor Authentication"
              value="Off"
              onClick={() => toast.info("Coming soon!")}
            />
            <SettingsItem
              icon={<Shield className="w-5 h-5" />}
              label="Login Activity"
              onClick={() => toast.info("Coming soon!")}
            />
          </SettingsSection>

          {/* Payment */}
          <SettingsSection
            title="Payment"
            icon={<CreditCard className="w-5 h-5" />}
            index={4}
          >
            <SettingsItem
              icon={<CreditCard className="w-5 h-5" />}
              label="Payment Methods"
              value="2 cards"
              onClick={() => toast.info("Coming soon!")}
            />
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection
            title="Danger Zone"
            icon={<Trash2 className="w-5 h-5" />}
            description="Irreversible actions"
            danger
            index={5}
          >
            <SettingsItem
              icon={<Trash2 className="w-5 h-5" />}
              label="Delete Account"
              onClick={() => setShowDeleteAccount(true)}
              danger
            />
          </SettingsSection>
        </div>
      </div>

      {/* ============ Modals ============ */}

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-coffee-600 to-coffee-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-white">
                Edit Profile
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Update your personal information
              </DialogDescription>
            </DialogHeader>
          </div>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...profileForm.register("firstName")}
                  className="h-12 rounded-xl"
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-error text-sm">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...profileForm.register("lastName")}
                  className="h-12 rounded-xl"
                />
                {profileForm.formState.errors.lastName && (
                  <p className="text-error text-sm">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <Input
                id="mobile"
                type="tel"
                {...profileForm.register("mobile")}
                placeholder="+62 xxx xxxx xxxx"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...profileForm.register("address")}
                placeholder="Enter your address"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryNote">Delivery Note</Label>
              <Input
                id="deliveryNote"
                {...profileForm.register("deliveryNote")}
                placeholder="e.g., Leave at front door"
                className="h-12 rounded-xl"
              />
            </div>
            <DialogFooter className="gap-3 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProfile(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-coffee-600 to-coffee-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-white">
                Change Password
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="p-6 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register("currentPassword")}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
                className="h-12 rounded-xl"
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-error text-sm">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
                className="h-12 rounded-xl"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-error text-sm">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <DialogFooter className="gap-3 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowChangePassword(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="rounded-xl">
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-coffee-600 to-coffee-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-white">
                Notification Settings
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Choose what updates you want to receive
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-4 space-y-1">
            {[
              {
                key: "orderUpdates",
                label: "Order Updates",
                desc: "Get notified about your order status",
              },
              {
                key: "promotions",
                label: "Promotions",
                desc: "Receive special offers and discounts",
              },
              {
                key: "newsletter",
                label: "Newsletter",
                desc: "Weekly updates about new products",
              },
              {
                key: "pushNotifications",
                label: "Push Notifications",
                desc: "Allow notifications on this device",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-coffee-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
              >
                <div>
                  <p className="font-medium text-coffee-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-sm text-coffee-500 dark:text-white/50">
                    {item.desc}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-12 h-7 rounded-full p-1 transition-colors",
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-coffee-600 dark:bg-coffee-500"
                      : "bg-coffee-200 dark:bg-white/20"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                      notifications[item.key as keyof typeof notifications] &&
                        "translate-x-5"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="p-4 pt-0">
            <Button
              onClick={() => {
                setShowNotifications(false);
                toast.success("Notifications updated");
              }}
              className="w-full rounded-xl"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Language Modal */}
      <Dialog open={showLanguage} onOpenChange={setShowLanguage}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-coffee-600 to-coffee-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-white">
                Select Language
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Choose your preferred language
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-4 space-y-1">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                  selectedLanguage === lang.code
                    ? "bg-coffee-100 dark:bg-white/10"
                    : "hover:bg-coffee-50 dark:hover:bg-white/5"
                )}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setShowLanguage(false);
                  toast.success(`Language changed to ${lang.name}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-coffee-900 dark:text-white">
                    {lang.name}
                  </span>
                </div>
                {selectedLanguage === lang.code && (
                  <Check className="w-5 h-5 text-coffee-600 dark:text-white" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-error to-error/80 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-white">
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-error-foreground/90">
                This action cannot be undone. All your data will be permanently
                deleted.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6">
            <p className="text-sm text-coffee-600 dark:text-white/70">
              You will lose:
            </p>
            <ul className="mt-2 space-y-2 text-sm text-coffee-500 dark:text-white/50">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                All order history
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                Saved payment methods
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                Rewards points
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-error" />
                Favorite products
              </li>
            </ul>
          </div>
          <DialogFooter className="p-4 pt-0 gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteAccount(false)}
              className="rounded-xl border-coffee-300 dark:border-white/20 text-coffee-900 dark:text-white hover:bg-coffee-100 dark:hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-error hover:bg-error/90 text-error-foreground rounded-xl border-0"
            >
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
