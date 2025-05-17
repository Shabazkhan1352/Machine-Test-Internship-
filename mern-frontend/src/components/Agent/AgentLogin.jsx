import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
function AgentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/agent-login', { email, password });
      login(res.data.token)
      navigate('/Agentdashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2 uppercase">Login As an Agent</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Please enter your login and password!</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right text-sm">
            <a href="#!" className="text-blue-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-200 transition"
          >
            Login
          </button>
        </form>

        <div className="flex justify-center mt-6 space-x-4">
          <a href="#!" className="text-white hover:text-blue-500 transition"><i className="fab fa-facebook-f"></i></a>
          <a href="#!" className="text-white hover:text-blue-400 transition"><i className="fab fa-twitter"></i></a>
          <a href="#!" className="text-white hover:text-red-500 transition"><i className="fab fa-google"></i></a>
        </div>
    <p className="mt-6 text-center text-sm text-gray-400">Admin ? <a className='hover:underline' href="/">Login Here</a> </p>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <a href="/signup" className="text-blue-400 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default AgentLogin;
