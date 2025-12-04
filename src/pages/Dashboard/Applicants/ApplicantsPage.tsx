import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Search, FileText, ChevronDown } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
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

interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter?: string;
  status: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
  appliedAt: Date;
}

// Mock data
const MOCK_APPLICANTS: Applicant[] = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Senior Barista",
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+62 812 3456 7890",
    cvUrl: "mock-cv-1.pdf",
    coverLetter: "I am passionate about coffee and have 5 years of experience...",
    status: "new",
    appliedAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    jobId: "2",
    jobTitle: "Store Manager",
    fullName: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+62 813 9876 5432",
    cvUrl: "mock-cv-2.pdf",
    status: "reviewing",
    appliedAt: new Date("2024-11-28"),
  },
  {
    id: "3",
    jobId: "1",
    jobTitle: "Senior Barista",
    fullName: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "+62 821 1234 5678",
    cvUrl: "mock-cv-3.pdf",
    coverLetter: "With extensive latte art skills and customer service excellence...",
    status: "interviewed",
    appliedAt: new Date("2024-11-25"),
  },
  {
    id: "4",
    jobId: "3",
    jobTitle: "Head Roaster",
    fullName: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "+62 822 5555 4444",
    cvUrl: "mock-cv-4.pdf",
    status: "hired",
    appliedAt: new Date("2024-11-20"),
  },
];

export const ApplicantsPage: React.FC = () => {
  const { t } = useLanguage();
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  
  // Status change dialog state
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    applicant: Applicant | null;
    newStatus: Applicant["status"] | null;
  }>({
    open: false,
    applicant: null,
    newStatus: null,
  });

  const getStatusColor = (status: Applicant["status"]) => {
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

  const getStatusLabel = (status: Applicant["status"]) => {
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
      applicant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    const matchesJob = jobFilter === "all" || applicant.jobId === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleDownloadCV = (applicant: Applicant) => {
    toast.success(`Downloading CV: ${applicant.cvUrl}`);
    console.log("Download CV:", applicant.cvUrl);
  };

  const handleExport = () => {
    exportData(filteredApplicants, "applicants_report", "csv");
    toast.success("Applicants exported as CSV");
  };

  const handleStatusChange = (applicant: Applicant, newStatus: string) => {
    setStatusDialog({
      open: true,
      applicant,
      newStatus: newStatus as Applicant["status"],
    });
  };

  const confirmStatusChange = () => {
    if (!statusDialog.applicant || !statusDialog.newStatus) return;

    setApplicants((prev) =>
      prev.map((a) =>
        a.id === statusDialog.applicant!.id
          ? { ...a, status: statusDialog.newStatus! }
          : a
      )
    );

    toast.success(
      `Status updated to "${getStatusLabel(statusDialog.newStatus)}" for ${statusDialog.applicant.fullName}`
    );

    setStatusDialog({ open: false, applicant: null, newStatus: null });
  };

  const cancelStatusChange = () => {
    setStatusDialog({ open: false, applicant: null, newStatus: null });
  };

  const uniqueJobs = Array.from(
    new Set(applicants.map((a) => ({ id: a.jobId, title: a.jobTitle })).map((j) => JSON.stringify(j)))
  ).map((j) => JSON.parse(j));

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
          { label: "New", count: applicants.filter((a) => a.status === "new").length, color: "bg-blue-500" },
          { label: "Reviewing", count: applicants.filter((a) => a.status === "reviewing").length, color: "bg-yellow-500" },
          { label: "Interviewed", count: applicants.filter((a) => a.status === "interviewed").length, color: "bg-purple-500" },
          { label: "Hired", count: applicants.filter((a) => a.status === "hired").length, color: "bg-green-500" },
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
                  <td colSpan={6} className="px-6 py-12 text-center text-coffee-500 dark:text-coffee-400">
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
                            {applicant.fullName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-coffee-900 dark:text-white">
                            {applicant.fullName}
                          </p>
                          <p className="text-xs text-coffee-500 dark:text-coffee-400">
                            ID: {applicant.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-coffee-900 dark:text-white">
                        {applicant.jobTitle}
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
                        {applicant.appliedAt.toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={applicant.status}
                        onValueChange={(value) => handleStatusChange(applicant, value)}
                      >
                        <SelectTrigger className={`w-[140px] h-8 ${getStatusColor(applicant.status)} text-white border-none`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
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
                        {applicant.coverLetter && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.info(applicant.coverLetter)}
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
      <Dialog open={statusDialog.open} onOpenChange={(open) => !open && cancelStatusChange()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status for{" "}
              <strong>{statusDialog.applicant?.fullName}</strong> to{" "}
              <strong className={statusDialog.newStatus ? getStatusColor(statusDialog.newStatus) : ""}>
                {statusDialog.newStatus ? getStatusLabel(statusDialog.newStatus) : ""}
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
