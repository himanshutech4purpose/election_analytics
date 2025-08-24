import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../lib/auth';

const HomePage = () => {
  console.log('index: HomePage component rendered');
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('index: useEffect triggered, router:', router);
    
    const checkAuth = async () => {
      try {
        console.log('index: checkAuth - Starting authentication check...');
        const user = await getCurrentUser();
        console.log('index: checkAuth - User result:', user);
        
        if (user) {
          console.log('index: checkAuth - User found, redirecting to dashboard...');
          router.push('/dashboard/booth');
        } else {
          console.log('index: checkAuth - No user found, redirecting to login...');
          router.push('/login');
        }
      } catch (err) {
        console.error('index: checkAuth - Error occurred:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  console.log('index: Rendering with state:', { loading, error });

  if (error) {
    console.log('index: Rendering error state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              console.log('index: Error page - Go to Login button clicked');
              router.push('/login');
            }}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  console.log('index: Rendering loading state');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default HomePage;