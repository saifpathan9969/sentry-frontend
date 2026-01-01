import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refresh_token: refreshToken,
              });

              const { access_token } = response.data;
              localStorage.setItem('access_token', access_token);

              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, full_name?: string) {
    const response = await this.client.post('/auth/register', { email, password, full_name });
    return response.data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async getCurrentUser() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  // Scan endpoints
  async createScan(targetUrl: string, scanMode: string) {
    const response = await this.client.post('/scans/', {
      target_url: targetUrl,
      scan_mode: scanMode,
    });
    const scan = response.data;
    // Transform backend response to match frontend expectations
    return {
      ...scan,
      target_url: scan.target,
      total_vulnerabilities: (scan.critical_count || 0) + (scan.high_count || 0) + 
                             (scan.medium_count || 0) + (scan.low_count || 0),
      vulnerabilities_found: {
        critical: scan.critical_count || 0,
        high: scan.high_count || 0,
        medium: scan.medium_count || 0,
        low: scan.low_count || 0,
      }
    };
  }

  async getScans(limit = 50, offset = 0) {
    const response = await this.client.get('/scans/', {
      params: { limit, offset },
    });
    // Transform backend response to match frontend expectations
    const data = response.data;
    return {
      items: data.scans?.map((scan: any) => ({
        ...scan,
        target_url: scan.target,
        total_vulnerabilities: (scan.critical_count || 0) + (scan.high_count || 0) + 
                               (scan.medium_count || 0) + (scan.low_count || 0),
        vulnerabilities_found: {
          critical: scan.critical_count || 0,
          high: scan.high_count || 0,
          medium: scan.medium_count || 0,
          low: scan.low_count || 0,
        }
      })) || [],
      total: data.total || 0,
      limit: data.limit,
      offset: data.offset,
    };
  }

  async getScan(scanId: string) {
    const response = await this.client.get(`/scans/${scanId}`);
    const scan = response.data;
    // Transform backend response to match frontend expectations
    return {
      ...scan,
      target_url: scan.target,
      total_vulnerabilities: (scan.critical_count || 0) + (scan.high_count || 0) + 
                             (scan.medium_count || 0) + (scan.low_count || 0),
      vulnerabilities_found: {
        critical: scan.critical_count || 0,
        high: scan.high_count || 0,
        medium: scan.medium_count || 0,
        low: scan.low_count || 0,
      }
    };
  }

  async deleteScan(scanId: string) {
    await this.client.delete(`/scans/${scanId}`);
  }

  async getScanReport(scanId: string, format: 'json' | 'text' = 'json') {
    const response = await this.client.get(`/scans/${scanId}/report`, {
      params: { format },
    });
    return response.data;
  }

  // API Key endpoints
  async getAPIKeyInfo() {
    const response = await this.client.get('/users/me/api-key');
    return response.data;
  }

  async generateAPIKey() {
    const response = await this.client.post('/users/me/api-key');
    return response.data;
  }

  async regenerateAPIKey() {
    const response = await this.client.post('/users/me/api-key/regenerate');
    return response.data;
  }

  async revokeAPIKey() {
    await this.client.delete('/users/me/api-key');
  }

  // Subscription endpoints
  async createCheckoutSession(tier: string) {
    const response = await this.client.post('/subscriptions/checkout', { 
      tier,
      success_url: `${window.location.origin}/billing?success=true`,
      cancel_url: `${window.location.origin}/billing?cancelled=true`,
    });
    return {
      checkout_url: response.data.url,
      session_id: response.data.session_id,
    };
  }

  async getSubscription() {
    const response = await this.client.get('/subscriptions/current');
    return response.data;
  }

  async cancelSubscription() {
    const response = await this.client.post('/subscriptions/cancel');
    return response.data;
  }

  // Usage endpoints
  async getUsageStatistics(days = 30) {
    const response = await this.client.get('/users/me/usage', {
      params: { days },
    });
    return response.data;
  }
}

export const apiClient = new APIClient();
