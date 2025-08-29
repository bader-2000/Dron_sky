import React, { useState } from "react";
import { useDronesData } from "../hooks/useDronesData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../assets/Styles/DashboardPage.css";

const DashboardPage: React.FC = () => {
  // State to trigger reload of data by changing the key
  const [reloadKey, setReloadKey] = useState(0);

  // State to hold the currently selected drone serial for filtering
  const [selectedSerial, setSelectedSerial] = useState<string>("");

  // Custom hook to fetch drones data; reloadKey triggers re-fetch
  const drones = useDronesData(reloadKey);

  // Filter drones by the selected serial if any, otherwise show all
  const filteredDrones = selectedSerial
    ? drones.filter(
        (d) =>
          d.serial?.trim().toLowerCase() === selectedSerial.trim().toLowerCase()
      )
    : drones;

  // Prepare data for the chart by flattening paths of filtered drones
  // Each point contains drone name, serial, index (point order), altitude, and yaw
  const chartData = filteredDrones.flatMap((drone) =>
    drone.path.map((coord, idx) => ({
      name: drone.name,
      serial: drone.serial,
      index: idx,
      altitude: drone.altitude,
      yaw: drone.yaw,
    }))
  );

  // Get unique serial numbers from the drones list for dropdown filter options
  const uniqueSerials = Array.from(new Set(drones.map((d) => d.serial))).filter(
    Boolean // filter out undefined or null serials
  );

  // Handler to reload data and reset the selected serial filter
  const handleReload = () => {
    setSelectedSerial(""); // reset filter
    setReloadKey((prev) => prev + 1); // change key to trigger reload
  };

  return (
    <div className="dashboard-container">
      <h2>Drone Statistics Dashboard</h2>

      <div className="stats">
        {/* Show total number of drones currently loaded */}
        <p>Number of drones: {drones.length}</p>
      </div>

      <div className="filter-section">
        {/* Dropdown to select a drone by serial number for filtering */}
        <select
          className="select"
          value={selectedSerial}
          onChange={(e) => setSelectedSerial(e.target.value)}
        >
          <option value="">All Drones</option>
          {uniqueSerials.map((serial) => (
            <option key={serial} value={serial}>
              {serial}
            </option>
          ))}
        </select>

        {/* Button to manually refresh the drone data */}
        <button className="refresh-button" onClick={handleReload}>
          Refresh Data
        </button>
      </div>

      <div className="chart-wrapper">
        {/* Responsive container for the chart to adjust with screen size */}
        <ResponsiveContainer width="91%" height={350}>
          <LineChart
            data={
              // Provide default data if no data available to avoid errors
              chartData.length ? chartData : [{ index: 0, altitude: 0, yaw: 0 }]
            }
          >
            {/* Grid lines on the chart */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* X axis uses the index of each path coordinate */}
            <XAxis
              dataKey="index"
              label={{
                value: "Index",
                position: "insideBottomRight",
                offset: 0,
              }}
            />
            {/* Y axis automatically scales */}
            <YAxis />
            {/* Tooltip on hover to show data */}
            <Tooltip />
            {/* Legend to describe lines */}
            <Legend />
            {/* Line representing altitude */}
            <Line
              type="monotone"
              dataKey="altitude"
              stroke="#8884d8"
              name="Altitude"
            />
            {/* Line representing yaw (rotation) */}
            <Line type="monotone" dataKey="yaw" stroke="#82ca9d" name="Yaw" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
