import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { motion } from "framer-motion";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Location } from "../../../data/mockLocations";

const locationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(5, "Phone is required"),
  hours: z.string().min(1, "Hours are required"),
  status: z.enum(["Open", "Renovation", "Coming Soon"]),
  mapEmbedUrl: z.string().optional(),
  image: z.string().optional(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const LocationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const locationState = useLocation().state as Location | undefined;
  const { t } = useLanguage();
  const isEditing = !!id;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      city: "",
      address: "",
      phone: "",
      hours: "08:00 - 22:00",
      status: "Open",
      mapEmbedUrl: "",
      image: "",
    },
  });

  useEffect(() => {
    if (isEditing && locationState) {
      setValue("name", locationState.name);
      setValue("city", locationState.city || "");
      setValue("address", locationState.address);
      setValue("phone", locationState.phone);
      setValue("hours", locationState.hours);
      setValue("status", locationState.status);
      setValue("mapEmbedUrl", locationState.mapEmbedUrl || "");
      setValue("image", locationState.image || "");
      if (locationState.image) {
        setImagePreview(locationState.image);
      }
    }
  }, [isEditing, locationState, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        t("dashboard.products.form.toast.fileTooLarge", { name: file.name })
      );
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        t("dashboard.products.form.toast.formatNotSupported", {
          name: file.name,
        })
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
        setValue("image", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image", "");
  };

  const onSubmit = async (data: LocationFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Location Data:", data);
    toast.success(
      isEditing
        ? t("dashboard.locations.toast.updated")
        : t("dashboard.locations.toast.added")
    );
    navigate("/dashboard/cms/locations");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-3xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/cms/locations")}
            className="px-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-coffee-900 dark:text-white">
              {isEditing
                ? t("dashboard.locations.dialog.editTitle")
                : t("dashboard.locations.dialog.newTitle")}
            </h1>
            <p className="text-coffee-500 dark:text-coffee-300">
              {t("dashboard.locations.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-coffee-100">
                {t("dashboard.locations.dialog.labels.storeName")}
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder={t(
                  "dashboard.locations.dialog.placeholders.storeName"
                )}
                className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
              />
              {errors.name && (
                <p className="text-xs text-error">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="dark:text-coffee-100">
                City
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="e.g. Jakarta"
                className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
              />
              {errors.city && (
                <p className="text-xs text-error">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="dark:text-coffee-100">
              {t("dashboard.locations.dialog.labels.address")}
            </Label>
            <Input
              id="address"
              {...register("address")}
              placeholder={t("dashboard.locations.dialog.placeholders.address")}
              className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
            />
            {errors.address && (
              <p className="text-xs text-error">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-coffee-100">
                {t("dashboard.locations.dialog.labels.phone")}
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder={t("dashboard.locations.dialog.placeholders.phone")}
                className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
              />
              {errors.phone && (
                <p className="text-xs text-error">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours" className="dark:text-coffee-100">
                {t("dashboard.locations.dialog.labels.hours")}
              </Label>
              <Input
                id="hours"
                {...register("hours")}
                placeholder={t("dashboard.locations.dialog.placeholders.hours")}
                className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
              />
              {errors.hours && (
                <p className="text-xs text-error">{errors.hours.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="dark:text-coffee-100">
              {t("dashboard.locations.dialog.labels.status")}
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white">
                    <SelectValue
                      placeholder={t(
                        "dashboard.locations.dialog.placeholders.status"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">
                      {t("dashboard.locations.status.open")}
                    </SelectItem>
                    <SelectItem value="Renovation">
                      {t("dashboard.locations.status.renovation")}
                    </SelectItem>
                    <SelectItem value="Coming Soon">
                      {t("dashboard.locations.status.comingSoon")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-xs text-error">{errors.status.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="dark:text-coffee-100">Location Image</Label>
            <div className="border-2 border-dashed border-coffee-200 dark:border-coffee-700 rounded-xl p-6 text-center hover:bg-coffee-50 dark:hover:bg-coffee-800/50 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                    <p className="text-white font-medium">Click to change</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeImage();
                    }}
                    className="absolute top-2 right-2 p-1 bg-error text-error-foreground rounded-full z-30 hover:bg-error/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-coffee-500 dark:text-coffee-400">
                  <div className="w-12 h-12 rounded-full bg-coffee-100 dark:bg-coffee-800 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6 text-coffee-600 dark:text-coffee-400" />
                  </div>
                  <p className="font-medium">Click or drag image to upload</p>
                  <p className="text-xs">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapEmbedUrl" className="dark:text-coffee-100">
              Map Embed URL
            </Label>
            <Input
              id="mapEmbedUrl"
              {...register("mapEmbedUrl")}
              placeholder="https://www.google.com/maps/embed?..."
              className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
            />
            {errors.mapEmbedUrl && (
              <p className="text-xs text-error">{errors.mapEmbedUrl.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-coffee-800 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/cms/locations")}
          >
            {t("dashboard.locations.dialog.buttons.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 shadow-lg bg-coffee-600 hover:bg-coffee-700 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t("dashboard.locations.dialog.buttons.save")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
