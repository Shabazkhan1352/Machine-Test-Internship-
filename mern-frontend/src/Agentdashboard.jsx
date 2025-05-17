import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';

function AgentDashboard() {
  const navigate = useNavigate();
  const { logout , isAuthenticated} = useAuth();

  const handleLogout = () => {
    logout()
    navigate('/');
  };

  return (
    <> {isAuthenticated ?
        <div className='flex flex-col'>
            <Navbar/>
             <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Agent Dashboard</h2>
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
              to="/add-subagent"
              className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              ➕ Add Sub Agent
            </Link>
          </li>
          <li>
            <Link
              to="/agentupload"
              className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              📤 Upload & Distribute List
            </Link>
          </li>
          <li>
            <Link
              to="/agentview"
              className="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              👀 View Agent Lists
            </Link>
          </li>
        </ul>
      </div>
    </div>
        </div>
      :<div className='flex flex-col gap-5 justify-center items-center min-h-[100vh]'>
            <h1 className='font-bold '>Please Login to View the Page </h1>
              <button onClick={ ()=>{
                navigate('/')
              }
              } className="w-[5%] py-2 mt-2 bg-black text-white font-semibold rounded-md hover:bg-gray-200 transition cursor-pointer" >Login</button>
        </div> }</>
   
  );
}

export default AgentDashboard;
