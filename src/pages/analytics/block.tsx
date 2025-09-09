import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  ChartBarIcon, 
  ChartPieIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { BlockLevelAnalytics, BlockAnalyticsData } from '../../types';
import { supabase } from '../../lib/supabase';
import { getCurrentUser, User } from '../../lib/auth';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BlockAnalyticsPage = () => {
  const [blockData, setBlockData] = useState<BlockLevelAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<BlockLevelAnalytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await fetchBlockData();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchBlockData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('block_level_analytics')
        .select('*')
        .order('block', { ascending: true });

      if (error) throw error;
      setBlockData(data || []);
      
      if (data && data.length > 0) {
        setSelectedBlock(data[0]);
      }
    } catch (error) {
      console.error('Error fetching block data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlocks = blockData.filter(block => 
    block.block.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prepareChartData = (data: any, type: string) => {
    if (!data) return [];
    
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value as number
    }));
  };

  const renderPieChart = (data: any, title: string) => {
    const chartData = prepareChartData(data, title.toLowerCase());
    
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
    const chartData = prepareChartData(data, title.toLowerCase());
    
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

  const renderAnalyticsCharts = (block: BlockLevelAnalytics) => {
    if (!block.json_data?.data) return null;

    const data = block.json_data.data;
    const charts: JSX.Element[] = [];

    data.forEach((item: any) => {
      if (item.caste && item.pie_chart) {
        charts.push(renderPieChart(item.caste, 'Caste Distribution'));
      }
      if (item.gender && item.pie_chart) {
        charts.push(renderPieChart(item.gender, 'Gender Distribution'));
      }
      if (item.age_group && item.bar_chart) {
        charts.push(renderBarChart(item.age_group, 'Age Group Distribution'));
      }
      if (item.family_size && item.histogram) {
        charts.push(renderBarChart(item.family_size, 'Family Size Distribution'));
      }
      if (item.age_histogram && item.histogram) {
        charts.push(renderBarChart(item.age_histogram, 'Voter Age Distribution'));
      }
      if (item.relationship && item.pie_chart) {
        charts.push(renderPieChart(item.relationship, 'Relationship Distribution'));
      }
      if (item.priority && item.bar_chart) {
        charts.push(renderBarChart(item.priority, 'Priority Distribution'));
      }
      if (item.event_type && item.bar_chart) {
        charts.push(renderBarChart(item.event_type, 'Event Type Distribution'));
      }
    });

    return charts;
  };

  const getBlockSummary = (block: BlockLevelAnalytics) => {
    if (!block.json_data?.data) return null;

    const data = block.json_data.data;
    let totalPopulation = 0;
    let totalFamilies = 0;
    let averageFamilySize = 0;
    let averageAge = 0;
    let medianAge = 0;
    let genderRatio = 0;
    let casteData = null;
    let genderData = null;

    data.forEach((item: any) => {
      if (item.caste) {
        casteData = item.caste;
      }
      if (item.gender) {
        genderData = item.gender;
      }
      if (item.total_population !== undefined) {
        totalPopulation = item.total_population;
      }
      if (item.total_families !== undefined) {
        totalFamilies = item.total_families;
      }
      if (item.average_family_size !== undefined) {
        averageFamilySize = item.average_family_size;
      }
      if (item.average_age !== undefined) {
        averageAge = item.average_age;
      }
      if (item.median_age !== undefined) {
        medianAge = item.median_age;
      }
      if (item.gender_ratio !== undefined) {
        genderRatio = item.gender_ratio;
      }
    });

    return { 
      totalPopulation, 
      totalFamilies, 
      averageFamilySize, 
      averageAge, 
      medianAge, 
      genderRatio, 
      casteData, 
      genderData 
    };
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Block Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Comprehensive analytics and insights for block-level voter data
          </p>
        </div>

        {/* Search and Block Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Blocks
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by block name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Total Blocks:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {blockData.length}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading block data...</p>
          </div>
        ) : blockData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No block data</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding block analytics data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Block List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Select Block</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredBlocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => setSelectedBlock(block)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                        selectedBlock?.id === block.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {block.block}
                          </p>
                          <p className="text-xs text-gray-500">
                            {block.total_panchayats} Panchayats
                          </p>
                          {block.total_villages && (
                            <p className="text-xs text-gray-500">
                              {block.total_villages} Villages
                            </p>
                          )}
                          {block.total_booths && (
                            <p className="text-xs text-gray-500">
                              {block.total_booths} Booths
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(block.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="lg:col-span-3">
              {selectedBlock ? (
                <div className="space-y-6">
                  {/* Block Info and Summary */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedBlock.block} Analytics
                      </h2>
                      <div className="text-sm text-gray-500">
                        Last updated: {new Date(selectedBlock.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {(() => {
                      const summary = getBlockSummary(selectedBlock);
                      if (!summary) return null;

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-600 uppercase">Total Population</p>
                            <p className="text-lg font-bold text-blue-900">{summary.totalPopulation.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xs font-medium text-green-600 uppercase">Total Families</p>
                            <p className="text-lg font-bold text-green-900">{summary.totalFamilies.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs font-medium text-purple-600 uppercase">Avg Family Size</p>
                            <p className="text-lg font-bold text-purple-900">{summary.averageFamilySize.toFixed(1)}</p>
                          </div>
                        </div>
                      );
                    })()}

                    {(() => {
                      const summary = getBlockSummary(selectedBlock);
                      if (!summary) return null;

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-500 uppercase">Panchayats</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedBlock.total_panchayats}</p>
                          </div>
                          {selectedBlock.total_villages && (
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-500 uppercase">Villages</p>
                              <p className="text-sm font-semibold text-gray-900">{selectedBlock.total_villages}</p>
                            </div>
                          )}
                          {selectedBlock.total_booths && (
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs font-medium text-gray-500 uppercase">Booths</p>
                              <p className="text-sm font-semibold text-gray-900">{selectedBlock.total_booths}</p>
                            </div>
                          )}
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-500 uppercase">Gender Ratio</p>
                            <p className="text-sm font-semibold text-gray-900">{summary.genderRatio.toFixed(1)}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderAnalyticsCharts(selectedBlock)}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a block</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose a block from the list to view analytics.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlockAnalyticsPage;
