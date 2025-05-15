import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function AgentListView() {
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [listItems, setListItems] = useState([]);
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

    const handleSelect = async (agentId) => {
        setSelectedAgent(agentId);
        try {
            const res = await API.get(`/lists/agent/${agentId}`);
            setListItems(res.data);
        } catch (err) {
            alert('Failed to load assigned list');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
            >
                ← Back
            </button>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">View Agent Assigned Lists</h3>

                <select
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleSelect(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Select Agent</option>
                    {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                            {agent.name} ({agent.email})
                        </option>
                    ))}
                </select>

                {listItems.length > 0 && (
                    <div>
                        <h5 className="text-lg font-medium mb-4">Assigned Items:</h5>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 rounded-md">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-2 border-b border-gray-300">First Name</th>
                                        <th className="text-left px-4 py-2 border-b border-gray-300">Phone</th>
                                        <th className="text-left px-4 py-2 border-b border-gray-300">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listItems.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 border-b border-gray-300">{item.firstName}</td>
                                            <td className="px-4 py-2 border-b border-gray-300">{item.phone}</td>
                                            <td className="px-4 py-2 border-b border-gray-300">{item.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentListView;
