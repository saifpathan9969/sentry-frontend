// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  tier: 'free' | 'premium' | 'enterprise';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// Scan types
export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type ScanMode = 'common' | 'fast' | 'full' | 'stealth' | 'aggressive' | 'custom';

export interface Scan {
  id: string;
  user_id: string;
  target: string;
  target_url: string; // Transformed from target
  scan_mode: ScanMode;
  status: ScanStatus;
  result_json?: any;
  result_text?: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
  // Vulnerability counts
  critical_count?: number;
  high_count?: number;
  medium_count?: number;
  low_count?: number;
  total_vulnerabilities?: number;
  vulnerabilities_found?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface CreateScanRequest {
  target_url: string;
  scan_mode: ScanMode;
}

export interface ScanListResponse {
  scans: Scan[];
  total: number;
  limit: number;
  offset: number;
}

// Subscription types
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  tier: 'free' | 'premium' | 'enterprise';
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
}

// API Key types
export interface APIKeyInfo {
  has_api_key: boolean;
  created_at?: string;
}

export interface APIKeyResponse {
  api_key: string;
  message: string;
}

// Usage types
export interface UsageStatistics {
  user_id: string;
  period_days: number;
  start_date: string;
  end_date: string;
  scan_count: number;
  api_call_count: number;
  scans_by_day: Array<{ date: string; count: number }>;
  calls_by_endpoint: Array<{ endpoint: string; count: number }>;
  average_response_time_ms: number;
}

// Error types
export interface APIError {
  detail: string;
}
