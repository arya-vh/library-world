import React from "react";
import { Link } from "react-router-dom";
import navbarData from "./navbardata";
import "./navbar.css";

const UserIsNotLoggedIn = () => {
  const { navbarLinksNotAuthenticated } = navbarData;

  return (
    <div id="nav-conditional-rendering">
      <ul className="navbar-nav ms-auto d-flex align-items-center">
        {navbarLinksNotAuthenticated.map((map_para, index) => {
          const { name, url } = map_para;
          return (
            <li className="nav-item" key={index}>
              <Link
                to={url}
                className={`btn px-4 py-2 fs-5 ${
                  name === "Login"
                    ? "btn-outline-light mx-2 my-2"
                    : "btn-light text-primary mx-2 my-2"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserIsNotLoggedIn;
