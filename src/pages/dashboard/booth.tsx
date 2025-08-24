import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAdmin, isManagerOrAdmin, logout } from '../../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Users, 
  MapPin, 
  BarChart3, 
  LogOut, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Shield,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import BoothAnalyticsCharts from '../../components/BoothAnalyticsCharts';

interface BoothAnalytics {
  id: number;
  booth_number: number;
  panchayat_name: string;
  Main_Town: string;
  json_data: any;
  created_at: string;
}

interface KeyPerson {
  id: number;
  name: string;
  phone_number?: string;
  notes?: string;
  persona?: string;
  geolocation_url?: string;
  created_at: string;
}

const BoothDashboard = () => {
  console.log('booth: BoothDashboard component rendered');
  
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isManagerOrAdminUser, setIsManagerOrAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [boothData, setBoothData] = useState<BoothAnalytics[]>([]);
  const [keyPeople, setKeyPeople] = useState<KeyPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBooth, setFilterBooth] = useState('');
  const [selectedBooth, setSelectedBooth] = useState<BoothAnalytics | null>(null);
  const [showCharts, setShowCharts] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('booth: useEffect triggered, calling checkAuth and fetchData...');
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    console.log('booth: checkAuth called');
    try {
      const currentUser = await getCurrentUser();
      console.log('booth: checkAuth - Current user:', currentUser);
      
      if (!currentUser) {
        console.log('booth: checkAuth - No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      console.log('booth: checkAuth - Checking admin status...');
      const adminStatus = await isAdmin();
      console.log('booth: checkAuth - Admin status:', adminStatus);
      
      console.log('booth: checkAuth - Checking manager/admin status...');
      const managerOrAdminStatus = await isManagerOrAdmin();
      console.log('booth: checkAuth - Manager/Admin status:', managerOrAdminStatus);
      
      setIsAdminUser(adminStatus);
      setIsManagerOrAdminUser(managerOrAdminStatus);
      setLoading(false);
    } catch (error) {
      console.error('booth: checkAuth - Error occurred:', error);
    }
  };

  const fetchData = async () => {
    console.log('booth: fetchData called');
    try {
      console.log('booth: fetchData - Making API call to /api/fetch-dashboard-data...');
      const response = await fetch('/api/fetch-dashboard-data');
      console.log('booth: fetchData - API response status:', response.status);
      
      const result = await response.json();
      console.log('booth: fetchData - API response:', result);
      
      if (!response.ok) {
        console.error('booth: fetchData - API error:', result.error);
        throw new Error(result.error || 'Failed to load data');
      }
      
      console.log('booth: fetchData - Setting booth data:', result.boothAnalytics?.length || 0);
      setBoothData(result.boothAnalytics || []);
      
      console.log('booth: fetchData - Setting key people:', result.keyPeople?.length || 0);
      setKeyPeople(result.keyPeople || []);
    } catch (error) {
      console.error('booth: fetchData - Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleLogout = async () => {
    console.log('booth: handleLogout called');
    try {
      await logout();
      console.log('booth: handleLogout - Logout successful, redirecting to login');
      router.push('/login');
    } catch (error) {
      console.error('booth: handleLogout - Error during logout:', error);
    }
  };

  const handleViewCharts = (booth: BoothAnalytics) => {
    console.log('booth: handleViewCharts called with booth:', booth);
    setSelectedBooth(booth);
    setShowCharts(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('booth: searchTerm changed to:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleFilterBoothChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('booth: filterBooth changed to:', e.target.value);
    setFilterBooth(e.target.value);
  };

  const handleBackToDashboard = () => {
    console.log('booth: handleBackToDashboard called');
    setShowCharts(false);
  };

  const filteredBoothData = boothData.filter(booth => 
    booth.booth_number.toString().includes(filterBooth) &&
    booth.panchayat_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredKeyPeople = keyPeople.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.persona?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('booth: Rendering with state:', { 
    loading, 
    user: !!user, 
    isAdminUser, 
    isManagerOrAdminUser, 
    boothDataCount: boothData.length, 
    keyPeopleCount: keyPeople.length,
    searchTerm,
    filterBooth,
    showCharts,
    selectedBooth: !!selectedBooth
  });

  if (loading) {
    console.log('booth: Rendering loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (showCharts && selectedBooth) {
    console.log('booth: Rendering charts view');
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleBackToDashboard}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <BarChart3 className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Booth Analytics</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</span>
                {isAdminUser && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}
                {!isAdminUser && isManagerOrAdminUser && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Manager
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BoothAnalyticsCharts 
            data={selectedBooth.json_data} 
            boothNumber={selectedBooth.booth_number} 
          />
        </div>
      </div>
    );
  }

  console.log('booth: Rendering main dashboard view');
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Voter Intelligence Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</span>
              {isAdminUser && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </span>
              )}
              {!isAdminUser && isManagerOrAdminUser && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Manager
                </span>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Booths</dt>
                  <dd className="text-lg font-medium text-gray-900">{boothData.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Key People</dt>
                  <dd className="text-lg font-medium text-gray-900">{keyPeople.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Panchayats</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {new Set(boothData.map(b => b.panchayat_name)).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, persona, or panchayat..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Filter by booth number"
              className="input-field w-48"
              value={filterBooth}
              onChange={handleFilterBoothChange}
            />
            {isManagerOrAdminUser && (
              <Link href="/admin/add-key-people" className="btn-primary inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Key Person
              </Link>
            )}
          </div>
        </div>

        {/* Booth Analytics Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Booth Analytics</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booth Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Panchayat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Main Town
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBoothData.map((booth) => (
                  <tr key={booth.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booth.booth_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booth.panchayat_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booth.Main_Town}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booth.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewCharts(booth)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      {isAdminUser && (
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBoothData.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No booth data found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterBooth ? 'Try adjusting your search or filter criteria.' : 'No booth analytics have been added yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        {isAdminUser && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/add-user" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Add User</h3>
                  <p className="text-sm text-gray-500">Add new users to the system</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/manage-users" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-500">Edit or remove user accounts</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/add-key-people" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Key People</h3>
                  <p className="text-sm text-gray-500">Add influential people to the database</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/delete-account" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-500">Manage your account preferences</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoothDashboard;