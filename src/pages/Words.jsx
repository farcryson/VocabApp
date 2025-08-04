import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WordCard from "../components/WordCard";

function Words() {
  const [words, setWords] = useState([]);
    const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";

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

  useEffect(() => fetchWords(), []);

  return (
    <div style={{ padding: "1rem" }}>
      <Link to="/add">
        <button style={{ marginTop: "1rem" }}>Add Word</button>
      </Link>
      {words.map((item) => (
        <WordCard key={item._id} item={item} onChange={fetchWords} />
      ))}
    </div>
  );
}

export default Words;
