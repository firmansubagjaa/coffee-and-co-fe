import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, FileText } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useLanguage } from "../../contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";

export const ApplicationSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Get job data from state
  const applicationData = location.state as {
    jobTitle?: string;
    jobId?: string;
  } | null;

  // If no data, redirect to careers
  if (!applicationData?.jobTitle) {
    navigate("/about/careers");
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 flex items-center justify-center px-4 py-20">
      <SEO
        title="Application Submitted"
        description="Your job application has been successfully submitted."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-[#3C2A21] rounded-[2rem] p-8 md:p-12 shadow-lg border border-coffee-100 dark:border-none text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-4">
            {t("about.careers.applicationSuccess.title" as any)}
          </h1>
          <p className="text-lg text-coffee-600 dark:text-coffee-300 mb-8">
            {t("about.careers.applicationSuccess.subtitle" as any)}
          </p>

          {/* Application Summary */}
          <div className="bg-coffee-50 dark:bg-black/20 rounded-2xl p-6 mb-8">
            <p className="text-sm font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wider mb-2">
              {t("about.careers.applicationSuccess.jobApplied" as any)}
            </p>
            <p className="text-xl font-bold text-coffee-900 dark:text-white">
              {applicationData.jobTitle}
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8 space-y-4">
            <h2 className="text-xl font-bold text-coffee-900 dark:text-white mb-4">
              {t("about.careers.applicationSuccess.nextSteps.title" as any)}
            </h2>
            <div className="space-y-3">
              {[
                t("about.careers.applicationSuccess.nextSteps.step1" as any),
                t("about.careers.applicationSuccess.nextSteps.step2" as any),
                t("about.careers.applicationSuccess.nextSteps.step3" as any),
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-coffee-200 dark:bg-coffee-700 flex items-center justify-center text-sm font-bold text-coffee-900 dark:text-white">
                    {index + 1}
                  </div>
                  <p className="text-coffee-700 dark:text-coffee-300 pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={() => navigate("/my-applications")}
              variant="primary"
              className="flex-1 gap-2 h-12 rounded-xl font-bold"
            >
              <FileText className="w-5 h-5" />
              {t("about.careers.applicationSuccess.viewApplications" as any)}
            </Button>
            <Button
              onClick={() => navigate("/about/careers")}
              variant="outline"
              className="flex-1 gap-2 h-12 rounded-xl"
            >
              {t("about.careers.applicationSuccess.backToCareers" as any)}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-sm text-coffee-500 dark:text-coffee-400">
            {t("about.careers.applicationSuccess.emailUpdate" as any) || "We'll keep you updated via email"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
