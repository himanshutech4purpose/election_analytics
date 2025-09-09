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
  panchayat?: string;
  village?: string;
  json_data?: BoothAnalyticsData;
}

export interface BoothAnalyticsData {
  data: Array<{
    caste?: { [key: string]: number };
    age_group?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    family_size?: { [key: string]: number };
    pie_chart?: boolean;
    bar_chart?: boolean;
    histogram?: boolean;
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

export interface BlockLevelAnalytics {
  id: number;
  created_at: string;
  block: string;
  total_panchayats: number;
  total_villages?: number;
  total_booths?: number;
  json_data?: BlockAnalyticsData;
}

export interface BlockAnalyticsData {
  data: Array<{
    caste?: { [key: string]: number };
    gender?: { [key: string]: number };
    age_group?: { [key: string]: number };
    family_size?: { [key: string]: number };
    age_histogram?: { [key: string]: number };
    relationship?: { [key: string]: number };
    priority?: { [key: string]: number };
    event_type?: { [key: string]: number };
    total_population?: number;
    total_families?: number;
    average_family_size?: number;
    average_age?: number;
    median_age?: number;
    gender_ratio?: number;
    pie_chart?: boolean;
    bar_chart?: boolean;
    histogram?: boolean;
  }>;
}

export interface VillageLevelAnalytics {
  id: number;
  created_at: string;
  village?: string;
  panchayat?: string;
  block?: string;
  total_booths?: number;
  json_data?: VillageAnalyticsData;
}

export interface VillageAnalyticsData {
  data: Array<{
    caste?: { [key: string]: number };
    gender?: { [key: string]: number };
    age_group?: { [key: string]: number };
    family_size?: { [key: string]: number };
    age_histogram?: { [key: string]: number };
    relationship?: { [key: string]: number };
    priority?: { [key: string]: number };
    event_type?: { [key: string]: number };
    total_population?: number;
    total_families?: number;
    average_family_size?: number;
    average_age?: number;
    median_age?: number;
    gender_ratio?: number;
    pie_chart?: boolean;
    bar_chart?: boolean;
    histogram?: boolean;
  }>;
}

export interface PanchayatLevelAnalytics {
  id: number;
  created_at: string;
  panchayat?: string;
  block?: string;
  total_booths?: number;
  json_data?: PanchayatAnalyticsData;
}

export interface PanchayatAnalyticsData {
  data: Array<{
    caste?: { [key: string]: number };
    gender?: { [key: string]: number };
    age_group?: { [key: string]: number };
    family_size?: { [key: string]: number };
    age_histogram?: { [key: string]: number };
    relationship?: { [key: string]: number };
    priority?: { [key: string]: number };
    event_type?: { [key: string]: number };
    total_population?: number;
    total_families?: number;
    average_family_size?: number;
    average_age?: number;
    median_age?: number;
    gender_ratio?: number;
    pie_chart?: boolean;
    bar_chart?: boolean;
    histogram?: boolean;
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