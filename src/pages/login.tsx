import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';
import { login, getCurrentUser, loginWithGoogle } from '../lib/auth';
import { Toaster, toast } from 'react-hot-toast';

const LoginPage = () => {
  console.log('login: LoginPage component rendered');
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('login: useEffect triggered, checking authentication...');
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log('login: checkAuth - Starting authentication check...');
        const user = await getCurrentUser();
        console.log('login: checkAuth - User result:', user);
        
        if (user) {
          console.log('login: checkAuth - User found, redirecting to dashboard...');
          router.push('/dashboard/booth');
        } else {
          console.log('login: checkAuth - No user found, staying on login page');
        }
      } catch (error) {
        console.error('login: checkAuth - Error occurred:', error);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (emailOrPhone: string, password: string) => {
    console.log('login: handleLogin called with emailOrPhone:', emailOrPhone);
    setLoading(true);
    
    try {
      console.log('login: handleLogin - Calling login function...');
      const result = await login(emailOrPhone, password);
      console.log('login: handleLogin - Login result:', { success: !result.error, error: result.error });
      
      if (result.error) {
        console.error('login: handleLogin - Login failed:', result.error);
        toast.error(result.error);
      } else if (result.user) {
        console.log('login: handleLogin - Login successful, redirecting...');
        toast.success('Login successful!');
        router.push('/dashboard/booth');
      }
    } catch (err) {
      console.error('login: handleLogin - Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('login: handleLogin - Setting loading to false');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('login: handleGoogleLogin called');
    setGoogleLoading(true);
    
    try {
      console.log('login: handleGoogleLogin - Calling loginWithGoogle function...');
      const result = await loginWithGoogle();
      console.log('login: handleGoogleLogin - Google login result:', { success: !result.error, error: result.error });
      
      if (result.error) {
        console.error('login: handleGoogleLogin - Google login failed:', result.error);
        toast.error(result.error);
        setGoogleLoading(false);
      } else {
        console.log('login: handleGoogleLogin - Google login successful, redirecting to OAuth...');
        // If successful, user will be redirected to Google OAuth
      }
    } catch (err) {
      console.error('login: handleGoogleLogin - Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
      setGoogleLoading(false);
    }
  };

  console.log('login: Rendering with state:', { loading, googleLoading });
  return (
    <>
      <Toaster position="top-right" />
      <AuthForm 
        onSubmit={handleLogin} 
        onGoogleLogin={handleGoogleLogin}
        mode="login" 
        loading={loading || googleLoading} 
      />
    </>
  );
};

export default LoginPage;