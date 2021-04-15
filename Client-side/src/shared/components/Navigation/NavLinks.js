import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const myPlaces = "/" + auth.userID + "/places";

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={myPlaces}>MY PLACES</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <li>
            <button onClick={auth.logout}>LOGOUT</button>
          </li>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
