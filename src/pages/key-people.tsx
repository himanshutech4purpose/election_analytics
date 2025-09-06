import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import { KeyPerson, SearchFilters } from '../types';
import { supabase } from '../lib/supabase';
import { getCurrentUser, User } from '../lib/auth';

const KeyPeoplePage = () => {
  const [keyPeople, setKeyPeople] = useState<KeyPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await fetchKeyPeople();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchKeyPeople = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('key_people')
        .select('*')
        .order('created_at', { ascending: false });

      // General search across multiple fields
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%,persona.ilike.%${searchTerm}%,instagram_id.ilike.%${searchTerm}%,facebook_id.ilike.%${searchTerm}%,twitter_id.ilike.%${searchTerm}%,other_social_media_id.ilike.%${searchTerm}%`);
      }

      // Column-specific filters
      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }

      if (filters.phone_number) {
        query = query.ilike('phone_number', `%${filters.phone_number}%`);
      }

      if (filters.persona) {
        query = query.ilike('persona', `%${filters.persona}%`);
      }

      if (filters.instagram_id) {
        query = query.ilike('instagram_id', `%${filters.instagram_id}%`);
      }

      if (filters.facebook_id) {
        query = query.ilike('facebook_id', `%${filters.facebook_id}%`);
      }

      if (filters.twitter_id) {
        query = query.ilike('twitter_id', `%${filters.twitter_id}%`);
      }

      if (filters.other_social_media_id) {
        query = query.ilike('other_social_media_id', `%${filters.other_social_media_id}%`);
      }

      if (filters.notes) {
        query = query.ilike('notes', `%${filters.notes}%`);
      }

      // Date filters
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters.createdBy) {
        query = query.ilike('created_by', `%${filters.createdBy}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setKeyPeople(data || []);
    } catch (error) {
      console.error('Error fetching key people:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchKeyPeople();
    }
  }, [searchTerm, filters, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchKeyPeople();
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Key People Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage booth workers and key personnel information
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Key Person
          </button>
        </div>

        {/* Advanced Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* General Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                General Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search across all fields..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Column-specific Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Column-specific Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="nameFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="nameFilter"
                    value={filters.name || ''}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    placeholder="e.g., hima, iman..."
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phoneFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneFilter"
                    value={filters.phone_number || ''}
                    onChange={(e) => setFilters({ ...filters, phone_number: e.target.value })}
                    placeholder="e.g., 987, +91..."
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="personaFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Persona
                  </label>
                  <input
                    type="text"
                    id="personaFilter"
                    value={filters.persona || ''}
                    onChange={(e) => setFilters({ ...filters, persona: e.target.value })}
                    placeholder="e.g., leader, worker..."
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="instagramFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Instagram ID
                  </label>
                  <input
                    type="text"
                    id="instagramFilter"
                    value={filters.instagram_id || ''}
                    onChange={(e) => setFilters({ ...filters, instagram_id: e.target.value })}
                    placeholder="e.g., @username..."
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="facebookFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Facebook ID
                  </label>
                  <input
                    type="text"
                    id="facebookFilter"
                    value={filters.facebook_id || ''}
                    onChange={(e) => setFilters({ ...filters, facebook_id: e.target.value })}
                    placeholder="e.g., facebook.com/..."
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="twitterFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Twitter ID
                  </label>
                  <input
                    type="text"
                    id="twitterFilter"
                    value={filters.twitter_id || ''}
                    onChange={(e) => setFilters({ ...filters, twitter_id: e.target.value })}
                    placeholder="e.g., @username..."
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="notesFilter" className="block text-xs font-medium text-gray-600 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    id="notesFilter"
                    value={filters.notes || ''}
                    onChange={(e) => setFilters({ ...filters, notes: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search in notes..."
                  />
                </div>
              </div>
            </div>

            {/* Date and Creator Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  id="dateTo"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Created By
                </label>
                <input
                  type="text"
                  id="createdBy"
                  value={filters.createdBy || ''}
                  onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })}
                  placeholder="Filter by creator..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all filters
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Key People ({keyPeople.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : keyPeople.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No key people found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Social Media
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keyPeople.map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                            {person.persona && (
                              <div className="text-sm text-gray-500">{person.persona}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {person.phone_number && (
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              {person.phone_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {person.instagram_id && (
                            <a
                              href={person.instagram_id}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-900"
                            >
                              Instagram
                            </a>
                          )}
                          {person.facebook_id && (
                            <a
                              href={person.facebook_id}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Facebook
                            </a>
                          )}
                          {person.twitter_id && (
                            <a
                              href={person.twitter_id}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-700"
                            >
                              Twitter
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {person.geolocation_url && (
                          <a
                            href={person.geolocation_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900"
                          >
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            View Location
                          </a>
                        )}
                        {person.longitude && person.latitude && (
                          <div className="text-xs text-gray-500">
                            {person.longitude}, {person.latitude}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(person.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {person.created_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Key Person Modal */}
      {showAddForm && (
        <AddKeyPersonModal
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchKeyPeople();
          }}
          currentUser={user}
        />
      )}
    </Layout>
  );
};

// Add Key Person Modal Component
const AddKeyPersonModal = ({ onClose, onSuccess, currentUser }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    notes: '',
    geolocation_url: '',
    instagram_id: '',
    facebook_id: '',
    twitter_id: '',
    other_social_media_id: '',
    longitude: '',
    latitude: '',
    persona: ''
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('key_people')
        .insert([{
          ...formData,
          created_by: currentUser.name || currentUser.email
        }]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error adding key person:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          geolocation_url: `https://www.google.com/maps?q=${latitude},${longitude}`
        });
        setLocationLoading(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const openGoogleMaps = () => {
    if (formData.latitude && formData.longitude) {
      window.open(`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-900">Add New Key Person</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
              <input
                type="text"
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Community Leader, Booth Worker, Influencer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes about this person..."
              />
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Social Media</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Instagram ID</label>
                  <input
                    type="text"
                    value={formData.instagram_id}
                    onChange={(e) => setFormData({ ...formData, instagram_id: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@username or URL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Facebook ID</label>
                  <input
                    type="text"
                    value={formData.facebook_id}
                    onChange={(e) => setFormData({ ...formData, facebook_id: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="facebook.com/username or URL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Twitter ID</label>
                  <input
                    type="text"
                    value={formData.twitter_id}
                    onChange={(e) => setFormData({ ...formData, twitter_id: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="@username or URL"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Other Social Media</label>
                  <input
                    type="text"
                    value={formData.other_social_media_id}
                    onChange={(e) => setFormData({ ...formData, other_social_media_id: e.target.value })}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="LinkedIn, YouTube, etc."
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {locationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        Use Current Location
                      </>
                    )}
                  </button>
                  
                  {formData.latitude && formData.longitude && (
                    <button
                      type="button"
                      onClick={openGoogleMaps}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      View on Map
                    </button>
                  )}
                </div>

                {locationError && (
                  <p className="text-sm text-red-600">{locationError}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="28.6139"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="77.2090"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={formData.geolocation_url}
                      onChange={(e) => setFormData({ ...formData, geolocation_url: e.target.value })}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Key Person'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KeyPeoplePage;
