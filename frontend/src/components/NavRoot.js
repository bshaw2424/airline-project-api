import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";

import {
  FaHeart,
  FaPlane,
  FaUserCircle,
  FaSignOutAlt,
  FaThLarge,
  FaFolderOpen,
  FaSuitcase,
} from "react-icons/fa";

import Footer from "./Static/Footer";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function NavRoot() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const { user, isLoggedIn, loading, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const isNavigating = navigation.state === "loading";

  // Close menus whenever the route changes,
  // including browser Back/Forward navigation.
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    setLogoutError("");
    setLoggingOut(true);

    try {
      await logout();
      handleNavLinkClick();
      navigate("/");
    } catch (error) {
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <div
          className="p-0 m-0 shadow-sm"
          style={{ position: "relative", zIndex: 4 }}
        >
          <nav className="container navbar navbar-expand-lg py-2">
            <div className="container-fluid">
              <h1 className="nav-brand mb-0">
                <Link to="/" onClick={handleNavLinkClick}>
                  Flight In Range
                </Link>
              </h1>

              {/* React-controlled mobile toggle */}
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(prev => !prev);
                  setAccountMenuOpen(false);
                }}
                aria-controls="navbarNav"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
            </div>

            {/* React controls the show class */}
            <div
              className={`collapse navbar-collapse ${
                mobileMenuOpen ? "show" : ""
              }`}
              id="navbarNav"
            >
              {/* Main navigation */}
              <ul className="navbar-nav ps-3 me-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    end
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/about"
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    About
                  </NavLink>
                </li>
              </ul>

              {/* Authentication navigation */}
              <ul className="navbar-nav ps-3 align-items-lg-center gap-lg-2">
                {!loading &&
                  (isLoggedIn ? (
                    <li className="nav-item dropdown position-relative">
                      <button
                        type="button"
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={() => setAccountMenuOpen(prev => !prev)}
                        aria-expanded={accountMenuOpen}
                        aria-controls="accountMenu"
                        aria-haspopup="true"
                      >
                        <FaUserCircle />
                        My Account
                        <span className="small">
                          {accountMenuOpen ? "▴" : "▾"}
                        </span>
                      </button>

                      {accountMenuOpen && (
                        <div
                          id="accountMenu"
                          className="dropdown-menu show shadow-sm border rounded-3 p-2 mt-2"
                          style={{ minWidth: "220px" }}
                        >
                          {/* User information */}
                          <div className="px-3 py-2">
                            <span className="text-muted small">
                              Signed in as
                            </span>

                            <div className="fw-semibold text-break">
                              {user?.username}
                            </div>
                          </div>

                          <div className="dropdown-divider" />

                          <NavLink
                            to="/dashboard"
                            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                            onClick={handleNavLinkClick}
                          >
                            <FaThLarge />
                            My Dashboard
                          </NavLink>

                          <NavLink
                            to="/saved-destinations"
                            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                            onClick={handleNavLinkClick}
                          >
                            <FaHeart className="text-danger" />
                            Saved Destinations
                          </NavLink>

                          <NavLink
                            to="/saved-airlines"
                            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                            onClick={handleNavLinkClick}
                          >
                            <FaPlane />
                            Saved Airlines
                          </NavLink>

                          <NavLink
                            to="/collections"
                            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                            onClick={handleNavLinkClick}
                          >
                            <FaFolderOpen />
                            My Collections
                          </NavLink>

                          <NavLink
                            to="/my-trips"
                            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                            onClick={handleNavLinkClick}
                          >
                            <FaSuitcase />
                            My Trips
                          </NavLink>

                          <div className="dropdown-divider" />

                          <button
                            type="button"
                            className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2"
                            onClick={handleLogout}
                            disabled={loggingOut}
                          >
                            <FaSignOutAlt />
                            {loggingOut ? "Logging out..." : "Log out"}
                          </button>
                        </div>
                      )}
                    </li>
                  ) : (
                    <>
                      <li className="nav-item">
                        <NavLink
                          to="/login"
                          className="nav-link"
                          onClick={handleNavLinkClick}
                        >
                          Log in
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          to="/register"
                          className="btn btn-primary btn-sm"
                          onClick={handleNavLinkClick}
                        >
                          Sign up
                        </NavLink>
                      </li>
                    </>
                  ))}
              </ul>
            </div>
          </nav>

          {logoutError && (
            <div className="container py-2">
              <div className="alert alert-danger mb-0" role="alert">
                {logoutError}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Page content / navigation loading */}
      <div className="flex-grow-1">
        {isNavigating ? <LoadingSpinner message="Loading" /> : <Outlet />}
      </div>

      <Footer />
    </div>
  );
}
