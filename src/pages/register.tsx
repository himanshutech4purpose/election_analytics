import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../lib/auth';

const RegisterPage = () => {
  console.log('register: RegisterPage component rendered');
  
  const router = useRouter();

  useEffect(() => {
    console.log('register: useEffect triggered, checking authentication...');
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log('register: checkAuth - Starting authentication check...');
        const user = await getCurrentUser();
        console.log('register: checkAuth - User result:', user);
        
        if (user) {
          console.log('register: checkAuth - User found, redirecting to dashboard...');
          router.push('/dashboard/booth');
        } else {
          console.log('register: checkAuth - No user found, redirecting to login (admin-only registration)...');
          // Registration is now admin-only, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('register: checkAuth - Error occurred:', error);
      }
    };
    checkAuth();
  }, [router]);

  console.log('register: Rendering loading state');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default RegisterPage;
