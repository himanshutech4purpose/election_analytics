import { useState } from 'react';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { UserPlus, Shield, Mail, Phone, User } from 'lucide-react';

const SetupPage = () => {
  console.log('setup: SetupPage component rendered');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'hs230998@gmail.com',
    phone_number: '987738125',
    role: 'admin' as 'admin' | 'manager'
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('setup: handleInputChange called with:', { name, value });
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('setup: handleInputChange - Updated formData:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('setup: handleSubmit called with formData:', formData);
    e.preventDefault();
    setLoading(true);

    try {
      console.log('setup: handleSubmit - Adding first admin user:', formData);

      // Call the API route instead of direct Supabase calls
      console.log('setup: handleSubmit - Making API call to /api/setup-admin...');
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('setup: handleSubmit - API response status:', response.status);
      const result = await response.json();
      console.log('setup: handleSubmit - API response:', result);

      if (!response.ok) {
        console.error('setup: handleSubmit - API error:', result.error);
        toast.error(result.error || 'Failed to create admin user');
        return;
      }

      console.log('setup: handleSubmit - Admin user created successfully');
      toast.success(`Admin user created successfully! Email: ${result.credentials.email}, Password: ${result.credentials.password}`);
      
      // Redirect to login after a short delay
      console.log('setup: handleSubmit - Redirecting to login in 2 seconds...');
      setTimeout(() => {
        console.log('setup: handleSubmit - Executing redirect to login');
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error('setup: handleSubmit - Unexpected error:', error);
      toast.error('Failed to create admin user');
    } finally {
      console.log('setup: handleSubmit - Setting loading to false');
      setLoading(false);
    }
  };

  console.log('setup: Rendering with state:', { loading, formData });
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Initial Setup
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create the first admin user for the Voter Intelligence system
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-field pl-10"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input-field pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone_number" className="form-label">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  required
                  className="input-field pl-10"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <select
                  id="role"
                  name="role"
                  required
                  className="input-field pl-10"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Default Password
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>The default password will be: <strong>admin123</strong></p>
                    <p className="mt-1">You can change this after logging in.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Create Admin User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
