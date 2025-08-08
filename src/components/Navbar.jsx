import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <nav className="nav">
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        {user && (
          <>
            <Link to="/words" className="nav-link">
              My Words
            </Link>
            <Link to="/quiz" className="nav-link">
              Quiz
            </Link>
          </>
        )}
      </div>
      {user && (
        <FaSignOutAlt
          onClick={handleLogout}
          className="logout-icon"
          title="Logout"
        />
      )}
    </nav>
  );
}

export default Navbar;
