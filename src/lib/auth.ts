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
    console.log('getCurrentUser: Starting...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('getCurrentUser: Supabase auth response:', { user: !!user, error });
    
    if (error) {
      console.error('getCurrentUser: Auth error:', error);
      return null;
    }
    
    if (!user) {
      console.log('getCurrentUser: No user found in auth');
      return null;
    }
    
    console.log('getCurrentUser: User found in auth, checking allowed_user table...');
    
    // Get user profile from our allowed_user table
    const { data: profile, error: profileError } = await supabase
      .from('allowed_user')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('getCurrentUser: Profile query result:', { profile: !!profile, profileError });
    
    if (profileError) {
      console.error('getCurrentUser: Profile error:', profileError);
      return null;
    }
    
    console.log('getCurrentUser: Returning profile:', profile);
    return profile || null;
  } catch (error) {
    console.error('getCurrentUser: Unexpected error:', error);
    return null;
  }
};

// Login with email or phone
export const login = async (emailOrPhone: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('login: Starting login process for:', emailOrPhone);
    
    // First check if user exists in allowed_user table
    const { data: allowedUser, error: userError } = await supabase
      .from('allowed_user')
      .select('*')
      .or(`email.eq.${emailOrPhone}`)
      // .or(`email.eq.${emailOrPhone},phone_number.eq.${emailOrPhone}`)
      .single();

    console.log('login: Allowed user check:', allowedUser, userError, { allowedUser: !!allowedUser, userError });

    if (userError || !allowedUser) {
      console.log('login: User not found or not authorized');
      return { user: null, error: 'User not found or not authorized' };
    }

    // Use Supabase Auth for authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: allowedUser.email || emailOrPhone,
      password: password,
    });

    console.log('login: Auth response:', { success: !!data.user, error , password});

    if (error) {
      console.error('login: Auth error:', error);
      return { user: null, error: error.message };
    }

    if (data.user) {
      console.log('login: Login successful');
      return { user: allowedUser, error: null };
    }

    console.log('login: Login failed - no user data');
    return { user: null, error: 'Login failed' };
  } catch (error) {
    console.error('login: Unexpected error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Google SSO Login
export const loginWithGoogle = async (): Promise<AuthResponse> => {
  try {
    console.log('loginWithGoogle: Starting Google OAuth...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/booth`
      }
    });

    console.log('loginWithGoogle: OAuth response:', { success: !error, error });

    if (error) {
      console.error('loginWithGoogle: OAuth error:', error);
      return { user: null, error: error.message };
    }

    return { user: null, error: null }; // Will redirect to Google
  } catch (error) {
    console.error('loginWithGoogle: Unexpected error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Register new user (only for admins)
export const registerUser = async (email: string, phone: string, name: string, role: 'admin' | 'manager' = 'manager'): Promise<AuthResponse> => {
  try {
    console.log('registerUser: Starting registration for:', email);
    
    // Call the API route instead of direct Supabase operations
    console.log('registerUser: Making API call to /api/register-user...');
    const response = await fetch('/api/register-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone, name, role }),
    });

    console.log('registerUser: API response status:', response.status);
    const result = await response.json();
    console.log('registerUser: API response:', result);

    if (!response.ok) {
      console.error('registerUser: API error:', result.error);
      return { user: null, error: result.error || 'Registration failed' };
    }

    console.log('registerUser: Registration successful');
    return { 
      user: result.user, 
      error: null 
    };
  } catch (error) {
    console.error('registerUser: Unexpected error:', error);
    return { user: null, error: 'An unexpected error occurred' };
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    console.log('logout: Starting logout...');
    await supabase.auth.signOut();
    console.log('logout: Logout successful');
  } catch (error) {
    console.error('logout: Error during logout:', error);
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    console.log('resetPassword: Starting password reset for:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    console.log('resetPassword: Result:', { success: !error, error });
    
    return { error: error?.message || null };
  } catch (error) {
    console.error('resetPassword: Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    console.log('isAdmin: Checking admin status...');
    const user = await getCurrentUser();
    const isAdminUser = user?.role === 'admin';
    console.log('isAdmin: Result:', isAdminUser);
    return isAdminUser;
  } catch (error) {
    console.error('isAdmin: Error checking admin status:', error);
    return false;
  }
};

// Check if user is manager or admin
export const isManagerOrAdmin = async (): Promise<boolean> => {
  try {
    console.log('isManagerOrAdmin: Checking manager/admin status...');
    const user = await getCurrentUser();
    const isManagerOrAdminUser = user?.role === 'manager' || user?.role === 'admin';
    console.log('isManagerOrAdmin: Result:', isManagerOrAdminUser);
    return isManagerOrAdminUser;
  } catch (error) {
    console.error('isManagerOrAdmin: Error checking manager/admin status:', error);
    return false;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId: number, newRole: 'admin' | 'manager'): Promise<{ error: string | null }> => {
  try {
    console.log('updateUserRole: Updating role for user:', userId, 'to:', newRole);
    
    const { error } = await supabase
      .from('allowed_user')
      .update({ role: newRole })
      .eq('id', userId);

    console.log('updateUserRole: Result:', { success: !error, error });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('updateUserRole: Error updating user role:', error);
    return { error: 'Failed to update user role' };
  }
};

// Delete user (admin only)
export const deleteUser = async (userId: number): Promise<{ error: string | null }> => {
  try {
    console.log('deleteUser: Deleting user:', userId);
    
    const { error } = await supabase
      .from('allowed_user')
      .delete()
      .eq('id', userId);

    console.log('deleteUser: Result:', { success: !error, error });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('deleteUser: Error deleting user:', error);
    return { error: 'Failed to delete user' };
  }
};
