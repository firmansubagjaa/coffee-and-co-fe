import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
import { Job } from "../../../api/cms.api";
import { useCreateJob, useUpdateJob } from "../../../api/cms.hooks";
import { Textarea } from "../../../components/ui/textarea";

const jobSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(2, "Location is required"),
  type: z.enum(["Full-time", "Part-time", "Contract"]),
  status: z.enum(["active", "closed"]),
});

type JobFormValues = z.infer<typeof jobSchema>;

export const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jobState = useLocation().state as Job | undefined;
  const { t } = useLanguage();
  const isEditing = !!id;

  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      department: "",
      location: "",
      type: "Full-time",
      status: "active",
    },
  });

  useEffect(() => {
    if (isEditing && jobState) {
      setValue("title", jobState.title);
      setValue("description", jobState.description);
      setValue("department", jobState.department);
      setValue("location", jobState.location);
      setValue("type", jobState.type as "Full-time" | "Part-time" | "Contract");
      // API returns 'active' or 'closed'
      setValue("status", jobState.status as "active" | "closed");
    }
  }, [isEditing, jobState, setValue]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      if (isEditing && id) {
        await updateJob.mutateAsync({ id, data });
        toast.success(t("dashboard.jobs.toast.updated"));
      } else {
        // Create requires all required fields
        const createData = {
          title: data.title,
          description: data.description,
          type: data.type,
          department: data.department,
          location: data.location,
          status: data.status,
        };
        await createJob.mutateAsync(createData);
        toast.success(t("dashboard.jobs.toast.posted"));
      }
      navigate("/dashboard/cms/jobs");
    } catch (error) {
      toast.error(
        isEditing
          ? "Failed to update job. Please try again."
          : "Failed to create job. Please try again."
      );
      console.error("Job submission error:", error);
    }
  };

  const isSubmitting = createJob.isPending || updateJob.isPending;

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
            onClick={() => navigate("/dashboard/cms/jobs")}
            className="px-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-coffee-900 dark:text-white">
              {isEditing
                ? t("dashboard.jobs.dialog.editTitle")
                : t("dashboard.jobs.dialog.newTitle")}
            </h1>
            <p className="text-coffee-500 dark:text-coffee-300">
              {t("dashboard.jobs.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white dark:bg-coffee-900 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-800 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="dark:text-coffee-100">
                {t("dashboard.jobs.dialog.labels.title")}
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder={t("dashboard.jobs.dialog.placeholders.title")}
                className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
              />
              {errors.title && (
                <p className="text-xs text-error">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="dark:text-coffee-100">
                {t("dashboard.jobs.dialog.labels.department")}
              </Label>
              <Input
                id="department"
                {...register("department")}
                placeholder={t("dashboard.jobs.dialog.placeholders.department")}
                className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
              />
              {errors.department && (
                <p className="text-xs text-error">
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-coffee-100">
              Job Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter the job description, responsibilities, and requirements..."
              rows={6}
              className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
            />
            {errors.description && (
              <p className="text-xs text-error">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="dark:text-coffee-100">
              {t("dashboard.jobs.dialog.labels.location")}
            </Label>
            <Input
              id="location"
              {...register("location")}
              placeholder={t("dashboard.jobs.dialog.placeholders.location")}
              className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white"
            />
            {errors.location && (
              <p className="text-xs text-error">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-coffee-100">
                {t("dashboard.jobs.dialog.labels.type")}
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white">
                      <SelectValue
                        placeholder={t(
                          "dashboard.jobs.dialog.placeholders.type"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-xs text-error">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="dark:text-coffee-100">
                {t("dashboard.jobs.dialog.labels.status")}
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-900 dark:text-white">
                      <SelectValue
                        placeholder={t(
                          "dashboard.jobs.dialog.placeholders.status"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-xs text-error">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-coffee-100 dark:border-coffee-800 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/dashboard/cms/jobs")}
          >
            {t("dashboard.jobs.dialog.buttons.cancel")}
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
            {t("dashboard.jobs.dialog.buttons.save")}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
