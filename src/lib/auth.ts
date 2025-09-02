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

// Register a new user
export const registerUser = async (
  email: string,
  phone_number: string,
  name: string,
  role: 'admin' | 'manager'
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // For now, return success for testing purposes
    // In production, this would create a user in the database
    console.log('registerUser: Creating user with:', { email, phone_number, name, role });
    
    // Mock successful registration
    return { success: true, error: null };
  } catch (error) {
    console.error('registerUser: Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
};

// Update user role
export const updateUserRole = async (
  userId: number,
  newRole: 'admin' | 'manager'
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // For now, return success for testing purposes
    // In production, this would update the user role in the database
    console.log('updateUserRole: Updating user role:', { userId, newRole });
    
    // Mock successful update
    return { success: true, error: null };
  } catch (error) {
    console.error('updateUserRole: Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
};

// Delete user
export const deleteUser = async (
  userId: number
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // For now, return success for testing purposes
    // In production, this would delete the user from the database
    console.log('deleteUser: Deleting user:', { userId });
    
    // Mock successful deletion
    return { success: true, error: null };
  } catch (error) {
    console.error('deleteUser: Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
};

// Reset password
export const resetPassword = async (
  email: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // For now, return success for testing purposes
    // In production, this would send a password reset email
    console.log('resetPassword: Resetting password for:', { email });
    
    // Mock successful password reset
    return { success: true, error: null };
  } catch (error) {
    console.error('resetPassword: Error resetting password:', error);
    return { success: false, error: 'Failed to reset password' };
  }
};
