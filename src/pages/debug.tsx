import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { RefreshCw, User, Mail, Phone, Shield, UserCheck } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  created_at: string;
}

const DebugPage = () => {
  console.log('debug: DebugPage component rendered');
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    console.log('debug: fetchUsers called');
    setLoading(true);
    
    try {
      console.log('debug: fetchUsers - Making API call to /api/list-users...');
      const response = await fetch('/api/list-users');
      console.log('debug: fetchUsers - API response status:', response.status);
      
      const result = await response.json();
      console.log('debug: fetchUsers - API response:', result);
      
      if (response.ok) {
        console.log('debug: fetchUsers - Setting users:', result.users);
        setUsers(result.users || []);
        console.log('debug: fetchUsers - Users found:', result.users);
      } else {
        console.error('debug: fetchUsers - API error:', result.error);
        toast.error(result.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('debug: fetchUsers - Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      console.log('debug: fetchUsers - Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('debug: useEffect triggered, calling fetchUsers...');
    fetchUsers();
  }, []);

  const handleRefreshClick = () => {
    console.log('debug: handleRefreshClick called');
    fetchUsers();
  };

  console.log('debug: Rendering with state:', { usersCount: users.length, loading });
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Database Debug</h1>
              <button
                onClick={handleRefreshClick}
                disabled={loading}
                className="btn-primary inline-flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh Users
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Check what users exist in the allowed_user table
            </p>
          </div>

          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                <p className="text-gray-600 mb-4">
                  No users exist in the allowed_user table yet.
                </p>
                <a
                  href="/setup"
                  className="btn-primary inline-flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Create First Admin User
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Users in Database ({users.length})
                </h3>
                <div className="grid gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {user.role === 'admin' ? (
                            <Shield className="h-5 w-5 text-red-500" />
                          ) : (
                            <UserCheck className="h-5 w-5 text-blue-500" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{user.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {user.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {user.phone_number}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Manager'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;

