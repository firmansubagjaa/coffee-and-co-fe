import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { MOCK_JOBS, Job } from "../../../data/mockJobs";

export const JobsManager: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast.success(t("dashboard.jobs.toast.deleted"));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
            {t("dashboard.jobs.title")}
          </h1>
          <p className="text-coffee-500 dark:text-coffee-400 mt-1">
            {t("dashboard.jobs.subtitle")}
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/cms/jobs/new")}
          className="gap-2 shadow-lg bg-coffee-600 hover:bg-coffee-700 text-white"
        >
          <Plus className="w-4 h-4" /> {t("dashboard.jobs.postJob")}
        </Button>
      </div>

      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-coffee-100 dark:border-coffee-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 dark:text-coffee-500" />
            <Input
              placeholder={t("dashboard.jobs.searchPlaceholder")}
              className="pl-10 bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider border-b border-coffee-100 dark:border-coffee-800">
              <tr>
                <th className="px-6 py-4">
                  {t("dashboard.jobs.table.position")}
                </th>
                <th className="px-6 py-4">
                  {t("dashboard.jobs.table.department")}
                </th>
                <th className="px-6 py-4">
                  {t("dashboard.jobs.table.location")}
                </th>
                <th className="px-6 py-4">{t("dashboard.jobs.table.type")}</th>
                <th className="px-6 py-4">
                  {t("dashboard.jobs.table.status")}
                </th>
                <th className="px-6 py-4 text-right">
                  {t("dashboard.jobs.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-coffee-900 dark:text-white">
                      {job.title}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400">
                    {job.department}
                  </td>
                  <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className="bg-white dark:bg-coffee-800 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-700"
                    >
                      {job.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={job.status === "Active" ? "success" : "neutral"}
                    >
                      {job.status === "Active" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Closed
                        </span>
                      )}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/cms/jobs/${job.id}`, {
                            state: job,
                          })
                        }
                        className="p-2 text-coffee-400 dark:text-coffee-500 hover:text-coffee-900 dark:hover:text-white hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-lg"
                        aria-label="Edit job"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-coffee-400 dark:text-coffee-500 hover:text-error hover:bg-error/10 dark:hover:bg-error/20 rounded-lg"
                        aria-label="Delete job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
