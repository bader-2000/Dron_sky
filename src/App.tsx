import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Sidebar from "./shared/sidebar";
import Footer from "./shared/footer";
import MapPage from "./pages/MapPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./shared/headar";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Sidebar fixed on the left */}
        <Sidebar />

        {/* Main content: vertical flex column */}
        <div className="main-content">
          <Header /> {/* Header at the top */}
          {/* Page content: fills remaining space automatically */}
          <main className="page-content">
            <Routes>
              {/* Home / Map page */}
              <Route
                path="/map"
                element={
                  <div className="map-wrapper">
                    <MapPage />
                  </div>
                }
              />

              {/* Dashboard page */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Settings page */}
              <Route path="/settings" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer /> {/* Footer at the bottom */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
