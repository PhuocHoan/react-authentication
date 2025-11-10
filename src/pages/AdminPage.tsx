import { RoleBasedRoute } from '../components/RoleBasedRoute';
import { useAuth } from '../hooks/useAuth';

const AdminContent = () => {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={() => logout()}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 bg-white shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Panel</h2>
            <p className="text-lg text-gray-600">
              This page is only accessible to users with admin role.
            </p>
            <div className="mt-6 bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                Current user role: <strong>{user?.role}</strong>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const AdminPage = () => {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminContent />
    </RoleBasedRoute>
  );
};

