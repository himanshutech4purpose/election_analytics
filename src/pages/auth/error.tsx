import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (error === 'AccessDenied') {
      toast.error('Access denied. Your email is not in the allowed users list. Please contact administrator.');
    } else if (error === 'Configuration') {
      toast.error('There is a problem with the server configuration.');
    } else if (error === 'Verification') {
      toast.error('The verification token has expired or has already been used.');
    } else {
      toast.error('An error occurred during authentication.');
    }
    
    // Redirect to login after showing error
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  }, [error, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-lg text-gray-600">
            {error === 'AccessDenied' 
              ? 'Your email is not in the allowed users list'
              : 'An error occurred during authentication'
            }
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
