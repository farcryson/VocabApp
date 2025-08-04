import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const backend = import.meta.env.VITE_BACKEND_URL;

  if (loading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = `${backend}/auth/google`;
    return null;
  }
  return children;
}

export default ProtectedRoute;
