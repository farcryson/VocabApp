import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

function QuizCard({ quizData, loadQuestion }) {
  const currentWord = quizData.currentWord;
  const options = quizData.options;
  const [selected, setSelected] = useState(null);
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";
  const {fetchWords} = useContext(AuthContext);

  async function handleSelect(choice) {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === currentWord.meaning) {
      currentWord.correctCount += 1;
    } else {
      currentWord.incorrectCount += 1;
    }
    try {
      await axios.patch(
        `${backend}/words/${currentWord._id}`,
        {
          correctCount: currentWord.correctCount,
          incorrectCount: currentWord.incorrectCount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.log("Error updating the count.", err);
    }
  }

  function handleNext() {
    setSelected(null);
    fetchWords();
  }

  return (
    <div style={styles.card}>
      <h2>{currentWord.word}</h2>
      <div style={styles.options}>
        {options.map((option, index) => {
          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
              style={{
                ...styles.button,
                backgroundColor:
                  selected === option
                    ? option === currentWord.meaning
                      ? "#c8f7c5"
                      : "#f7c5c5"
                    : "",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected && <button onClick={handleNext}>Next</button>}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "auto",
    textAlign: "center",
  },
  options: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginTop: "1rem",
  },
  button: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #aaa",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default QuizCard;
