import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/ui/badge";
import { useLanguage } from "../../contexts/LanguageContext";
import { SEO } from "@/components/common/SEO";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface UserApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  status: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
  appliedAt: Date;
  location: string;
}

// Mock data - will be replaced with actual user applications
const MOCK_USER_APPLICATIONS: UserApplication[] = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Senior Barista",
    status: "reviewing",
    appliedAt: new Date("2024-12-01"),
    location: "Jakarta, Senopati",
  },
  {
    id: "2",
    jobId: "3",
    jobTitle: "Head Roaster",
    status: "new",
    appliedAt: new Date("2024-11-28"),
    location: "Bandung, Braga",
  },
];

export const MyApplicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [applications] = useState<UserApplication[]>(MOCK_USER_APPLICATIONS);
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: UserApplication["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "reviewing":
        return "bg-yellow-500";
      case "interviewed":
        return "bg-purple-500";
      case "hired":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: UserApplication["status"]) => {
    const labels = {
      new: t("about.myApplications.statusLabels.new" as any) || "New",
      reviewing: t("about.myApplications.statusLabels.reviewing" as any) || "Reviewing",
      interviewed: t("about.myApplications.statusLabels.interviewed" as any) || "Interviewed",
      hired: t("about.myApplications.statusLabels.hired" as any) || "Hired",
      rejected: t("about.myApplications.statusLabels.rejected" as any) || "Rejected",
    };
    return labels[status] || status;
  };

  const getStatusProgress = (status: UserApplication["status"]) => {
    const progress = {
      new: 25,
      reviewing: 50,
      interviewed: 75,
      hired: 100,
      rejected: 100,
    };
    return progress[status] || 0;
  };

  const filteredApplications = applications.filter(
    (app) => statusFilter === "all" || app.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-coffee-950 pt-6 pb-20">
      <SEO
        title="My Applications"
        description="Track your job application status"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-2">
            {t("about.myApplications.title" as any)}
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300">
            {t("about.myApplications.subtitle" as any)}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-64 h-11 rounded-xl">
              <SelectValue placeholder={t("about.myApplications.allStatus" as any) || "All Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("about.myApplications.allStatus" as any) || "All Status"}</SelectItem>
              <SelectItem value="new">{getStatusLabel("new")}</SelectItem>
              <SelectItem value="reviewing">{getStatusLabel("reviewing")}</SelectItem>
              <SelectItem value="interviewed">{getStatusLabel("interviewed")}</SelectItem>
              <SelectItem value="hired">{getStatusLabel("hired")}</SelectItem>
              <SelectItem value="rejected">{getStatusLabel("rejected")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white dark:bg-[#3C2A21] rounded-[2rem] p-12 text-center border border-coffee-100 dark:border-none">
            <Briefcase className="w-16 h-16 text-coffee-300 dark:text-coffee-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-coffee-900 dark:text-white mb-2">
              {t("about.myApplications.empty" as any)}
            </h2>
            <p className="text-coffee-600 dark:text-coffee-300 mb-6">
              {t("about.myApplications.exploreJobs" as any) || "Start exploring our open positions"}
            </p>
            <Button
              onClick={() => navigate("/about/careers")}
              variant="primary"
              className="gap-2"
            >
              {t("about.myApplications.browseJobs" as any) || "Browse Jobs"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#3C2A21] rounded-[2rem] p-6 md:p-8 border border-coffee-100 dark:border-none shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-coffee-900 dark:text-white mb-2">
                      {application.jobTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-coffee-600 dark:text-coffee-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {t("about.myApplications.appliedOn" as any)}:{" "}
                        {application.appliedAt.toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{application.location}</span>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(application.status)} text-white shrink-0`}
                  >
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>

                {/* Progress Timeline */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-coffee-600 dark:text-coffee-400">
                      {t("about.myApplications.currentStatus" as any)}
                    </p>
                    <p className="text-sm font-bold text-coffee-900 dark:text-white">
                      {getStatusProgress(application.status)}%
                    </p>
                  </div>
                  <div className="h-2 bg-coffee-100 dark:bg-coffee-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getStatusProgress(application.status)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full ${getStatusColor(application.status)}`}
                    />
                  </div>
                </div>

                {/* Status Steps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  {["new", "reviewing", "interviewed", "hired"].map((step, index) => {
                    const isActive = ["new", "reviewing", "interviewed", "hired"].indexOf(
                      application.status
                    ) >= index;
                    const isCurrent = application.status === step;

                    return (
                      <div
                        key={step}
                        className={`text-center p-2 rounded-xl ${
                          isActive
                            ? "bg-coffee-50 dark:bg-coffee-800/50"
                            : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isCurrent
                              ? "text-coffee-900 dark:text-white"
                              : isActive
                              ? "text-coffee-600 dark:text-coffee-300"
                              : "text-coffee-400 dark:text-coffee-500"
                          }`}
                        >
                          {getStatusLabel(step as UserApplication["status"])}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredApplications.length > 0 && (
          <div className="mt-6 text-center text-sm text-coffee-500 dark:text-coffee-400">
            {t("about.myApplications.showing" as any, {
              count: filteredApplications.length,
              total: applications.length,
            }) || `Showing ${filteredApplications.length} application${filteredApplications.length !== 1 ? "s" : ""}`}
          </div>
        )}
      </div>
    </div>
  );
};
