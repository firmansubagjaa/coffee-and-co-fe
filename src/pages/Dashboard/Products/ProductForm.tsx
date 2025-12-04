import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addProduct,
  fetchProductById,
  updateProduct,
} from "../../../services/api";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RichTextEditor } from "../../../components/ui/RichTextEditor";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Product } from "@/types";
import { RecipeManager } from "./RecipeManager";
import { useLanguage } from "../../../contexts/LanguageContext";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(10, "Description is too short"),
  subDescriptions: z
    .array(
      z.object({
        value: z.string().min(1, "Description highlight cannot be empty"),
      })
    )
    .optional(),
  image: z.string().optional(), // Main image (URL or Base64)
  images: z.array(z.string()).optional(), // Gallery images

  // New Fields
  origin: z.string().optional(),
  roastLevel: z.string().optional(),
  tastingNotes: z.string().optional(), // Comma separated string for form
  sizes: z.array(z.string()).optional(),
  grindOptions: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AVAILABLE_SIZES = ["S", "M", "L"];
const AVAILABLE_GRINDS = ["Whole Bean", "Ground", "Espresso", "French Press"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

import { motion } from "framer-motion";

export const ProductForm: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Fetch product if editing
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "coffee",
      price: 0,
      description: "",
      subDescriptions: [],
      image: "",
      images: [],
      origin: "",
      roastLevel: "",
      tastingNotes: "",
      sizes: [],
      grindOptions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subDescriptions",
  });

  const category = watch("category");
  const mainImage = watch("image");

  // Load data into form when product is fetched
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        subDescriptions: product.subDescriptions
          ? product.subDescriptions.map((s) => ({ value: s }))
          : [],
        image: product.image,
        images: product.images || [],
        origin: product.origin || "",
        roastLevel: product.roastLevel || "",
        tastingNotes: product.tastingNotes
          ? product.tastingNotes.join(", ")
          : "",
        sizes: product.sizes || [],
        grindOptions: product.grindOptions || [],
      });
      if (product.images) {
        setGalleryPreviews(product.images);
      }
    }
  }, [product, reset]);

  const createMutation = useMutation({
    mutationFn: (data: Omit<Product, "id" | "rating">) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("dashboard.products.form.toast.created"));
      navigate("/dashboard/products");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => updateProduct(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success(t("dashboard.products.form.toast.updated"));
      navigate("/dashboard/products");
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    // If main image is empty but we have gallery images, use the first gallery image
    let finalMainImage = data.image;
    if (!finalMainImage && galleryPreviews.length > 0) {
      finalMainImage = galleryPreviews[0];
    }

    if (!finalMainImage) {
      toast.error(t("dashboard.products.form.toast.noImage"));
      return;
    }

    // Transform fields for API
    const formattedData = {
      ...data,
      image: finalMainImage,
      images: galleryPreviews, // Use the state which contains accumulated images
      subDescriptions: data.subDescriptions?.map((item) => item.value) || [],
      tastingNotes: data.tastingNotes
        ? data.tastingNotes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      roastLevel: data.roastLevel as any,
    };

    if (isEditing) {
      updateMutation.mutate(formattedData as Partial<Product>);
    } else {
      createMutation.mutate(formattedData as Omit<Product, "id" | "rating">);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let hasError = false;

    Array.from(files).forEach((file: File) => {
      // Validation: Size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          t("dashboard.products.form.toast.fileTooLarge", { name: file.name })
        );
        hasError = true;
        return;
      }
      // Validation: Type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          t("dashboard.products.form.toast.formatNotSupported", {
            name: file.name,
          })
        );
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
          // If it's the first image added, set it as main image preview too
          const currentMain = getValues("image");
          if (!currentMain) {
            setValue("image", reader.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    if (!hasError && files.length > 0) {
      toast.success(
        t("dashboard.products.form.toast.processed", { count: files.length })
      );
    }

    // Reset input
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(newGallery);

    // If we removed the main image (crudely checked by index 0 or value), try to update main image
    // Simple logic: if main image was the one removed, set main image to next available
    if (galleryPreviews[index] === getValues("image")) {
      setValue("image", newGallery[0] || "");
    }
  };

  if (isEditing && isLoadingProduct) {
    return (
      <div className="p-8 flex items-center justify-center text-coffee-500">
        <Loader2 className="animate-spin mr-2" />{" "}
        {t("dashboard.products.loading")}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/products")}
            className="px-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-coffee-900 dark:text-white">
              {isEditing
                ? t("dashboard.products.form.editTitle")
                : t("dashboard.products.form.newTitle")}
            </h1>
            <p className="text-coffee-500 dark:text-coffee-300">
              {t("dashboard.products.form.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t("dashboard.products.form.labels.name")}
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder={t("dashboard.products.form.placeholders.name")}
                />
                {errors.name && (
                  <p className="text-xs text-error">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    {t("dashboard.products.form.labels.category")}
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coffee">
                            {t("common.categories.coffee")}
                          </SelectItem>
                          <SelectItem value="pastry">
                            {t("common.categories.pastry")}
                          </SelectItem>
                          <SelectItem value="merch">
                            {t("common.categories.merch")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-xs text-error">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {t("dashboard.products.form.labels.price")}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-xs text-error">{errors.price.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-4">
              <div className="space-y-2">
                <Label>{t("dashboard.products.form.labels.description")}</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-error">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Specific Attributes */}
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-6">
              <h3 className="font-bold text-coffee-900 dark:text-white border-b border-coffee-50 dark:border-coffee-800 pb-2">
                {t("dashboard.products.form.labels.details")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="origin">
                    {t("dashboard.products.form.labels.origin")}
                  </Label>
                  <Input
                    id="origin"
                    {...register("origin")}
                    placeholder={t(
                      "dashboard.products.form.placeholders.origin"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("dashboard.products.form.labels.roastLevel")}
                  </Label>
                  <Controller
                    name="roastLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "dashboard.products.form.placeholders.roast"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Light">
                            {t("common.roastLevels.light")}
                          </SelectItem>
                          <SelectItem value="Medium">
                            {t("common.roastLevels.medium")}
                          </SelectItem>
                          <SelectItem value="Medium-Dark">
                            {t("common.roastLevels.mediumDark")}
                          </SelectItem>
                          <SelectItem value="Dark">
                            {t("common.roastLevels.dark")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tastingNotes">
                  {t("dashboard.products.form.labels.tastingNotes")}
                </Label>
                <Input
                  id="tastingNotes"
                  {...register("tastingNotes")}
                  placeholder={t(
                    "dashboard.products.form.placeholders.tastingNotes"
                  )}
                />
                <p className="text-xs text-coffee-400 dark:text-coffee-300">
                  {t("dashboard.products.form.helpers.tastingNotes")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Media, Highlights & Variants */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Media Manager */}
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-4">
              <h3 className="font-bold text-coffee-900 dark:text-white">
                {t("dashboard.products.form.labels.media")}
              </h3>

              {/* Main Image URL Input (Fallback/Direct) */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  {t("dashboard.products.form.labels.mainImage")}
                </Label>
                <Input
                  id="image"
                  {...register("image")}
                  placeholder={t("dashboard.products.form.placeholders.image")}
                />
                <p className="text-[10px] text-coffee-400 dark:text-coffee-300">
                  {t("dashboard.products.form.helpers.image")}
                </p>
                {errors.image && (
                  <p className="text-xs text-error">{errors.image.message}</p>
                )}
              </div>

              {/* File Upload Zone */}
              <div className="space-y-3">
                <Label>{t("dashboard.products.form.labels.gallery")}</Label>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-coffee-200 dark:border-coffee-700 rounded-xl p-6 flex flex-col items-center justify-center bg-coffee-50/50 dark:bg-coffee-800/50 group-hover:bg-coffee-50 dark:group-hover:bg-coffee-800 transition-colors">
                    <div className="p-3 bg-white dark:bg-coffee-700 rounded-full shadow-sm mb-3">
                      <Upload className="w-5 h-5 text-coffee-600 dark:text-coffee-300" />
                    </div>
                    <p className="text-sm font-medium text-coffee-900 dark:text-white">
                      {t("dashboard.products.form.helpers.upload")}
                    </p>
                    <p className="text-xs text-coffee-500 dark:text-coffee-300 mt-1">
                      {t("dashboard.products.form.helpers.uploadFormat")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {galleryPreviews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-coffee-100 dark:border-coffee-700 group"
                    >
                      <img
                        src={src}
                        alt={`Gallery ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-error opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {/* Indicator for Main Image */}
                      {src === mainImage && (
                        <div className="absolute bottom-0 left-0 right-0 bg-coffee-900/80 text-white text-[10px] font-bold text-center py-0.5">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants */}
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-4">
              <h3 className="font-bold text-coffee-900 dark:text-white">
                {t("dashboard.products.form.labels.variants")}
              </h3>

              <div className="space-y-3">
                <Label>{t("dashboard.products.form.labels.sizes")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Controller
                    name="sizes"
                    control={control}
                    render={({ field }) => (
                      <>
                        {AVAILABLE_SIZES.map((size) => (
                          <div
                            key={size}
                            className="flex items-center space-x-2 border border-coffee-100 dark:border-coffee-700 p-2 rounded-lg hover:bg-coffee-50 dark:hover:bg-coffee-800 transition-colors"
                          >
                            <Checkbox
                              id={`size-${size}`}
                              checked={field.value?.includes(size)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, size]);
                                } else {
                                  field.onChange(
                                    current.filter((s) => s !== size)
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`size-${size}`}
                              className="cursor-pointer flex-1"
                            >
                              {size}
                            </Label>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>

              {category === "coffee" && (
                <div className="space-y-3 pt-2">
                  <Label>{t("dashboard.products.form.labels.grind")}</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Controller
                      name="grindOptions"
                      control={control}
                      render={({ field }) => (
                        <>
                          {AVAILABLE_GRINDS.map((grind) => (
                            <div
                              key={grind}
                              className="flex items-center space-x-2 border border-coffee-100 dark:border-coffee-700 p-2 rounded-lg hover:bg-coffee-50 dark:hover:bg-coffee-800 transition-colors"
                            >
                              <Checkbox
                                id={`grind-${grind}`}
                                checked={field.value?.includes(grind)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, grind]);
                                  } else {
                                    field.onChange(
                                      current.filter((g) => g !== grind)
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`grind-${grind}`}
                                className="cursor-pointer flex-1"
                              >
                                {grind}
                              </Label>
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t("dashboard.products.form.labels.highlights")}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  className="h-8 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />{" "}
                  {t("dashboard.products.form.buttons.add")}
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex-1">
                      <Input
                        {...register(`subDescriptions.${index}.value` as const)}
                        placeholder={t(
                          "dashboard.products.form.placeholders.highlight"
                        )}
                        className={`h-10 ${
                          errors.subDescriptions?.[index]?.value
                            ? "border-error"
                            : ""
                        }`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-coffee-400 hover:text-error hover:bg-error/10 h-10 w-10 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="text-center py-4 bg-coffee-50/50 dark:bg-coffee-800/50 rounded-xl border border-dashed border-coffee-200 dark:border-coffee-700">
                    <p className="text-xs text-coffee-400 dark:text-coffee-300">
                      {t("dashboard.products.form.helpers.noHighlights")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recipe Manager (ERP Feature) - Full Width */}
        <motion.div variants={itemVariants} className="mb-10">
          <RecipeManager
            variants={watch("sizes") || []}
            onUpdate={(recipes) => console.log("Recipes updated:", recipes)}
          />
        </motion.div>

        <div className="flex justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-coffee-800 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/products")}
          >
            {t("dashboard.products.form.buttons.cancel")}
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
            {t("dashboard.products.form.buttons.save")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
