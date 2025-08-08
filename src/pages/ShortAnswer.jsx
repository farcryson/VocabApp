import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import ShortAnswerCard from "../components/ShortAnswerCard";

function ShortAnswer() {
  const { words, fetchWords, loading, setLoading } = useContext(AuthContext);
  const [shortData, setShortData] = useState(null);

  useEffect(() => {
    if (words.length > 0) loadQuestion();
  }, [words]);

  function loadQuestion() {
    setLoading(true);
    let currentWord = null;
    let sum = 0;
    for (const word of words) {
      const total_attempts = word.correctCount + word.incorrectCount;
      const weight = (1 / (1 + word.incorrectCount)) * (1 + total_attempts);
      sum += weight;
    }
    const rand = Math.random() * sum;
    let w = 0;
    for (const word of words) {
      const total_attempts = word.correctCount + word.incorrectCount;
      const weight = (1 / (1 + word.incorrectCount)) * (1 + total_attempts);
      w += weight;
      if (w >= rand) {
        currentWord = word;
        break;
      }
    }

    setShortData({
      currentWord
    });
    setLoading(false);
  }

  if (words.length === 0) {
    return <div style={{ padding: "1rem" }}>Fetching words...</div>;
  }

  if (loading || !shortData) {
    return <div style={{ padding: "1rem" }}>Loading question...</div>;
  }

  return <ShortAnswerCard shortData={shortData} loadQuestion={loadQuestion} />;
}

export default ShortAnswer;
