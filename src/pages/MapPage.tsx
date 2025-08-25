import React from "react";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";

const MapPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Map />
    </div>
  );
};

export default MapPage; // فقط تصدير واحد
