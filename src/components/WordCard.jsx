import axios from "axios";
import { useState } from "react";
import _ from "lodash";
import "../styles/WordCard.css"

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
    <div className="word-card">
      {isEditing ? (
        <form className="edit-form">
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
          <div className="edit-btn-row">
            <button onClick={handleEdit}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <table className="words-table">
          <tbody>
            <tr>
              <td className="word-cell">{item.word}</td>
              <td className="word-cell">{item.meaning}</td>
              <td className="word-cell">
                <button onClick={handleDelete}>Delete</button>
                <button
                  onClick={() => setEditing(true)}
                  className="edit-button"
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


export default WordCard;
