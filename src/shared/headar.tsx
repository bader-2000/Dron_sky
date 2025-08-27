import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      {/* logp */}
      <img className="logo" src="../src/assets/logo.png" alt="logo" />

      {/*depatment Right*/}
      <div className="right-section">
        {/*Icons */}
        <div className="icons">
          <img
            src="../src/assets/Icon/language-svgrepo-com.svg"
            alt="language"
          />
          <img src="../src/assets/Icon/capture-svgrepo-com.svg" alt="capture" />
          <img src="../src/assets/Icon/bell.svg" alt="bell" />
        </div>

        {/* line */}
        <div className="divider"></div>

        {/* user-information */}
        <div className="user-info">
          <div className="user-details">
            <h6 className="hello">Hello !</h6>
            <h6 className="name">bader abu sa'aleek</h6>
          </div>
          <div className="user-position">
            <h5 className="position">Technical Support</h5>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
