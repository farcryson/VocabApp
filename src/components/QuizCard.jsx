import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../styles/QuizCard.css";

function QuizCard({ quizData }) {
  const { currentWord, options } = quizData;
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const backend = import.meta.env.VITE_BACKEND_URL;
  // const backend = "http://localhost:3000";
  const { fetchWords } = useContext(AuthContext);

  async function handleSelect(choice) {
    if (answered) return;

    setSelected(choice);
    setAnswered(true);

    if (choice === currentWord.meaning) {
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

  const isCorrect = (option) => option === currentWord.meaning;

  return (
    <>
    <div className="container">
      <h2 className="score">Score: {score}</h2>
      <h2 className="word">{currentWord.word}</h2>
      <div className="options">
        {options.map((option, index) => {
          const isSelected = selected === option;
          const isRight = isCorrect(option);
          const showCorrect = answered && isRight;
          const showWrong = answered && isSelected && !isRight;

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`option-button ${
                showCorrect ? "correct" : showWrong ? "incorrect" : ""
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      </div>
      {selected && (
        <button
          onClick={() => {
            setSelected(null);
            setAnswered(false);
            fetchWords();
          }}
          className="next-button"
        >
          Next
        </button>
      )}
      </>
  );
}

export default QuizCard;
