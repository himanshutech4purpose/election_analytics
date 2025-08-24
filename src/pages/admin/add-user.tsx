import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAdmin, registerUser } from '../../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, Save, UserPlus, Mail, Phone, User, Shield, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface AddUserFormData {
  name: string;
  email: string;
  phone_number: string;
  role: 'admin' | 'manager';
}

const AddUserPage = () => {
  console.log('add-user: AddUserPage component rendered');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddUserFormData>({
    name: '',
    email: '',
    phone_number: '',
    role: 'manager',
  });
  const router = useRouter();

  useEffect(() => {
    console.log('add-user: useEffect triggered, calling checkAuth...');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('add-user: checkAuth called');
    try {
      const user = await getCurrentUser();
      console.log('add-user: checkAuth - Current user:', user);
      
      if (!user) {
        console.log('add-user: checkAuth - No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('add-user: checkAuth - Checking admin status...');
      const adminStatus = await isAdmin();
      console.log('add-user: checkAuth - Admin status:', adminStatus);
      
      if (!adminStatus) {
        console.log('add-user: checkAuth - User is not admin, redirecting to dashboard');
        router.push('/dashboard/booth');
        return;
      }
      
      console.log('add-user: checkAuth - User is admin, proceeding...');
    } catch (error) {
      console.error('add-user: checkAuth - Error occurred:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('add-user: handleInputChange called with:', { name, value });
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('add-user: handleInputChange - Updated formData:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('add-user: handleSubmit called with formData:', formData);
    e.preventDefault();
    setLoading(true);

    try {
      console.log('add-user: handleSubmit - Calling registerUser function...');
      const result = await registerUser(
        formData.email,
        formData.phone_number,
        formData.name,
        formData.role
      );

      console.log('add-user: handleSubmit - Register user result:', { success: !result.error, error: result.error });

      if (result.error) {
        console.error('add-user: handleSubmit - Registration failed:', result.error);
        toast.error(result.error);
      } else {
        console.log('add-user: handleSubmit - User added successfully');
        toast.success('User added successfully! Default password has been generated.');
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          role: 'manager',
        });
      }
    } catch (error) {
      console.error('add-user: handleSubmit - Error adding user:', error);
      toast.error('Failed to add user');
    } finally {
      console.log('add-user: handleSubmit - Setting loading to false');
      setLoading(false);
    }
  };

  console.log('add-user: Rendering with state:', { loading, formData });
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/booth" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">User Information</h2>
            <p className="text-sm text-gray-600">
              Add a new user to the system. A default password will be generated automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
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
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
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
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone_number" className="form-label">
                Phone Number *
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
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.role === 'admin' ? (
                    <Shield className="h-5 w-5 text-red-500" />
                  ) : (
                    <UserCheck className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <select
                  id="role"
                  name="role"
                  required
                  className="input-field pl-10"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Managers can add key people and view booth analytics. Admins have full access including user management.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/dashboard/booth" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.email || !formData.phone_number}
                className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
