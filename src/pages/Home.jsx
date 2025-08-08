import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

function Home() {
  const { user } = useContext(AuthContext);
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";

  useEffect(() => {
    if (user) return;

    const checkGoogleScriptLoaded = setInterval(() => {
      const gisId = window.google?.accounts?.id;

      if (gisId) {
        clearInterval(checkGoogleScriptLoaded);

        gisId.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });

        gisId.renderButton(document.getElementById("google-btn"), {
          theme: "outline",
          size: "large",
        });
      }
    }, 500);
    const stopRetryTimeout = setTimeout(() => {
      clearInterval(checkGoogleScriptLoaded);
    }, 5000);

    return () => {
      clearInterval(checkGoogleScriptLoaded);
      clearTimeout(stopRetryTimeout);
    };
  }, [user]);

  async function handleGoogleLogin(response) {
    try {
      const result = await axios.post(`${backend}/auth/google`, {
        token: response.credential,
      });

      const { token, user } = result.data;
      localStorage.setItem("token", token);
      window.location.href = "/words";
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h1>Welcome to Vocab App</h1>
      {!user && <div id="google-btn" style={{ marginTop: "1rem" }}></div>}
    </div>
  );
}

export default Home;
