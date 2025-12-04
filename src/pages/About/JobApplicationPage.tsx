import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner";
import { SEO } from "@/components/common/SEO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/Breadcrumb";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const applicationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  coverLetter: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export const JobApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get job data from navigation state
  const jobData = location.state as { jobId: string; jobTitle: string } | null;
  
  if (!jobData) {
    navigate("/about/careers");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error(t("about.careers.application.validation.cvFormat" as any));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("about.careers.application.validation.cvFormat" as any));
      return;
    }

    setCvFile(file);
    toast.success(`CV uploaded: ${file.name}`);
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!cvFile) {
      toast.error(t("about.careers.application.validation.cvRequired" as any));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock data for now
      const application = {
        ...data,
        jobId: jobData.jobId,
        jobTitle: jobData.jobTitle,
        cv: cvFile.name,
        appliedAt: new Date(),
      };

      console.log("Application submitted:", application);

      toast.success(t("about.careers.application.success" as any), {
        description: t("about.careers.application.successDesc" as any),
      });

      setTimeout(() => {
        navigate("/about/careers");
      }, 2000);
    } catch (error) {
      toast.error(t("about.careers.application.error" as any));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO
        title={`Apply for ${jobData.jobTitle}`}
        description="Submit your application to join the Coffee & Co team."
      />

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
                <BreadcrumbLink to="/about/careers">Careers</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Apply</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/about/careers")}
            className="rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-900 dark:text-white shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-2">
              {t("about.careers.application.title" as any, {
                position: jobData.jobTitle,
              })}
            </h1>
            <p className="text-coffee-500 dark:text-white/60">
              {t("about.careers.application.subtitle" as any)}
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#3C2A21] rounded-[2rem] p-8 md:p-10 shadow-sm border border-coffee-100 dark:border-none"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base font-medium">
                {t("about.careers.application.form.fullName" as any)}
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder={t(
                  "about.careers.application.form.fullNamePlaceholder" as any
                )}
                className="h-12 rounded-xl"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t("about.careers.application.validation.nameRequired" as any)}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                {t("about.careers.application.form.email" as any)}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder={t(
                  "about.careers.application.form.emailPlaceholder" as any
                )}
                className="h-12 rounded-xl"
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t("about.careers.application.validation.emailInvalid" as any)}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-medium">
                {t("about.careers.application.form.phone" as any)}
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder={t(
                  "about.careers.application.form.phonePlaceholder" as any
                )}
                className="h-12 rounded-xl"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t("about.careers.application.validation.phoneInvalid" as any)}
                </p>
              )}
            </div>

            {/* CV Upload */}
            <div className="space-y-2">
              <Label htmlFor="cv" className="text-base font-medium">
                {t("about.careers.application.form.cv" as any)}
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="cv"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <label
                  htmlFor="cv"
                  className="flex items-center justify-center gap-3 h-32 border-2 border-dashed border-coffee-200 dark:border-white/10 rounded-xl hover:border-coffee-400 dark:hover:border-white/20 transition-colors cursor-pointer bg-coffee-50/50 dark:bg-black/20"
                >
                  {cvFile ? (
                    <div className="flex items-center gap-3 text-coffee-900 dark:text-white">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-medium">{cvFile.name}</p>
                        <p className="text-sm text-coffee-500 dark:text-white/60">
                          {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-coffee-500 dark:text-white/60">
                      <Upload className="w-8 h-8" />
                      <p className="font-medium">Click to upload CV</p>
                      <p className="text-xs">PDF only (max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-base font-medium">
                {t("about.careers.application.form.coverLetter" as any)}
              </Label>
              <textarea
                id="coverLetter"
                {...register("coverLetter")}
                placeholder={t(
                  "about.careers.application.form.coverLetterPlaceholder" as any
                )}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-coffee-200 dark:border-white/10 bg-transparent text-coffee-900 dark:text-white placeholder:text-coffee-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/about/careers")}
                className="flex-1 rounded-xl h-12"
              >
                {t("about.careers.application.backToCareers" as any)}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl h-12 font-bold"
              >
                {isSubmitting
                  ? t("about.careers.application.submitting" as any)
                  : t("about.careers.application.submit" as any)}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
