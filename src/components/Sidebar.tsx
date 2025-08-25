import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">SAGER</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">
          Map
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
