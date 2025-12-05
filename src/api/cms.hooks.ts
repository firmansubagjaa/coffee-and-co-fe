/**
 * CMS/Jobs Hooks - React Query hooks for jobs and applications
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobs,
  getJobById,
  getActiveJobs,
  applyForJob,
  createJob,
  updateJob,
  deleteJob,
  getApplications,
  getApplicationById,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
  type JobsParams,
  type ApplicationsParams,
  type CreateJobData,
  type UpdateJobData,
  type ApplyJobData,
  type UpdateApplicationStatusData,
} from "./cms.api";
import { toast } from "sonner";

// ============================================
// QUERY KEYS
// ============================================

export const cmsKeys = {
  all: ["cms"] as const,
  // Jobs
  jobs: () => [...cmsKeys.all, "jobs"] as const,
  jobsList: (params: JobsParams) =>
    [...cmsKeys.jobs(), "list", params] as const,
  jobDetail: (id: string) => [...cmsKeys.jobs(), "detail", id] as const,
  activeJobs: () => [...cmsKeys.jobs(), "active"] as const,
  // Applications
  applications: () => [...cmsKeys.all, "applications"] as const,
  applicationsList: (params: ApplicationsParams) =>
    [...cmsKeys.applications(), "list", params] as const,
  applicationDetail: (id: string) =>
    [...cmsKeys.applications(), "detail", id] as const,
  jobApplications: (jobId: string) =>
    [...cmsKeys.applications(), "by-job", jobId] as const,
};

// ============================================
// JOBS QUERIES
// ============================================

/**
 * Get jobs with filters
 */
export const useJobs = (params: JobsParams = {}) => {
  return useQuery({
    queryKey: cmsKeys.jobsList(params),
    queryFn: () => getJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get single job by ID
 */
export const useJob = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: cmsKeys.jobDetail(id),
    queryFn: () => getJobById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get active job openings
 */
export const useActiveJobs = () => {
  return useQuery({
    queryKey: cmsKeys.activeJobs(),
    queryFn: getActiveJobs,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================
// JOBS MUTATIONS
// ============================================

/**
 * Apply for a job
 */
export const useApplyForJob = () => {
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: ApplyJobData }) =>
      applyForJob(jobId, data),
  });
};

/**
 * Create new job (Admin)
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.jobs() });
      toast.success("Job created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create job");
    },
  });
};

/**
 * Update job (Admin)
 */
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobData }) =>
      updateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.jobs() });
      queryClient.invalidateQueries({
        queryKey: cmsKeys.jobDetail(variables.id),
      });
      toast.success("Job updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update job");
    },
  });
};

/**
 * Delete job (Admin)
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.jobs() });
    },
  });
};

// ============================================
// APPLICATIONS QUERIES
// ============================================

/**
 * Get applications with filters (Admin)
 */
export const useApplications = (params: ApplicationsParams = {}) => {
  return useQuery({
    queryKey: cmsKeys.applicationsList(params),
    queryFn: () => getApplications(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get single application by ID (Admin)
 */
export const useApplication = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: cmsKeys.applicationDetail(id),
    queryFn: () => getApplicationById(id),
    enabled: !!id && enabled,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get applications for specific job (Admin)
 */
export const useJobApplications = (jobId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: cmsKeys.jobApplications(jobId),
    queryFn: () => getJobApplications(jobId),
    enabled: !!jobId && enabled,
    staleTime: 2 * 60 * 1000,
  });
};

// ============================================
// APPLICATIONS MUTATIONS
// ============================================

/**
 * Update application status (Admin)
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateApplicationStatusData;
    }) => updateApplicationStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.applications() });
      queryClient.invalidateQueries({
        queryKey: cmsKeys.applicationDetail(variables.id),
      });
      toast.success("Application status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

/**
 * Delete application (Admin)
 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.applications() });
      toast.success("Application deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete application"
      );
    },
  });
};

/**
 * Combined hook for applicants page (Admin)
 */
export const useApplicantsPage = (params: ApplicationsParams = {}) => {
  const applications = useApplications(params);
  const jobs = useJobs({ status: "open" });

  return {
    applications,
    jobs,
    isLoading: applications.isLoading || jobs.isLoading,
    isError: applications.isError || jobs.isError,
  };
};
