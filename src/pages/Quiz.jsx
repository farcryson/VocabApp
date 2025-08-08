import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import QuizCard from "../components/QuizCard";

function Quiz() {
  const { words, fetchWords, loading, setLoading } = useContext(AuthContext);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (words.length > 0) loadQuestion();
  }, [words]);

  function shuffle(a) {
    for (let i = a.length - 1; i >= 0; i--) {
      let ind = Math.floor(Math.random() * (i + 1));
      [a[i], a[ind]] = [a[ind], a[i]];
    }
    return a;
  }
  function loadQuestion() {
    setLoading(true);
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
      if (w >= rand) {
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
      currentWord,
      options,
    });
    setLoading(false);
  }

  if (words.length === 0) {
    return <div style={{ padding: "1rem" }}>Fetching words...</div>;
  }

  if (loading || !quizData) {
    return <div style={{ padding: "1rem" }}>Loading question...</div>;
  }

  return <QuizCard quizData={quizData} loadQuestion={loadQuestion} />;
}

export default Quiz;
