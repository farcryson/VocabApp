import axios from "axios";
import { useState } from "react";
import _ from "lodash";

function WordCard({ item, onChange }) {
  const [isEditing, setEditing] = useState(false);
  const [editWord, setEditWord] = useState(item.word);
  const [editMeaning, setEditMeaning] = useState(item.meaning);
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";

  async function handleDelete() {
    try {
      await axios.delete(`${backend}/words/${item._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onChange();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleEdit(event) {
    event.preventDefault();
    try {
      await axios.patch(
        `${backend}/words/${item._id}`,
        { word: _.capitalize(editWord.trim()), meaning: editMeaning.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditing(false);
      onChange();
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancel() {
    setEditing(false);
    setEditWord(item.word);
    setEditMeaning(item.meaning);
  }

  return (
    <div style={card}>
      {isEditing ? (
        <form style={form}>
          <input
            type="text"
            value={editWord}
            onChange={(e) => setEditWord(e.target.value)}
          />
          <input
            type="text"
            value={editMeaning}
            onChange={(e) => setEditMeaning(e.target.value)}
          />
          <div style={btnRow}>
            <button onClick={handleEdit}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        // <>
        //   <h3 style={{ color: 'black' }}>{item.word}</h3>
        //   <p style={{ color: 'black' }}>{item.meaning}</p>
        //   <div style={btnRow}>
        //     <button onClick={handleDelete}>Delete</button>
        //     <button onClick={() => setEditing(true)}>Edit</button>
        //   </div>
        // </>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  color: "black",
                }}
              >
                {item.word}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  color: "black",
                }}
              >
                {item.meaning}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button onClick={handleDelete}>Delete</button>
                <button
                  onClick={() => setEditing(true)}
                  style={{ marginLeft: "8px" }}
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ccc",
  padding: "1rem",
  margin: "1rem auto",
  borderRadius: "8px",
  maxWidth: "400px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  background: "#fdfdfd",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const btnRow = {
  display: "flex",
  gap: "0.5rem",
};

export default WordCard;
