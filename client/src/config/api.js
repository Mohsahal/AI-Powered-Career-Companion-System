// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1000/api";
// API endpoints for Node.js backend
export const API_ENDPOINTS = {
    // Direct endpoints (for backward compatibility with AuthContext)
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/signup`,
    PROFILE_ME: `${API_BASE_URL}/auth/me`,
    GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
    GOOGLE_SIGNUP: `${API_BASE_URL}/auth/google-signup`,
    RESUMES: `${API_BASE_URL}/resume`,
    RESUME_BY_ID: (id) => `${API_BASE_URL}/resume/${id}`,
    INTERVIEWS: `${API_BASE_URL}/interviews`,
    // Nested structure for new code
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/signup`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        PROFILE: `${API_BASE_URL}/auth/me`,
        GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
        GOOGLE_SIGNUP: `${API_BASE_URL}/auth/google-signup`,
    },
    QUESTIONS: {
        GENERATE: `${API_BASE_URL}/ai/generate-questions`,
        GET_BY_INTERVIEW: (interviewId) => `${API_BASE_URL}/questions/interview/${interviewId}`,
    },
    FEEDBACK: {
        SUBMIT: `${API_BASE_URL}/feedback`,
        GET_BY_INTERVIEW: (interviewId) => `${API_BASE_URL}/feedback/interview/${interviewId}`,
    },
    USER_ANSWERS: `${API_BASE_URL}/user-answers`,
    AI: {
        GENERATE_SUMMARY: `${API_BASE_URL}/ai/generate-summary`,
        GENERATE_EXPERIENCE: `${API_BASE_URL}/ai/generate-experience`,
        GENERATE_PROJECT: `${API_BASE_URL}/ai/generate-project`,
        ATS_EVALUATE: `${API_BASE_URL}/ai/ats-evaluate`,
        SKILL_GAP_ANALYSIS: `${API_BASE_URL}/ai/skill-gap-analysis`,
    },
};
// API Client class for making requests
export class ApiClient {
    static baseUrl = API_BASE_URL;
    static async request(endpoint, options = {}) {
        const url = endpoint.startsWith("http")
            ? endpoint
            : `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };
        // Add auth token if available (prefer AuthContext key, fallback to legacy key)
        const token = localStorage.getItem("futurefind_token") ||
            localStorage.getItem("authToken");
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            }
            return response.text();
        }
        catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }
    static async get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    }
    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    static async delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
    }
    // Interview-specific methods
    static async createInterview(interview) {
        return this.post(`${API_BASE_URL}/interviews`, interview);
    }
    static async getInterviews() {
        return this.get(`${API_BASE_URL}/interviews`);
    }
    static async getInterview(id) {
        return this.get(`${API_BASE_URL}/interviews/${id}`);
    }
    static async updateInterview(id, interview) {
        return this.put(`${API_BASE_URL}/interviews/${id}`, interview);
    }
    static async deleteInterview(id) {
        return this.delete(`${API_BASE_URL}/interviews/${id}`);
    }
    // Get interview by ID (returns {success, data} format)
    static async getInterviewById(id, token) {
        const endpoint = `${API_BASE_URL}/interviews/${id}`;
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };
        // Use token from parameter or fallback to localStorage
        if (!token) {
            token =
                localStorage.getItem("futurefind_token") ||
                    localStorage.getItem("authToken") ||
                    undefined;
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }
        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("API request failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    // Get user answers by interview ID (returns {success, data} format)
    static async getUserAnswersByInterview(interviewId, token) {
        const endpoint = `${API_BASE_URL}/user-answers/interview/${interviewId}`;
        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };
        // Use token from parameter or fallback to localStorage
        if (!token) {
            token =
                localStorage.getItem("futurefind_token") ||
                    localStorage.getItem("authToken") ||
                    undefined;
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }
        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("API request failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    // Save user answer (returns {success, data} format)
    static async saveUserAnswer(answerData, token) {
        const endpoint = `${API_BASE_URL}/user-answers`;
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(answerData),
        };
        // Use token from parameter or fallback to localStorage
        if (!token) {
            token =
                localStorage.getItem("futurefind_token") ||
                    localStorage.getItem("authToken") ||
                    undefined;
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }
        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("API request failed:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
/** Submit resume via form (FormData) for AI job recommendations. Server handles Gemini/ML. */
export const submitResumeForJobs = async (resumeFile) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("provider", "all");
  formData.append("only_provider", "false");

  throw new Error("Job recommendations have been removed. Use submitResumeForAts instead.");
};

/** Submit resume + job description for ATS evaluation (Gemini, Node backend). */
export const submitResumeForAts = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  const res = await fetch(API_ENDPOINTS.AI.ATS_EVALUATE, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }
  return data;
};

/** Submit resume + job description for skill gap analysis (Gemini, Node backend). */
export const submitResumeForSkillGap = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  const res = await fetch(API_ENDPOINTS.AI.SKILL_GAP_ANALYSIS, {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }
  return data;
};
// Flask backend removed from this project.
// Default export for convenience
export default {
    API_BASE_URL,
    API_ENDPOINTS,
    ApiClient,
    submitResumeForJobs,
    submitResumeForAts,
    submitResumeForSkillGap,
};
