import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

function Navbar() {
  const { user } = useContext(AuthContext);
  const backend = import.meta.env.VITE_BACKEND_URL;

  async function handleLogout() {
    try {
      await axios.get(`${backend}/logout`, {
        withCredentials: true,
      });
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav style={styles.nav}>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        {user && <Link to="/words" style={styles.link}>My Words</Link>}
      </div>
      {user && <FaSignOutAlt onClick={handleLogout} style={styles.icon} title="Logout" />}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  link: {
    marginRight: "1rem",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold",
  },
  icon: {
    cursor: "pointer",
    color: "#c00",
    fontSize: "1.2rem",
  },
};

export default Navbar;
