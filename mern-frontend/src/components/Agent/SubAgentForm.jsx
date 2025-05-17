import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Navbar from '../Navbar';
function SubAgentForm() {
    const {isAuthenticated} = useAuth()
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/subagents', form);
            alert('SubAgent created successfully!');
            navigate('/Agentdashboard');
        } catch (err) {
            alert('Failed to create agent');
        }
    };

    return (
        <>{isAuthenticated ? <div className='flex flex-col'>
            <Navbar/>
            <div className='min-h-screen bg-gray-100 flex flex-col  px-4 py-8'>
          <button
                onClick={() => navigate(-1)}
                className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
                ← Back
            </button>
        <div className=" mt-20 bg-gray-100 flex items-center justify-center px-4 py-8">
          
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New SubAgent</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input
                        name="name"
                        placeholder="Name"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="mobile"
                        placeholder="Mobile with country code"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Create Agent
                    </button>
                </form>
            </div>
        </div>
        </div>
        </div>  : <div className='flex flex-col gap-5 justify-center items-center min-h-[100vh]'>
            <h1 className='font-bold '>Please Login to View the Page </h1>
              <button onClick={ ()=>{
                navigate('/')
              }
              } className="w-[5%] py-2 mt-2 bg-black text-white font-semibold rounded-md hover:bg-gray-200 transition cursor-pointer" >Login</button>
        </div> }</>
       
    );
}

export default SubAgentForm;
