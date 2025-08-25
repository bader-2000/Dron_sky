import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<MapPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
