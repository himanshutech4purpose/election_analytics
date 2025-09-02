import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAdmin, logout } from '../../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, Settings, User, Shield, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';

const DeleteAccountPage = () => {
  console.log('delete-account: DeleteAccountPage component rendered');
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log('delete-account: useEffect triggered, calling checkAuth...');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('delete-account: checkAuth called');
    try {
      const currentUser = await getCurrentUser();
      console.log('delete-account: checkAuth - Current user:', currentUser);
      
      if (!currentUser) {
        console.log('delete-account: checkAuth - No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('delete-account: checkAuth - Checking admin status...');
      const adminStatus = await isAdmin(currentUser);
      console.log('delete-account: checkAuth - Admin status:', adminStatus);
      
      if (!adminStatus) {
        console.log('delete-account: checkAuth - User is not admin, redirecting to dashboard');
        router.push('/dashboard/booth');
        return;
      }

      console.log('delete-account: checkAuth - User is admin, setting user and loading to false');
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      console.error('delete-account: checkAuth - Error occurred:', error);
    }
  };

  const handleDeleteAccount = async () => {
    console.log('delete-account: handleDeleteAccount called with confirmation:', deleteConfirmation);
    
    if (deleteConfirmation !== 'DELETE') {
      console.log('delete-account: handleDeleteAccount - Confirmation text does not match DELETE');
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      console.log('delete-account: handleDeleteAccount - Making API call to /api/delete-account...');
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      console.log('delete-account: handleDeleteAccount - API response status:', response.status);
      const result = await response.json();
      console.log('delete-account: handleDeleteAccount - API response:', result);

      if (!response.ok) {
        console.error('delete-account: handleDeleteAccount - API error:', result.error);
        throw new Error(result.error || 'Failed to delete account');
      }

      console.log('delete-account: handleDeleteAccount - Account deleted successfully, logging out...');
      // Logout and redirect
      await logout();
      toast.success('Account deleted successfully');
      router.push('/login');
    } catch (error) {
      console.error('delete-account: handleDeleteAccount - Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleLogout = async () => {
    console.log('delete-account: handleLogout called');
    try {
      await logout();
      console.log('delete-account: handleLogout - Logout successful, redirecting to login');
      router.push('/login');
    } catch (error) {
      console.error('delete-account: handleLogout - Error during logout:', error);
    }
  };

  const handleDeleteConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('delete-account: deleteConfirmation changed to:', e.target.value);
    setDeleteConfirmation(e.target.value);
  };

  const handleShowDeleteModal = () => {
    console.log('delete-account: handleShowDeleteModal called');
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    console.log('delete-account: handleCloseDeleteModal called');
    setShowDeleteModal(false);
    setDeleteConfirmation('');
  };

  console.log('delete-account: Rendering with state:', { 
    loading, 
    user: !!user, 
    showDeleteModal, 
    deleteConfirmation 
  });

  if (loading) {
    console.log('delete-account: Rendering loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  console.log('delete-account: Rendering main view');
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
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Information */}
        <div className="card mb-8">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900">{user?.email || 'No email'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <p className="text-gray-900">{user?.phone || 'No phone'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <p className="text-gray-900">{new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Settings className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <button className="btn-secondary">
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Logout</h3>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-secondary inline-flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="text-lg font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <button 
                onClick={handleShowDeleteModal}
                className="btn-danger inline-flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
              <p className="text-sm text-gray-500 mb-4">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type DELETE to confirm
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="DELETE"
                  value={deleteConfirmation}
                  onChange={handleDeleteConfirmationChange}
                />
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCloseDeleteModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn-danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountPage;