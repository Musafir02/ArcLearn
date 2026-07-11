import { useState, useEffect } from 'react';

function Quiz({ quizData, onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
  }, [quizData]);

  if (!quizData || quizData.length === 0) {
    return null;
  }

  const questionObj = quizData[0];

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    const correct = index === questionObj.correctIndex;
    setIsCorrect(correct);
    if (correct) {
      onComplete();
    }
  };

  return (
    <div className="quiz">
      <div className="quiz-label">checkpoint</div>
      <div className="quiz-q">{questionObj.question}</div>
      {questionObj.options.map((option, idx) => {
        let className = 'option';
        if (selectedOption === idx) {
          className += isCorrect ? ' correct' : ' incorrect';
        }
        return (
          <button
            key={idx}
            className={className}
            onClick={() => handleOptionClick(idx)}
            disabled={isCorrect}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Quiz;
