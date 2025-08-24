import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

const ResetPasswordPage = () => {
  console.log('reset-password: ResetPasswordPage component rendered');
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('reset-password: handleSubmit called with email:', email);
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('reset-password: handleSubmit - Calling resetPassword function...');
      const result = await resetPassword(email);
      console.log('reset-password: handleSubmit - Reset password result:', { success: !result.error, error: result.error });
      
      if (result.error) {
        console.error('reset-password: handleSubmit - Reset password failed:', result.error);
        toast.error(result.error);
      } else {
        console.log('reset-password: handleSubmit - Reset password successful, setting sent to true');
        setSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (err) {
      console.error('reset-password: handleSubmit - Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      console.log('reset-password: handleSubmit - Setting loading to false');
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('reset-password: email changed to:', e.target.value);
    setEmail(e.target.value);
  };

  console.log('reset-password: Rendering with state:', { email, loading, sent });

  if (sent) {
    console.log('reset-password: Rendering success state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to {email}
            </p>
            <div className="mt-6">
              <Link href="/login" className="btn-primary">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('reset-password: Rendering form state');
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;