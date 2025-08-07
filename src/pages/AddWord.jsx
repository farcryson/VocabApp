import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function AddWord() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";
  const { words, fetchWords } = useContext(AuthContext);

  function handleClick(event) {
    event.preventDefault();
    async function addWord() {
      try {
        const response = await axios.post(
          `${backend}/words`,
          { word, meaning },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        fetchWords();
        setWord("");
        setMeaning("");
      } catch (err) {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.message || "Duplicate Word");
        } else {
          alert("Something went wrong. Please try again.");
        }
        console.log(err);
      }
    }
    addWord();
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Add a Word</h2>
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          name="word"
          value={word}
          placeholder="Word"
          onChange={(e) => setWord(e.target.value)}
        />
        <input
          type="text"
          name="meaning"
          value={meaning}
          placeholder="Meaning"
          onChange={(e) => setMeaning(e.target.value)}
        />
        <button onClick={handleClick}>Add Word</button>
      </form>
    </div>
  );
}

export default AddWord;
