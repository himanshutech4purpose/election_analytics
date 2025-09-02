import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';
import { login, getCurrentUser } from '../lib/auth';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // User is already logged in, redirect to dashboard
          router.push('/');
        }
      } catch (error) {
        // User is not authenticated, stay on login page
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (emailOrPhone: string, password: string) => {
    setLoading(true);
    try {
      const result = await login(emailOrPhone, password);
      
      if (result.user) {
        toast.success('Login successful!');
        router.push('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Voter Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to your account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm 
            onSubmit={handleLogin}
            loading={loading}
            mode="login"
          />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Need help?
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Contact your administrator for access credentials
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}