import { useContext} from "react";
import { Link } from "react-router-dom";
import WordCard from "../components/WordCard";
import AuthContext from "../context/AuthContext";

function Words() {
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";
  const {words, fetchWords} = useContext(AuthContext);
  


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
