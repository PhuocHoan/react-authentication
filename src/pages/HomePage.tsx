import { Link } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';

export const HomePage = () => {
  const isAuthenticated = tokenStorage.isAuthenticated();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          React Authentication App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Secure JWT authentication with access and refresh tokens
        </p>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

