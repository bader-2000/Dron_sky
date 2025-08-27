import { NavLink } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className="nav-link">
              <div className="nav-item">
                <img
                  src="./src/assets/Icon/dashboard-svgrepo-com-2.svg"
                  alt="Dashboard"
                />
                <h3>Dashboard</h3>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/map" className="nav-link">
              <div className="nav-item">
                <img
                  src="./src/assets/Icon/location-svgrepo-com-2.svg"
                  alt="Map"
                />
                <h3>Map</h3>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="nav-link">
              <div className="nav-item">
                <FaCog />
                <h3>Settings</h3>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
