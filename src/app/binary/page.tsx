"use client"

import { useState } from 'react';
import Head from 'next/head';
import localFont from 'next/font/local';

interface ScoreResult {
  percentage: number;
  correctNumber: string;
  userAnswer: string;
}

const squid = localFont({
  src: '../../fonts/squidfont.ttf',
  variable: "--font-squid",
  display: 'swap',
})

export default function BinaryMemoryGame() {
  const [binaryNumber, setBinaryNumber] = useState<string>('');
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  const generateBinaryNumber = (): string => {
    const length = 10; 
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 2).toString();
    }
    return result;
  };
  
  
  const startGame = (): void => {
    const newBinary = generateBinaryNumber();
    setBinaryNumber(newBinary);
    setGameStarted(true);
    setAnimationComplete(false);
    setUserInput('');
    setScore(null);
    
    setTimeout(() => {
      setAnimationComplete(true);
    }, 2000); 
  };
  
  const checkAnswer = (): void => {
    if (!userInput) return;
    
    let correctDigits = 0;
    const minLength = Math.min(userInput.length, binaryNumber.length);
    
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === binaryNumber[i]) {
        correctDigits++;
      }
    }
    
    const percentage = Math.round((correctDigits / binaryNumber.length) * 100);
    setScore({
      percentage,
      correctNumber: binaryNumber,
      userAnswer: userInput
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Head>
        <title>Binary Memory Game</title>
        <meta name="description" content="Test your memory with binary numbers" />
      </Head>
      
      <h1 className={`text-3xl font-bold mb-8 text-center ${squid.className}`} >Binary Memory Game</h1>
      
      {!gameStarted ? (
        <div className="w-full max-w-md">
          <p className="text-center mb-4">Remember the binary sequence as it moves across the screen!</p>
          <button
            onClick={startGame}
            className="w-full bg-black text-white py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          {!animationComplete ? (
            <div className="relative h-16 bg-white border-2 border-gray-300 rounded overflow-hidden">
              <div 
                className="absolute whitespace-nowrap text-2xl font-mono p-4"
                style={{
                  animation: "moveLeftToRight 2s linear forwards"
                }}
              >
                {binaryNumber}
              </div>
              <style jsx>{`
                @keyframes moveLeftToRight {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(300%); }
                }
              `}</style>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center">What binary number did you see?</p>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/[^01]/g, ''))}
                placeholder="Enter the binary number"
                className="w-full p-2 border rounded font-mono text-xl text-center"
                maxLength={binaryNumber.length}
              />
              
              {score === null ? (
                <button
                  onClick={checkAnswer}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  Check My Answer
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-white rounded border">
                    <p className="mb-2">Your score: <span className="font-bold text-xl">{score.percentage}%</span></p>
                    <p className="mb-2">Correct number: <span className="font-mono">{score.correctNumber}</span></p>
                    <p>Your answer: <span className="font-mono">{score.userAnswer}</span></p>
                  </div>
                  <button
                    onClick={startGame}
                    className="w-full bg-black  text-white py-2 px-4 rounded"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}