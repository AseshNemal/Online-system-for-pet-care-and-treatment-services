import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Memoized search options to prevent recreation on every render
  const allSearchOptions = useMemo(() => [
    { name: "Appointment", path: "/appointments" },
    { name: "About us", path: "/about" },
    { name: "Pet Store", path: "/product/all" },
    { name: "Pet Medical Record", path: "/pet" },
    { name: "Home", path: "/" },
    { name: "Medical History", path: "/pet" },
    { name: "Pet Health Tracker", path: "/pet" },
  ], []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("http://localhost:8090/get-session", { 
          credentials: "include" 
        });
        if (!response.ok) throw new Error('Session fetch failed');
        const data = await response.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      const results = allSearchOptions.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setActiveResultIndex(-1); // Reset active index when results change
    }, 300); // 300ms debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm, allSearchOptions]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const path = activeResultIndex >= 0 
        ? searchResults[activeResultIndex].path 
        : searchResults[0].path;
      navigate(path);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResultIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResultIndex(prev => (prev > 0 ? prev - 1 : -1));
    }
    // Enter
    else if (e.key === 'Enter' && activeResultIndex >= 0) {
      e.preventDefault();
      navigate(searchResults[activeResultIndex].path);
      setSearchTerm("");
      setShowDropdown(false);
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchTerm("");
    setShowDropdown(false);
  };

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
            <Link to="/product/all" className="nav-link">Shopping</Link>
          </li>
          <li className="nav-item">
            <Link to="/appointments" className="nav-link">Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/adoption-portal" className="nav-link">Adoption Portal</Link>
          </li>
          <li className="nav-item">
            <Link to="/pet" className="nav-link">Pet</Link>
          </li>
          <li className="nav-item">
            <Link to="/pet" className="nav-link">Medical History</Link>
          </li>
          <li className="nav-item">
            <Link to="/AboutUs" className="nav-link">About us</Link>
          </li>
        </ul>
        
        <div className="d-flex align-items-center">
          <form 
            className="form-inline my-2 my-lg-0 mr-3 position-relative" 
            onSubmit={handleSearchSubmit}
            ref={searchRef}
          >
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchTerm && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu show w-100" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {searchResults.map((result, index) => (
                  <Link 
                    key={index} 
                    to={result.path} 
                    className={`dropdown-item ${index === activeResultIndex ? 'active' : ''}`}
                    onClick={() => handleResultClick(result.path)}
                    onMouseEnter={() => setActiveResultIndex(index)}
                  >
                    {result.name}
                  </Link>
                ))}
              </div>
            )}
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
                <a href="/login" className="btn btn-outline-primary">
                  Login
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;