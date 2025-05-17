import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AgentCard = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await API.get('/agents');
        setAgents(res.data);
      } catch (err) {
        alert('Failed to load agents');
      }
    };
    fetchAgents();
  }, []);

    // const handleCardClick = async (agentId) => {
          
    //       try {
    //           const res = await API.get(`/lists/agent/${agentId}`);
    //           setListItems(res.data);
    //       } catch (err) {
    //           alert('Failed to load assigned list');
    //       }
    //   };
  

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {agents.map((agent, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-2xl transition duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Agent</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-700">Name:</span> {agent.name}</p>
            <p><span className="font-medium text-gray-700">Email:</span> {agent.email}</p>
            <p><span className="font-medium text-gray-700">Mobile:</span> {agent.mobile}</p>
          </div>
          <button onClick={()=>navigate(`/agent/${agent._id}`)} className='bg-black text-white px-4 py-2 mt-3 rounded-md cursor-pointer'>View Assigned Tasks</button>
        </div>
      ))}
    </div>
  );
};

export default AgentCard;
