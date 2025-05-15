import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <ul className="space-y-4">
          <li>
            <Link
              to="/add-agent"
              className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              ➕ Add Agent
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              📤 Upload & Distribute List
            </Link>
          </li>
          <li>
            <Link
              to="/view"
              className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              👀 View Agent Lists
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
