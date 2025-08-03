import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WordCard from "../components/WordCard";
import AuthContext from "../context/AuthContext";

function Words() {
  const [words, setWords] = useState([]);

  const fetchWords = () => {
    axios
      .get("http://localhost:3000/words", {
        withCredentials: true,
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
