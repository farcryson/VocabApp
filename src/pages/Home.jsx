import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const backend = import.meta.env.VITE_BACKEND_URL;


  function handleLogin() {
    window.location.href = `${backend}/auth/google`;
  }

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h1>Welcome to Vocab App</h1>
      {!user && (
        <button onClick={handleLogin} style={{ marginTop: "1rem" }}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default Home;
