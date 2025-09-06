import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import AuthForm from '../components/AuthForm';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if user is already authenticated via NextAuth
    if (status === 'authenticated' && session) {
      router.push('/dashboard/booth');
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (status === 'authenticated') {
    return null;
  }

  const handleLogin = async (emailOrPhone: string, password: string) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        emailOrPhone,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials. Please check your email/phone and password.');
      } else if (result?.ok) {
        toast.success('Login successful!');
        router.push('/dashboard/booth');
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