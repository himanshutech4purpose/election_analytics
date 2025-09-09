import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UsersIcon, 
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { BoothLevelAnalytics, KeyPerson } from '../../types';
import { supabase } from '../../lib/supabase';
import { getCurrentUser, User } from '../../lib/auth';

const BoothDashboardPage = () => {
  const [boothData, setBoothData] = useState<BoothLevelAnalytics[]>([]);
  const [keyPeople, setKeyPeople] = useState<KeyPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await fetchDashboardData();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch booth data
      const { data: boothResult, error: boothError } = await supabase
        .from('booth_level_analytics')
        .select('*')
        .order('booth_number', { ascending: true });

      if (boothError) throw boothError;

      // Fetch key people data
      const { data: peopleResult, error: peopleError } = await supabase
        .from('key_people')
        .select('*')
        .order('created_at', { ascending: false });

      if (peopleError) throw peopleError;

      setBoothData(boothResult || []);
      setKeyPeople(peopleResult || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPopulation = () => {
    let total = 0;
    boothData.forEach(booth => {
      if (booth.json_data?.data) {
        booth.json_data.data.forEach((item: any) => {
          if (item.caste) {
            Object.values(item.caste).forEach((value: any) => {
              total += value;
            });
          }
        });
      }
    });
    return total;
  };

  const getRecentActivity = () => {
    const activities: Array<{
      type: string;
      message: string;
      time: string;
      icon: any;
      color: string;
    }> = [];
    
    // Add recent booth updates
    boothData.slice(0, 3).forEach(booth => {
      activities.push({
        type: 'booth',
        message: `Booth #${booth.booth_number} data updated`,
        time: new Date(booth.created_at).toLocaleDateString(),
        icon: ChartBarIcon,
        color: 'text-blue-600'
      });
    });

    // Add recent key people additions
    keyPeople.slice(0, 2).forEach(person => {
      activities.push({
        type: 'person',
        message: `Key person "${person.name}" added`,
        time: new Date(person.created_at).toLocaleDateString(),
        icon: UsersIcon,
        color: 'text-green-600'
      });
    });

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booth Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of booth operations and key personnel management
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HomeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Booths</p>
                    <p className="text-2xl font-bold text-gray-900">{boothData.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Key People</p>
                    <p className="text-2xl font-bold text-gray-900">{keyPeople.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Population</p>
                    <p className="text-2xl font-bold text-gray-900">{getTotalPopulation().toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Locations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {boothData.filter(b => b.panchayat || b.village).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/key-people"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add Key Person</p>
                    <p className="text-xs text-gray-500">Manage booth workers</p>
                  </div>
                </Link>

                <Link
                  href="/analytics/booth"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Analytics</p>
                    <p className="text-xs text-gray-500">Booth-level insights</p>
                  </div>
                </Link>

                <Link
                  href="/analytics/district"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BuildingOfficeIcon className="h-6 w-6 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">District View</p>
                    <p className="text-xs text-gray-500">District-level data</p>
                  </div>
                </Link>

                <Link
                  href="/analytics/state"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <GlobeAltIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">State Overview</p>
                    <p className="text-xs text-gray-500">State-wide trends</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Booths */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Booths</h3>
                  <Link
                    href="/analytics/booth"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Population
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {boothData.slice(0, 5).map((booth) => {
                      let population = 0;
                      if (booth.json_data?.data) {
                        booth.json_data.data.forEach((item: any) => {
                          if (item.caste) {
                            population += Object.values(item.caste).reduce((sum: number, val: any) => sum + val, 0);
                          }
                        });
                      }
                      
                      return (
                        <tr key={booth.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              Booth #{booth.booth_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booth.panchayat || booth.village || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {population.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(booth.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/analytics/booth?booth=${booth.booth_number}`}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              <EyeIcon className="h-4 w-4 inline mr-1" />
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {getRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full mr-3 ${activity.color.replace('text-', 'bg-')}`}></div>
                    <activity.icon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{activity.message}</span>
                    <span className="ml-auto text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BoothDashboardPage;