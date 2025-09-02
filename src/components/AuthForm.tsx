import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Phone, Lock } from 'lucide-react';

interface AuthFormProps {
  onSubmit: (emailOrPhone: string, password: string) => void;
  mode?: 'login' | 'register';
  loading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, mode = 'login', loading = false }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrPhone.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    onSubmit(emailOrPhone.trim(), password);
  };

  const isEmail = emailOrPhone.includes('@');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
          {isEmail ? 'Email address' : 'Phone number'}
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isEmail ? (
              <Mail className="h-5 w-5 text-gray-400" />
            ) : (
              <Phone className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            id="emailOrPhone"
            name="emailOrPhone"
            type={isEmail ? 'email' : 'tel'}
            autoComplete={isEmail ? 'email' : 'tel'}
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={isEmail ? 'Enter your email' : 'Enter your phone number'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your password"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign in'
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Contact administrator
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default AuthForm;