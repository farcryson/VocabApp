import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import env from "dotenv";

env.config();

function Home() {
  const { user } = useContext(AuthContext);

  function handleLogin() {
    window.location.href = process.env.BACKEND_URL+"/auth/google";
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
