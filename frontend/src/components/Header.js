import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8090/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo03"
        aria-controls="navbarTogglerDemo03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <Link to="/" className="navbar-brand">PetWellness</Link>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          <li className="nav-item active">
            <Link to="/" className="nav-link">Home <span className="sr-only"></span></Link>
          </li>
          <li className="nav-item">
            <Link to="/shopping" className="nav-link">Shopping</Link>
          </li>
          <li className="nav-item">
            <Link to="/appointment" className="nav-link">Appointment</Link>
          </li>
          <li className="nav-item">
            <Link to="/pet" className="nav-link">Pet</Link>
          </li>
          <li className="nav-item">
            <Link to="/medical-history" className="nav-link">Medical History</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About us</Link>
          </li>
          <li className="nav-item">
            <Link to="/chat" className="nav-link">Chat</Link>
          </li>
        </ul>
        
        <form className="form-inline my-2 my-lg-0 mr-3">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>

        {!loading && (
          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {user.image && (
                    <img
                    src={user.image.replace('=s96-c', '=s200-c')}
                      alt="Profile"
                      className="rounded-circle mr-2"
                      width="32"
                      height="32"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-profile.png';
                      }}
                    />
                  )}
                  <span className="d-none d-sm-inline">{user.displayName}</span>
                </button>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <a href="http://localhost:8090/logout" className="dropdown-item">Logout</a>
                </div>
              </div>
            ) : (
              <a href="http://localhost:8090/auth/google" className="btn btn-outline-primary">
                Login
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;