import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Total Drones</h2>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Active Flights</h2>
          <p className="text-2xl font-bold">45</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Red Drones</h2>
          <p className="text-2xl font-bold text-red-500">12</p>
        </div>
      </div>

      {/* Optional extra section */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Drone SG-BA123 took off at 09:00</li>
          <li>Drone SG-BC456 landed at 09:30</li>
          <li>Drone SG-AD789 flagged as red</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
