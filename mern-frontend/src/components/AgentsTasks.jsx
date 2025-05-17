import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from './Navbar';

const AgentsTasks = () => {
  const { agentId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get(`/lists/agent/${agentId}`);
        setTasks(res.data);  // ✅ Corrected here
      } catch (err) {
        alert('Failed to load assigned tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [agentId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await API.delete(`/lists/agent/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (e) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <p className="p-6 text-center">Loading tasks…</p>;
  if (tasks.length === 0) return <p className="p-6 text-center">No tasks assigned.</p>;

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="p-6 overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">#</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr
                key={task._id || idx}
                className="border-t hover:bg-gray-50 text-sm whitespace-nowrap"
              >
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{task.firstName || '—'}</td>
                <td className="p-3">{task.phone || '—'}</td>
                <td className="p-3">{task.notes || '—'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Task"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsTasks;
