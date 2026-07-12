import { useState, useEffect } from 'react';

function Quiz({ quizData, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState(new Set());

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setDisabledOptions(new Set());
  }, [quizData]);

  if (!quizData || quizData.length === 0) return null;

  const questionObj = quizData[currentIndex];
  const isLastQuestion = currentIndex === quizData.length - 1;
  const total = quizData.length;

  const getCorrectIndex = (qObj) => {
    if (typeof qObj.correctIndex === 'number') {
      return qObj.correctIndex;
    }
    if (qObj.answer !== undefined) {
      return qObj.options.findIndex((opt) => opt === qObj.answer);
    }
    return -1;
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    const correctIndex = getCorrectIndex(questionObj);
    const correct = index === correctIndex;
    setIsCorrect(correct);

    if (correct) {
      if (isLastQuestion) {
        onComplete();
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          setDisabledOptions(new Set());
        }, 800);
      }
    } else {
      setDisabledOptions((prev) => new Set([...prev, index]));
    }
  };

  return (
    <div className="quiz">
      <div className="quiz-label">
        checkpoint{total > 1 ? ` ${currentIndex + 1} / ${total}` : ''}
      </div>
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
            disabled={isCorrect || disabledOptions.has(idx)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Quiz;
