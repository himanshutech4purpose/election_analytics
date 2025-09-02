import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  UsersIcon, 
  HomeIcon, 
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../lib/auth';
import Layout from '../components/Layout';
import { User } from '../types';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // No user found, redirect to login
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user after loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  const navigationCards = [
    {
      title: 'Dashboard',
      description: 'View booth-level overview and quick statistics',
      href: '/dashboard/booth',
      icon: HomeIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Key People',
      description: 'Manage booth workers and personnel information',
      href: '/key-people',
      icon: UsersIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Booth Analytics',
      description: 'Detailed booth-level voter demographics and trends',
      href: '/analytics/booth',
      icon: ChartBarIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'District Analytics',
      description: 'District-wide voter intelligence and patterns',
      href: '/analytics/district',
      icon: BuildingOfficeIcon,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'State Analytics',
      description: 'State-wide voter demographics and insights',
      href: '/analytics/state',
      icon: GlobeAltIcon,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  const adminCards = [
    {
      title: 'User Management',
      description: 'Add, edit, and manage user accounts and roles',
      href: '/admin/users',
      icon: UserIcon,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      href: '/admin/settings',
      icon: CogIcon,
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Voter Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive voter analytics and booth management platform for data-driven electoral insights
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-500">Logged in as:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {user.name || user.email}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <div className="text-sm text-gray-600">Active Booths</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">150+</div>
            <div className="text-sm text-gray-600">Key People</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">15K+</div>
            <div className="text-sm text-gray-600">Voter Records</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-sm text-gray-600">Districts</div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group block bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-lg text-white ${card.color} mb-4`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        {user.role === 'admin' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Administration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group block bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg text-white ${card.color} mb-4`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>New booth data added for District 3</span>
              <span className="text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Key person profile updated</span>
              <span className="text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Analytics report generated</span>
              <span className="text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}