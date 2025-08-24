export interface User {
  id: number;
  name?: string;
  email?: string;
  phone_number?: string;
  role: 'admin' | 'manager';
  created_at: string;
}

export interface KeyPerson {
  id: number;
  created_at: string;
  name: string;
  phone_number?: string;
  notes?: string;
  created_by: string;
  geolocation_url?: string;
  instagram_id?: string;
  facebook_id?: string;
  twitter_id?: string;
  other_social_media_id?: string;
  longitude?: string;
  latitude?: string;
  persona?: string;
}

export interface BoothLevelAnalytics {
  id: number;
  created_at: string;
  booth_number: number;
  panchayat_name?: string;
  json_data?: BoothAnalyticsData;
  Main_Town?: string;
}

export interface BoothAnalyticsData {
  caste?: {
    [key: string]: number;
  };
  age?: {
    [key: string]: number;
  };
  gender?: {
    [key: string]: number;
  };
  education?: {
    [key: string]: number;
  };
  occupation?: {
    [key: string]: number;
  };
  [key: string]: any;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface KeyPersonFormData {
  name: string;
  phone_number?: string;
  notes?: string;
  geolocation_url?: string;
  instagram_id?: string;
  facebook_id?: string;
  twitter_id?: string;
  other_social_media_id?: string;
  longitude?: string;
  latitude?: string;
  persona?: string;
}

export interface AddUserFormData {
  name: string;
  email: string;
  phone_number: string;
  role: 'admin' | 'manager';
}