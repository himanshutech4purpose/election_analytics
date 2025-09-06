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
  data: Array<{
    caste?: { [key: string]: number };
    age_group?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    pie_chart?: boolean;
    bar_chart?: boolean;
  }>;
}

export interface StateLevelAnalytics {
  id: number;
  created_at: string;
  state_name: string;
  json_data?: StateAnalyticsData;
}

export interface StateAnalyticsData {
  data: Array<{
    caste?: { [key: string]: number };
    religion?: { [key: string]: number };
    age_group?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    migration?: { [key: string]: number };
    poverty_level?: { [key: string]: number };
    amenities?: { [key: string]: number };
    political_preference?: { [key: string]: number };
    pie_chart?: boolean;
    bar_chart?: boolean;
  }>;
}

export interface DistrictLevelAnalytics {
  id: number;
  created_at: string;
  district_name: string;
  json_data?: DistrictAnalyticsData;
}

export interface DistrictAnalyticsData {
  data: Array<{
    caste?: { [key: string]: number };
    religion?: { [key: string]: number };
    age_group?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    migration?: { [key: string]: number };
    poverty_level?: { [key: string]: number };
    amenities?: { [key: string]: number };
    political_preference?: { [key: string]: number };
    pie_chart?: boolean;
    bar_chart?: boolean;
  }>;
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

export interface SearchFilters {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  createdBy?: string;
  name?: string;
  phone_number?: string;
  persona?: string;
  instagram_id?: string;
  facebook_id?: string;
  twitter_id?: string;
  other_social_media_id?: string;
  notes?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }>;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}