import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold">Agent Managements System Dashboard</h1>
        <div className="flex space-x-6">
          <button
            className="text-white hover:text-gray-200 transition duration-200 cursor-pointer"

            onClick={() => navigate(-1)}>
            Home

          </button>
          <Link
            to="/allagents"
            className="text-white hover:text-gray-200 transition duration-200"
          >
            Agents
          </Link>
          <Link
            to="/allsubagents"
            className="text-white hover:text-gray-200 transition duration-200"
          >
            Subagents
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
