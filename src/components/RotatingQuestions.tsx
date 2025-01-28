import React, { useState, useEffect, useCallback, memo } from 'react';

const presetQuestions = [
  "What is the historical price trend of this token over the past month?",
  "How does the token's liquidity compare to similar tokens in the market?",
  "What are the key factors driving the token's trading volume in the last 24 hours?",
  "What is the current market cap, and how has it changed over time?",
  "What are the potential risks and rewards associated with investing in this token?"
];

interface RotatingQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled: boolean;
}

const RotatingQuestions: React.FC<RotatingQuestionsProps> = ({ onQuestionClick, disabled }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true);
  const [showComponent, setShowComponent] = useState(true);

  useEffect(() => {
    if (!showComponent) return;

    const fadeInterval = setInterval(() => {
      setIsQuestionVisible(false);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => 
          (prev + 1) % presetQuestions.length
        );
        setIsQuestionVisible(true);
      }, 300); // Fade out duration
    }, 5000);

    return () => clearInterval(fadeInterval);
  }, [showComponent]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    const question = presetQuestions[currentQuestionIndex];
    onQuestionClick(question);
    setShowComponent(false);
  }, [currentQuestionIndex, disabled, onQuestionClick]);

  if (!showComponent) return null;

  return (
    <div className="mb-4 px-4">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`w-full text-left p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 
          transition-all duration-200 ease-in-out border border-slate-600
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      >
        <div className="text-sm text-slate-400 mb-1">Try asking:</div>
        <div 
          className={`text-blue-400 font-medium transition-opacity duration-200 ease-in-out
            ${isQuestionVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {presetQuestions[currentQuestionIndex]}
        </div>
      </button>
    </div>
  );
};

export default memo(RotatingQuestions);