/**
 * CMS/Jobs API - Content management endpoints
 */

import apiClient, { ApiResponse } from "./client";

// ============================================
// TYPES
// ============================================

export interface Job {
  id: string;
  title: string;
  description: string;
  type: string; // Full-Time, Part-Time, Contract
  department: string; // Store, Operations, Tech
  location: string;
  status: string; // open, closed
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  cv_url?: string;
  cover_letter?: string;
  status: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
  job?: Job;
}

export interface JobsParams {
  status?: string;
  department?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApplicationsParams {
  status?: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
  jobId?: string;
  search?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

interface JobsResponse {
  jobs: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApplicationsResponse {
  applications: JobApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateJobData {
  title: string;
  description: string;
  type: string;
  department: string;
  location: string;
  status?: string;
}

export type UpdateJobData = Partial<CreateJobData>;

export interface ApplyJobData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  cv?: File;
}

export interface UpdateApplicationStatusData {
  status: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
  notes?: string;
}

// ============================================
// JOBS API FUNCTIONS
// ============================================

/**
 * Get all job postings (Public)
 */
export const getJobs = async (
  params: JobsParams = {}
): Promise<{
  jobs: Job[];
  meta: JobsResponse["meta"];
}> => {
  const response = await apiClient.get<ApiResponse<Job[]>>("/cms/jobs", {
    params: {
      status: params.status,
      department: params.department,
      type: params.type,
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });

  return {
    jobs: response.data.data,
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 1,
    },
  };
};

/**
 * Get single job by ID (Public)
 */
export const getJobById = async (id: string): Promise<Job> => {
  const response = await apiClient.get<ApiResponse<Job>>(`/cms/jobs/${id}`);
  return response.data.data;
};

/**
 * Get active job openings (Public)
 */
export const getActiveJobs = async (): Promise<Job[]> => {
  const response = await getJobs({ status: "active", limit: 100 });
  return response.jobs;
};

/**
 * Apply for a job (Public)
 */
export const applyForJob = async (
  jobId: string,
  data: ApplyJobData
): Promise<JobApplication> => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  if (data.coverLetter) formData.append("coverLetter", data.coverLetter);
  if (data.cv) formData.append("cv", data.cv);

  const response = await apiClient.post<ApiResponse<JobApplication>>(
    `/cms/jobs/${jobId}/apply`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data.data;
};

// ============================================
// ADMIN JOBS ENDPOINTS
// ============================================

/**
 * Create new job posting (Admin only)
 */
export const createJob = async (data: CreateJobData): Promise<Job> => {
  const response = await apiClient.post<ApiResponse<Job>>("/cms/jobs", data);
  return response.data.data;
};

/**
 * Update job posting (Admin only)
 */
export const updateJob = async (
  id: string,
  data: UpdateJobData
): Promise<Job> => {
  const response = await apiClient.patch<ApiResponse<Job>>(
    `/cms/jobs/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete job posting (Admin only)
 */
export const deleteJob = async (id: string): Promise<void> => {
  await apiClient.delete(`/cms/jobs/${id}`);
};

// ============================================
// APPLICATIONS API FUNCTIONS
// ============================================

/**
 * Get all job applications (Admin only)
 */
export const getApplications = async (
  params: ApplicationsParams = {}
): Promise<{
  applications: JobApplication[];
  meta: ApplicationsResponse["meta"];
}> => {
  const response = await apiClient.get<ApiResponse<JobApplication[]>>(
    "/cms/admin/applications",
    {
      params: {
        status: params.status,
        jobId: params.jobId,
        search: params.search,
        sort: params.sort,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    }
  );

  return {
    applications: response.data.data,
    meta: response.data.meta ?? {
      total: response.data.data.length,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      totalPages: 1,
    },
  };
};

/**
 * Get single application by ID (Admin only)
 */
export const getApplicationById = async (
  id: string
): Promise<JobApplication> => {
  const response = await apiClient.get<ApiResponse<JobApplication>>(
    `/cms/admin/applications/${id}`
  );
  return response.data.data;
};

/**
 * Get applications for specific job (Admin only)
 */
export const getJobApplications = async (
  jobId: string
): Promise<JobApplication[]> => {
  const response = await getApplications({ jobId, limit: 100 });
  return response.applications;
};

/**
 * Update application status (Admin only)
 */
export const updateApplicationStatus = async (
  id: string,
  data: UpdateApplicationStatusData
): Promise<JobApplication> => {
  const response = await apiClient.patch<ApiResponse<JobApplication>>(
    `/cms/admin/applications/${id}/status`,
    data
  );
  return response.data.data;
};

/**
 * Delete application (Admin only)
 */
export const deleteApplication = async (id: string): Promise<void> => {
  await apiClient.delete(`/cms/admin/applications/${id}`);
};

/**
 * Download application CV (Admin only)
 */
export const downloadApplicationCV = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/cms/admin/applications/${id}/cv`, {
    responseType: "blob",
  });
  return response.data;
};
