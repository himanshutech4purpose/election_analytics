import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAdmin, updateUserRole, deleteUser } from '../../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, Users, Search, Edit, Trash2, UserPlus, Shield, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  name?: string;
  email?: string;
  phone_number?: string;
  role: 'admin' | 'manager';
  created_at: string;
}

const ManageUsersPage = () => {
  console.log('manage-users: ManageUsersPage component rendered');
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('manage-users: useEffect triggered, calling checkAuth and fetchUsers...');
    checkAuth();
    fetchUsers();
  }, []);

  const checkAuth = async () => {
    console.log('manage-users: checkAuth called');
    try {
      const user = await getCurrentUser();
      console.log('manage-users: checkAuth - Current user:', user);
      
      if (!user) {
        console.log('manage-users: checkAuth - No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('manage-users: checkAuth - Checking admin status...');
      const adminStatus = await isAdmin(user);
      console.log('manage-users: checkAuth - Admin status:', adminStatus);
      
      if (!adminStatus) {
        console.log('manage-users: checkAuth - User is not admin, redirecting to dashboard');
        router.push('/dashboard/booth');
        return;
      }
      
      console.log('manage-users: checkAuth - User is admin, proceeding...');
    } catch (error) {
      console.error('manage-users: checkAuth - Error occurred:', error);
    }
  };

  const fetchUsers = async () => {
    console.log('manage-users: fetchUsers called');
    try {
      console.log('manage-users: fetchUsers - Making API call to /api/fetch-users...');
      const response = await fetch('/api/fetch-users');
      console.log('manage-users: fetchUsers - API response status:', response.status);
      
      const result = await response.json();
      console.log('manage-users: fetchUsers - API response:', result);
      
      if (!response.ok) {
        console.error('manage-users: fetchUsers - API error:', result.error);
        throw new Error(result.error || 'Failed to fetch users');
      }
      
      console.log('manage-users: fetchUsers - Setting users:', result.users?.length || 0);
      setUsers(result.users || []);
    } catch (error) {
      console.error('manage-users: fetchUsers - Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      console.log('manage-users: fetchUsers - Setting loading to false');
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    console.log('manage-users: handleDeleteUser called with selectedUser:', selectedUser);
    if (!selectedUser) {
      console.log('manage-users: handleDeleteUser - No selected user');
      return;
    }

    try {
      console.log('manage-users: handleDeleteUser - Calling deleteUser function...');
      const result = await deleteUser(selectedUser.id);
      console.log('manage-users: handleDeleteUser - Delete result:', { success: !result.error, error: result.error });
      
      if (result.error) {
        console.error('manage-users: handleDeleteUser - Delete failed:', result.error);
        toast.error(result.error);
      } else {
        console.log('manage-users: handleDeleteUser - User deleted successfully');
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('manage-users: handleDeleteUser - Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateRole = async (newRole: 'admin' | 'manager') => {
    console.log('manage-users: handleUpdateRole called with newRole:', newRole, 'selectedUser:', selectedUser);
    if (!selectedUser) {
      console.log('manage-users: handleUpdateRole - No selected user');
      return;
    }

    try {
      console.log('manage-users: handleUpdateRole - Calling updateUserRole function...');
      const result = await updateUserRole(selectedUser.id, newRole);
      console.log('manage-users: handleUpdateRole - Update result:', { success: !result.error, error: result.error });
      
      if (result.error) {
        console.error('manage-users: handleUpdateRole - Update failed:', result.error);
        toast.error(result.error);
      } else {
        console.log('manage-users: handleUpdateRole - User role updated successfully');
        toast.success(`User role updated to ${newRole}`);
        setShowRoleModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('manage-users: handleUpdateRole - Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('manage-users: searchTerm changed to:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleEditUser = (user: User) => {
    console.log('manage-users: handleEditUser called with user:', user);
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleDeleteUserClick = (user: User) => {
    console.log('manage-users: handleDeleteUserClick called with user:', user);
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    console.log('manage-users: handleCloseDeleteModal called');
    setShowDeleteModal(false);
  };

  const handleCloseRoleModal = () => {
    console.log('manage-users: handleCloseRoleModal called');
    setShowRoleModal(false);
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('manage-users: Rendering with state:', { 
    loading, 
    usersCount: users.length, 
    filteredUsersCount: filteredUsers.length,
    searchTerm,
    selectedUser: !!selectedUser,
    showDeleteModal,
    showRoleModal
  });

  if (loading) {
    console.log('manage-users: Rendering loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  console.log('manage-users: Rendering main view');
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Users ({filteredUsers.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                      <div className="text-sm text-gray-500">{user.phone_number || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : (
                          <UserCheck className="h-3 w-3 mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUserClick(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No users have been added yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete User</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <strong>{selectedUser.name || selectedUser.email}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCloseDeleteModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update User Role</h3>
              <p className="text-sm text-gray-500 mb-6">
                Change role for <strong>{selectedUser.name || selectedUser.email}</strong>
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCloseRoleModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateRole(selectedUser.role === 'admin' ? 'manager' : 'admin')}
                  className="btn-primary"
                >
                  Make {selectedUser.role === 'admin' ? 'Manager' : 'Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;