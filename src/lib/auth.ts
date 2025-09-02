import { supabase } from './supabase';

export interface User {
  id: number;
  name?: string;
  email?: string;
  phone_number?: string;
  role: 'admin' | 'manager';
  created_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

// Check if user is authenticated
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // For now, return a mock user for testing
    // In production, this would check a session token or stored user data
    const mockUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      phone_number: '9876543210',
      role: 'admin',
      created_at: new Date().toISOString()
    };
    
    return mockUser;
  } catch (error) {
    console.error('getCurrentUser: Unexpected error:', error);
    return null;
  }
};

// Login with email or phone
export const login = async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
  try {
    // For now, accept any login for testing purposes
    // In production, this would validate against the database
    
    // Check if user exists in allowed_user table
    const { data: allowedUser, error: userError } = await supabase
      .from('allowed_user')
      .select('*')
      .or(`email.eq.${emailOrPhone},phone_number.eq.${emailOrPhone}`)
      .single();

    if (userError || !allowedUser) {
      // For testing, create a mock user if none exists
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
        phone_number: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
        role: 'admin',
        created_at: new Date().toISOString()
      };
      
      return { user: mockUser, error: null };
    }

    return { user: allowedUser, error: null };
  } catch (error) {
    console.error('login: Unexpected error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

// Logout user
export const logout = async (): Promise<void> => {
  // In production, this would clear session tokens
  // For now, just return
  return;
};
