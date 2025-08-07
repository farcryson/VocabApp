import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import QuizCard from "../components/QuizCard";

function Quiz() {
  const { words, fetchWords } = useContext(AuthContext);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (words.length === 0) return;
    loadQuestion();
  }, [words]);

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i >= 0; i--) {
      let ind = Math.floor(Math.random() * (i + 1));
      [a[i], a[ind]] = [a[ind], a[i]];
    }
    return a;
  }
  function loadQuestion() {
    let currentWord = null;
    let sum = 0;
    for (const word of words) {
      const total_attempts = word.correctCount + word.incorrectCount;
      const weight = (1 / (1 + total_attempts)) * (1 + word.incorrectCount);
      sum += weight;
    }
    const rand = Math.random() * sum;
    let w = 0;
    for (const word of words) {
      const total_attempts = word.correctCount + word.incorrectCount;
      const weight = (1 / (1 + total_attempts)) * (1 + word.incorrectCount);
      w += weight;
      if (w >= rand){
        currentWord = word;
        break;
      }
    }

    const shuffled = shuffle([...words]);
    const wrongOptions = shuffled
      .filter((w) => w.word !== currentWord.word)
      .splice(0, 3)
      .map((w) => w.meaning);
    const options = shuffle([...wrongOptions, currentWord.meaning]);
    setQuizData({
      currentWord: currentWord,
      options: options,
    });
  }

  return (
    <>
      {quizData ? (
        <QuizCard quizData={quizData} loadQuestion={loadQuestion} />
      ) : (
        <div>Next Question...</div>
      )}
    </>
  );
}

export default Quiz;
