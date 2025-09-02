import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  GlobeAltIcon, 
  ChartBarIcon, 
  ChartPieIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { StateLevelAnalytics, StateAnalyticsData } from '../../types';
import { supabase } from '../../lib/supabase';
import { getCurrentUser, User } from '../../lib/auth';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StateAnalyticsPage = () => {
  const [stateData, setStateData] = useState<StateLevelAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<StateLevelAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await fetchStateData();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchStateData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('state_level_analytics')
        .select('*')
        .order('state_name', { ascending: true });

      if (error) throw error;
      setStateData(data || []);
      
      if (data && data.length > 0) {
        setSelectedState(data[0]);
      }
    } catch (error) {
      console.error('Error fetching state data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStates = stateData.filter(state => 
    state.state_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prepareChartData = (data: any) => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value as number
    }));
  };

  const renderPieChart = (data: any, title: string) => {
    const chartData = prepareChartData(data);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBarChart = (data: any, title: string) => {
    const chartData = prepareChartData(data);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAnalyticsCharts = (state: StateLevelAnalytics) => {
    if (!state.json_data?.data) return null;

    const data = state.json_data.data;
    const charts: JSX.Element[] = [];

    data.forEach((item: any) => {
      if (item.caste && item.pie_chart) {
        charts.push(renderPieChart(item.caste, 'Caste Distribution'));
      }
      if (item.religion && item.pie_chart) {
        charts.push(renderPieChart(item.religion, 'Religion Distribution'));
      }
      if (item.age_group && item.bar_chart) {
        charts.push(renderBarChart(item.age_group, 'Age Group Distribution'));
      }
      if (item.gender && item.pie_chart) {
        charts.push(renderPieChart(item.gender, 'Gender Distribution'));
      }
      if (item.education && item.bar_chart) {
        charts.push(renderBarChart(item.education, 'Education Level Distribution'));
      }
      if (item.occupation && item.pie_chart) {
        charts.push(renderPieChart(item.occupation, 'Occupation Distribution'));
      }
      if (item.migration && item.bar_chart) {
        charts.push(renderBarChart(item.migration, 'Migration Pattern'));
      }
      if (item.poverty_level && item.pie_chart) {
        charts.push(renderPieChart(item.poverty_level, 'Poverty Level Distribution'));
      }
      if (item.amenities && item.bar_chart) {
        charts.push(renderBarChart(item.amenities, 'Amenities Access'));
      }
      if (item.political_preference && item.pie_chart) {
        charts.push(renderPieChart(item.political_preference, 'Political Preference'));
      }
    });

    return charts;
  };

  const getStateSummary = (state: StateLevelAnalytics) => {
    if (!state.json_data?.data) return null;

    const data = state.json_data.data;
    let totalPopulation = 0;
    let casteData = null;
    let religionData = null;

    data.forEach((item: any) => {
      if (item.caste) {
        casteData = item.caste;
        totalPopulation = Object.values(item.caste).reduce((sum: number, val: any) => sum + val, 0);
      }
      if (item.religion) {
        religionData = item.religion;
      }
    });

    return { totalPopulation, casteData, religionData };
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">State Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Comprehensive state-wide voter demographics and trends analysis
          </p>
        </div>

        {/* Search and State Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search States
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by state name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Total States:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {stateData.length}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading state data...</p>
          </div>
        ) : stateData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No state data</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding state analytics data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* State List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Select State</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => setSelectedState(state)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                        selectedState?.id === state.id ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {state.state_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(state.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="lg:col-span-3">
              {selectedState ? (
                <div className="space-y-6">
                  {/* State Info and Summary */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedState.state_name} Analytics
                      </h2>
                      <div className="text-sm text-gray-500">
                        Last updated: {new Date(selectedState.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {(() => {
                      const summary = getStateSummary(selectedState);
                      if (!summary) return null;

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xs font-medium text-green-600 uppercase">Total Population</p>
                            <p className="text-lg font-bold text-green-900">{summary.totalPopulation.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-600 uppercase">Caste Categories</p>
                            <p className="text-lg font-bold text-blue-900">
                              {summary.casteData ? Object.keys(summary.casteData).length : 0}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs font-medium text-purple-600 uppercase">Religion Categories</p>
                            <p className="text-lg font-bold text-purple-900">
                              {summary.religionData ? Object.keys(summary.religionData).length : 0}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderAnalyticsCharts(selectedState)}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a state</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose a state from the list to view analytics.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StateAnalyticsPage;
