import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { use } from "passport";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = `${backend}/auth/google`;
    }
  }, [loading, user]);

  if (loading) return <div>Loading...</div>;
  if (!user) {
    return null;
  }
  return children;
}

export default ProtectedRoute;
