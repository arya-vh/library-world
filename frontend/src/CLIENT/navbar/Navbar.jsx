import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

// Importing all Navbar data's i.e. title,logo,links,etc
import navbarData from "./navbardata";

// Conditionally rendering links based on user's login info
import UserLogin from "./UserIsLoggedIn";
import UserSignin from "./UserIsNotLoggedIn";

// navbar search option
import NavbarSearch from "./NavbarSearch";

import { useLoginState } from "../../LoginState";

const Navbar = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  const userLoginState = useLoginState();

  const { navbarLinks, navbarTitle, navbarImage } = navbarData;

  return (
    <nav className="navbar navbar-expand-xl py-2 px-3 bg-primary shadow-sm sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img
            src={navbarImage}
            alt="Logo"
            width={"50"}
            // className="d-sm-inline-block d-none"
            className="d-inline-block"
          />
          <h4 className="h4 d-inline text-white " id="navbar-title-text">
            {navbarTitle}
          </h4>
        </Link>

        <button
          id="navbar-mobileview-btn"
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 justify-content-end fs-5">
            {navbarLinks.map((link, index) => {
              const { name, url } = link;
              return (
                <li className="nav-item" key={index}>
                  <Link to={url} className="nav-link text-white">
                    {name}
                  </Link>
                </li>
              );
            })}
            {/* {isLoggedin ? <UserLogin /> : <UserSignin />} */}
            {userLoginState.userLogState ? <UserLogin /> : <UserSignin />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
