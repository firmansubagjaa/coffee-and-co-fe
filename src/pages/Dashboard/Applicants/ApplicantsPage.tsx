import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Search,
  FileText,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import {
  useApplicantsPage,
  useUpdateApplicationStatus,
} from "../../../api/cms.hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useLanguage } from "../../../contexts/LanguageContext";
import { toast } from "sonner";
import { exportData } from "../../../utils/export";
import type { JobApplication } from "../../../api/cms.api";

// Use JobApplication type from API

// Mock data - matches JobApplication type from API
const MOCK_APPLICANTS: JobApplication[] = [
  {
    id: "1",
    job_id: "1",
    full_name: "John Doe",
    email: "john.doe@email.com",
    phone: "+62 812 3456 7890",
    cv_url: "mock-cv-1.pdf",
    cover_letter:
      "I am passionate about coffee and have 5 years of experience...",
    status: "new",
    created_at: "2024-12-01T00:00:00Z",
    job: {
      id: "1",
      title: "Senior Barista",
      description: "",
      type: "Full-Time",
      department: "Store",
      location: "Jakarta",
      status: "open",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "2",
    job_id: "2",
    full_name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+62 813 9876 5432",
    cv_url: "mock-cv-2.pdf",
    status: "reviewing",
    created_at: "2024-11-28T00:00:00Z",
    job: {
      id: "2",
      title: "Store Manager",
      description: "",
      type: "Full-Time",
      department: "Operations",
      location: "Bandung",
      status: "open",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "3",
    job_id: "1",
    full_name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+62 821 1234 5678",
    cv_url: "mock-cv-3.pdf",
    cover_letter:
      "With extensive latte art skills and customer service excellence...",
    status: "interviewed",
    created_at: "2024-11-25T00:00:00Z",
    job: {
      id: "1",
      title: "Senior Barista",
      description: "",
      type: "Full-Time",
      department: "Store",
      location: "Jakarta",
      status: "open",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "4",
    job_id: "3",
    full_name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "+62 822 5555 4444",
    cv_url: "mock-cv-4.pdf",
    status: "hired",
    created_at: "2024-11-20T00:00:00Z",
    job: {
      id: "3",
      title: "Head Roaster",
      description: "",
      type: "Full-Time",
      department: "Operations",
      location: "Surabaya",
      status: "open",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
];

export const ApplicantsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  // Fetch applicants from API
  const { applications, jobs, isLoading, isError } = useApplicantsPage();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const applicants = applications?.data?.applications || MOCK_APPLICANTS;

  // Status change dialog state
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    applicant: JobApplication | null;
    newStatus: JobApplication["status"] | null;
  }>({
    open: false,
    applicant: null,
    newStatus: null,
  });

  const getStatusColor = (status: JobApplication["status"]) => {
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

  const getStatusLabel = (status: JobApplication["status"]) => {
    const labels = {
      new: "New",
      reviewing: "Reviewing",
      interviewed: "Interviewed",
      hired: "Hired",
      rejected: "Rejected",
    };
    return labels[status] || status;
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (applicant.job?.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || applicant.status === statusFilter;
    const matchesJob = jobFilter === "all" || applicant.job_id === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleDownloadCV = (applicant: JobApplication) => {
    toast.success(`Downloading CV: ${applicant.cv_url || "N/A"}`);
    console.log("Download CV:", applicant.cv_url);
  };

  const handleExport = () => {
    exportData(filteredApplicants, "applicants_report", "csv");
    toast.success("Applicants exported as CSV");
  };

  const handleStatusChange = (applicant: JobApplication, newStatus: string) => {
    setStatusDialog({
      open: true,
      applicant,
      newStatus: newStatus as JobApplication["status"],
    });
  };

  const confirmStatusChange = () => {
    if (!statusDialog.applicant || !statusDialog.newStatus) return;

    updateStatus(
      {
        id: statusDialog.applicant.id,
        data: { status: statusDialog.newStatus },
      },
      {
        onSuccess: () => {
          toast.success(
            `Status updated to "${getStatusLabel(
              statusDialog.newStatus!
            )}" for ${statusDialog.applicant!.full_name}`
          );
          setStatusDialog({ open: false, applicant: null, newStatus: null });
        },
        onError: (error: any) => {
          toast.error(error?.message || t("common.error.updateFailed"));
        },
      }
    );
  };

  const cancelStatusChange = () => {
    setStatusDialog({ open: false, applicant: null, newStatus: null });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-coffee-600 dark:text-coffee-400">
            {t("common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-coffee-600 dark:text-coffee-400">
            {t("common.error.loadFailed")}
          </p>
        </div>
      </div>
    );
  }

  const uniqueJobs = Array.from(
    new Set(
      applicants
        .filter((a) => a.job)
        .map((a) => ({ id: a.job_id, title: a.job!.title }))
        .map((j) => JSON.stringify(j))
    )
  ).map((j) => JSON.parse(j as string));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-white mb-2">
            Job Applicants
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300">
            Manage and review job applications
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] p-6 border border-coffee-100 dark:border-coffee-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
            <Input
              placeholder="Search by name, email, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>

          {/* Job Filter */}
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {uniqueJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total", count: applicants.length, color: "bg-blue-500" },
          {
            label: "New",
            count: applicants.filter((a) => a.status === "new").length,
            color: "bg-blue-500",
          },
          {
            label: "Reviewing",
            count: applicants.filter((a) => a.status === "reviewing").length,
            color: "bg-yellow-500",
          },
          {
            label: "Interviewed",
            count: applicants.filter((a) => a.status === "interviewed").length,
            color: "bg-purple-500",
          },
          {
            label: "Hired",
            count: applicants.filter((a) => a.status === "hired").length,
            color: "bg-green-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-coffee-900 rounded-2xl p-4 border border-coffee-100 dark:border-coffee-800 shadow-sm"
          >
            <p className="text-xs font-bold text-coffee-500 dark:text-coffee-400 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-coffee-900 dark:text-white">
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Applicants Table */}
      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-coffee-50 dark:bg-coffee-800 border-b border-coffee-100 dark:border-coffee-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-coffee-600 dark:text-coffee-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-coffee-600 dark:text-coffee-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-coffee-600 dark:text-coffee-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-coffee-600 dark:text-coffee-300 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-coffee-600 dark:text-coffee-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-coffee-600 dark:text-coffee-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100 dark:divide-coffee-800">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-coffee-500 dark:text-coffee-400"
                  >
                    No applicants found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <motion.tr
                    key={applicant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-coffee-50 dark:hover:bg-coffee-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-coffee-200 dark:bg-coffee-700 text-coffee-900 dark:text-white font-bold">
                            {applicant.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-coffee-900 dark:text-white">
                            {applicant.full_name}
                          </p>
                          <p className="text-xs text-coffee-500 dark:text-coffee-400">
                            ID: {applicant.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-coffee-900 dark:text-white">
                        {applicant.job?.title || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-coffee-700 dark:text-coffee-300">
                        {applicant.email}
                      </p>
                      <p className="text-xs text-coffee-500 dark:text-coffee-400">
                        {applicant.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-coffee-700 dark:text-coffee-300">
                        {new Date(applicant.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={applicant.status}
                        onValueChange={(value) =>
                          handleStatusChange(applicant, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[140px] h-8 ${getStatusColor(
                            applicant.status
                          )} text-white border-none`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="interviewed">
                            Interviewed
                          </SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadCV(applicant)}
                          className="gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          CV
                        </Button>
                        {applicant.cover_letter && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.info(applicant.cover_letter!)}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-coffee-500 dark:text-coffee-400">
        Showing {filteredApplicants.length} of {applicants.length} applicants
      </div>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={statusDialog.open}
        onOpenChange={(open) => !open && cancelStatusChange()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status for{" "}
              <strong>{statusDialog.applicant?.full_name}</strong> to{" "}
              <strong
                className={
                  statusDialog.newStatus
                    ? getStatusColor(statusDialog.newStatus)
                    : ""
                }
              >
                {statusDialog.newStatus
                  ? getStatusLabel(statusDialog.newStatus)
                  : ""}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelStatusChange}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmStatusChange}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
