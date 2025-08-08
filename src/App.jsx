import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Words from "./pages/Words";
import AddWord from "./pages/AddWord";
import { useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";
import axios from "axios";
import ProtectedRoute from "./routes/ProtectedRoute";
import Quiz from "./pages/Quiz";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";
  const [words, setWords] = useState([]);


  useEffect(() => {
    async function checkUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${backend}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  const fetchWords = () => {
      axios
        .get(`${backend}/words`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((result) => {
          setWords(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect(()=>{
      if(user) fetchWords();
    },[user]
    );

    if(loading){
      return <div style={{padding:"1rem", textAlign:"center"}}>Checking login...</div>;
    }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, words, fetchWords }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/words"
              element={
                <ProtectedRoute>
                  <Words />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddWord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
