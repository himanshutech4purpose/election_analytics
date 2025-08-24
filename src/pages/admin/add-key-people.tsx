import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAdmin } from '../../lib/auth';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface KeyPersonFormData {
  name: string;
  phone_number: string;
  notes: string;
  geolocation_url: string;
  instagram_id: string;
  facebook_id: string;
  twitter_id: string;
  other_social_media_id: string;
  longitude: string;
  latitude: string;
  persona: string;
}

const AddKeyPeoplePage = () => {
  console.log('add-key-people: AddKeyPeoplePage component rendered');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KeyPersonFormData>({
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
    persona: '',
  });
  const router = useRouter();

  useEffect(() => {
    console.log('add-key-people: useEffect triggered, calling checkAuth...');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('add-key-people: checkAuth called');
    try {
      const user = await getCurrentUser();
      console.log('add-key-people: checkAuth - Current user:', user);
      
      if (!user) {
        console.log('add-key-people: checkAuth - No user found, redirecting to login');
        router.push('/login');
        return;
      }
      
      console.log('add-key-people: checkAuth - Checking admin status...');
      const adminStatus = await isAdmin();
      console.log('add-key-people: checkAuth - Admin status:', adminStatus);
      
      if (!adminStatus) {
        console.log('add-key-people: checkAuth - User is not admin, redirecting to dashboard');
        router.push('/dashboard/booth');
        return;
      }
      
      console.log('add-key-people: checkAuth - User is admin, proceeding...');
    } catch (error) {
      console.error('add-key-people: checkAuth - Error occurred:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('add-key-people: handleInputChange called with:', { name, value });
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('add-key-people: handleInputChange - Updated formData:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('add-key-people: handleSubmit called with formData:', formData);
    e.preventDefault();
    setLoading(true);

    try {
      console.log('add-key-people: handleSubmit - Getting current user...');
      const user = await getCurrentUser();
      console.log('add-key-people: handleSubmit - Current user:', user);
      
      if (!user) {
        console.error('add-key-people: handleSubmit - User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('add-key-people: handleSubmit - Making API call to /api/add-key-person...');
      const response = await fetch('/api/add-key-person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          created_by: user.id,
        }),
      });

      console.log('add-key-people: handleSubmit - API response status:', response.status);
      const result = await response.json();
      console.log('add-key-people: handleSubmit - API response:', result);

      if (!response.ok) {
        console.error('add-key-people: handleSubmit - API error:', result.error);
        throw new Error(result.error || 'Failed to add key person');
      }

      console.log('add-key-people: handleSubmit - Key person added successfully');
      toast.success('Key person added successfully!');
      setFormData({
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
        persona: '',
      });
    } catch (error) {
      console.error('add-key-people: handleSubmit - Error adding key person:', error);
      toast.error('Failed to add key person');
    } finally {
      console.log('add-key-people: handleSubmit - Setting loading to false');
      setLoading(false);
    }
  };

  console.log('add-key-people: Rendering with state:', { loading, formData });
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
              <h1 className="text-2xl font-bold text-gray-900">Add Key Person</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    className="input-field"
                    placeholder="Enter phone number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label htmlFor="persona" className="form-label">
                    Persona/Role
                  </label>
                  <input
                    type="text"
                    id="persona"
                    name="persona"
                    className="input-field"
                    placeholder="e.g., Community Leader, Business Owner, Teacher"
                    value={formData.persona}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="input-field"
                    placeholder="Additional notes about this person"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="geolocation_url" className="form-label">
                    Geolocation URL
                  </label>
                  <input
                    type="url"
                    id="geolocation_url"
                    name="geolocation_url"
                    className="input-field"
                    placeholder="Google Maps or other location URL"
                    value={formData.geolocation_url}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="longitude" className="form-label">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    className="input-field"
                    placeholder="Longitude coordinate"
                    value={formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="latitude" className="form-label">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    className="input-field"
                    placeholder="Latitude coordinate"
                    value={formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Social Media Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="instagram_id" className="form-label">
                    Instagram ID
                  </label>
                  <input
                    type="text"
                    id="instagram_id"
                    name="instagram_id"
                    className="input-field"
                    placeholder="Instagram username or ID"
                    value={formData.instagram_id}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="facebook_id" className="form-label">
                    Facebook ID
                  </label>
                  <input
                    type="text"
                    id="facebook_id"
                    name="facebook_id"
                    className="input-field"
                    placeholder="Facebook username or ID"
                    value={formData.facebook_id}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="twitter_id" className="form-label">
                    Twitter ID
                  </label>
                  <input
                    type="text"
                    id="twitter_id"
                    name="twitter_id"
                    className="input-field"
                    placeholder="Twitter username or ID"
                    value={formData.twitter_id}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="other_social_media_id" className="form-label">
                    Other Social Media
                  </label>
                  <input
                    type="text"
                    id="other_social_media_id"
                    name="other_social_media_id"
                    className="input-field"
                    placeholder="Other social media platforms"
                    value={formData.other_social_media_id}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link href="/dashboard/booth" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.name}
                className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Add Key Person
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddKeyPeoplePage;