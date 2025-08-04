import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import env from "dotenv";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = process.env.BACKEND_URL+"/auth/google";
    return null;
  }
  return children;
}

export default ProtectedRoute;
