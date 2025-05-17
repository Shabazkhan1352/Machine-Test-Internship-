import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Navbar from '../Navbar';
function AgentUploadList() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth()

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await API.post('/sublists/upload', formData);
            alert(`File uploaded! Total items: ${uploadRes.data.count}`);

            const distRes = await API.post('/sublists/distribute');
            alert(`Distributed ${distRes.data.total} items`);

            navigate('/Agentdashboard');
        } catch (err) {
            console.error(err);
            alert('Upload or distribution failed');
        }
    };

    return (
        <>{isAuthenticated ? <div className='flex flex-col'>
            <Navbar/>
             <div className="min-h-screen bg-gray-100 flex flex-col px-4 py-8">
             <button
                onClick={() => navigate(-1)}
                className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
                ← Back
            </button>

        <div className=" mt-20 bg-gray-100 flex items-center justify-center px-4 py-8">
           
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Upload List (CSV, XLSX)</h3>
                <form onSubmit={handleUpload} className="flex flex-col gap-5">
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="block w-full text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Upload & Distribute
                    </button>
                </form>
            </div>
        </div>
        </div>
        </div> :<div className='flex flex-col gap-5 justify-center items-center min-h-[100vh]'>
            <h1 className='font-bold '>Please Login to View the Page </h1>
              <button onClick={ ()=>{
                navigate('/')
              }
              } className="w-[5%] py-2 mt-2 bg-black text-white font-semibold rounded-md hover:bg-gray-200 transition cursor-pointer" >Login</button>
        </div> }</>
       
    );
}

export default AgentUploadList;
