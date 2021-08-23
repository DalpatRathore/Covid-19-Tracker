import React from "react";
import "./Header.css";
import covid19 from "./covid-19-1.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header__logoWrapper">
        <NavLink to="/">
          <img src={covid19} alt="Covid 19" />
        </NavLink>
      </div>
      <nav className="header__navbar">
        <NavLink to="/">World</NavLink>
        <NavLink to="/country">Country</NavLink>
        <NavLink to="/vaccine">Vaccine</NavLink>
      </nav>
    </div>
  );
};

export default Header;
