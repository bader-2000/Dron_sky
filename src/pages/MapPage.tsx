import React from "react";
import Map from "../components/Map";

const MapPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <center>
        {" "}
        <h1>Map </h1>{" "}
      </center>
      <Map />
    </div>
  );
};

export default MapPage;
