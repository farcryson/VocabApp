import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../styles/ShortAnswerCard.css"

function ShortAnswerCard({ shortData }) {
  const { currentWord } = shortData;
  const [answer, setAnswer] = useState("");
  const [check, setCheck] = useState(false);
  const [next, setNext] = useState(false);
  const [score, setScore] = useState(0);
    const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";
  const { fetchWords } = useContext(AuthContext);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!answer.trim()) {
      alert("Please enter a meaning before submitting.");
      return;
    }

    setCheck(true);
  }

  async function handleAnswer(type) {
    setNext(true);

    if (type === "correct") {
      currentWord.correctCount += 1;
      setScore(score + 1);
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

  return (
    <>
      <div className="container">
        <h2
        className="score"
      >
        Score: {score}
      </h2>
        <h2 className="word">{currentWord.word}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="meaning"
            value={answer}
            placeholder="Meaning"
            disabled={check}
            onChange={(e) => setAnswer(e.target.value)}
            className="input"
          />
          {check && <h3 className="correct-meaning">{currentWord.meaning}</h3>}
          <button type="submit" className="check-btn" disabled={check}>{!check ? "Check": "Checked"}</button>
        </form>
        {check && (
          <>
            <h2 className="feedback-title">Was your answer correct?</h2>
             <div className="feedback-buttons">
            <button onClick={() => handleAnswer("correct")} disabled={next} className="feedback-btn correct-btn">
              Yes
            </button>
            <button onClick={() => handleAnswer("incorrect")} disabled={next} className="feedback-btn incorrect-btn">
              No
            </button>
            </div>
          </>
        )}
      </div>
      {next && (
        <button
          onClick={() => {
            setAnswer("");
            setCheck(false);
            setNext(false);
            fetchWords();
          }}
          className="next-btn"
        >
          Next
        </button>
      )}
    </>
  );
}

export default ShortAnswerCard;
