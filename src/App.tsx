/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Trophy, 
  Lightbulb, 
  Star,
  RefreshCcw,
  BookOpen
} from 'lucide-react';

// --- Types ---
interface Option {
  id: string;
  text: string;
}

// --- Sound Effects ---
const sounds = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: '/Sounds/Correct.mp3',
  error: '/Sounds/Error.mp3'
};

const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Audio play blocked", e));
};

interface Question {
  id: number;
  title: string;
  text: string;
  image?: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
  color: string;
}

// --- Data ---
const questions: Question[] = [
  {
    id: 1,
    title: "The Water Jar Mystery!",
    text: "Look at the picture of the water in the container. Can you tell how much water is inside, to the closest full liter?",
    image: "https://storage.googleapis.com/static.ai.studio/wicmo3ytfpqj4dzev4v6av/water_jar_q1.png",
    options: [
      { id: "A", text: "4 liters" },
      { id: "B", text: "6 liters" },
      { id: "C", text: "8 liters" },
      { id: "D", text: "12 liters" }
    ],
    correctAnswer: "C",
    explanation: "Let's become measurement detectives, Ibrahim! Look closely at the scale on the side of the jar. Notice how the numbers go up: 2, 4, 6, 8, 10, 12. Each big mark represents 2 liters. The gray water line stops exactly at the mark labeled '8 L'. This means the container is holding 8 liters of water. If it was halfway between 6 and 8, it would be 7, but it's right on the 8! You're a measurement master!",
    color: "bg-blue-100 border-blue-400 text-blue-900"
  },
  {
    id: 2,
    title: "Story Problem Detective!",
    text: "Which story problem is best for the math problem 54 ÷ 6?",
    options: [
      { id: "A", text: "There are 54 pieces of candy and 6 are eaten." },
      { id: "B", text: "There are 6 buses with 54 students on each bus." },
      { id: "C", text: "Mila has 6 marbles in a bag and puts 54 more marbles into the bag." },
      { id: "D", text: "Scott has 54 toy cars and gives an equal number of toy cars to each of 6 friends." }
    ],
    correctAnswer: "D",
    explanation: "Division is all about sharing or splitting into equal groups! Let's check our options: Choice A says 'eaten', which means taking away (54 - 6). Choice B says '6 buses with 54 each', which means groups of groups (6 × 54). Choice C says 'puts more into', which is adding (6 + 54). Choice D is the winner because Scott has a total (54) and shares them EQUALLY among friends (6). That is exactly what 54 ÷ 6 means! Each friend gets 9 cars because 6 × 9 = 54.",
    color: "bg-yellow-100 border-yellow-400 text-yellow-900"
  },
  {
    id: 3,
    title: "Fraction Fun!",
    text: "Which fraction has a value equivalent to 3?",
    options: [
      { id: "A", text: "1/3" },
      { id: "B", text: "3/3" },
      { id: "C", text: "6/3" },
      { id: "D", text: "9/3" }
    ],
    correctAnswer: "D",
    explanation: "Think of a fraction bar as a division symbol! 9/3 is the same as saying '9 divided by 3'. If you have 9 cookies and share them with 3 friends, everyone gets 3 cookies! Let's look at the others: 3/3 = 1 (because 3 ÷ 3 = 1), and 6/3 = 2 (because 6 ÷ 3 = 2). So, 9/3 is the only one that equals exactly 3 wholes. You're a fraction wizard!",
    color: "bg-green-100 border-green-400 text-green-900"
  },
  {
    id: 4,
    title: "Area Adventure!",
    text: "A rectangle is 7 units long and 3 units wide. What is the area in square units?",
    options: [
      { id: "A", text: "10 square units" },
      { id: "B", text: "14 square units" },
      { id: "C", text: "20 square units" },
      { id: "D", text: "21 square units" }
    ],
    correctAnswer: "D",
    explanation: "Area is the amount of space inside a flat shape. To find the area of a rectangle, we use the formula: Length × Width. In this puzzle, the length is 7 and the width is 3. So, 7 × 3 = 21! You can also think of it as 3 rows of 7 squares, or 7 columns of 3 squares. Either way, you get 21 square units. Fantastic job!",
    color: "bg-purple-100 border-purple-400 text-purple-900"
  },
  {
    id: 5,
    title: "Number Line Navigator!",
    text: "On a number line divided into 8 equal parts between 0 and 1, which point represents 3/8?",
    options: [
      { id: "A", text: "Point A (1st mark)" },
      { id: "B", text: "Point B (3rd mark)" },
      { id: "C", text: "Point C (6th mark)" },
      { id: "D", text: "Point D (7th mark)" }
    ],
    correctAnswer: "B",
    explanation: "Imagine the space between 0 and 1 is a long chocolate bar cut into 8 equal pieces. Each mark on the line is one piece (1/8). To find 3/8, you need to jump 3 pieces away from 0. Jump 1... Jump 2... Jump 3! That lands you exactly on Point B. Point A is only 1/8, and Point C is way over at 6/8. You're a number line expert!",
    color: "bg-orange-100 border-orange-400 text-orange-900"
  },
  {
    id: 6,
    title: "Road Trip Rounding!",
    text: "Total trip: 198 miles. Day 1: 62 miles. Day 2: 69 miles. What is the closest number of miles driven on Day 3?",
    options: [
      { id: "A", text: "60 miles" },
      { id: "B", text: "70 miles" },
      { id: "C", text: "130 miles" },
      { id: "D", text: "200 miles" }
    ],
    correctAnswer: "B",
    explanation: "This is a multi-step mission! Step 1: Find out how many miles were driven in the first two days by adding them (62 + 69 = 131 miles). Step 2: Find out how many miles are left for Day 3 by subtracting from the total (198 - 131 = 67 miles). Step 3: The question asks for the 'closest' number, which means rounding! 67 is closer to 70 than it is to 60. Since the last digit is 7 (which is 5 or more), we round up to 70. Great thinking!",
    color: "bg-pink-100 border-pink-400 text-pink-900"
  },
  {
    id: 7,
    title: "Place Value Power!",
    text: "In the number 3,958, what digit is in the tens place?",
    options: [
      { id: "A", text: "3" },
      { id: "B", text: "5" },
      { id: "C", text: "8" },
      { id: "D", text: "9" }
    ],
    correctAnswer: "B",
    explanation: "Every digit in a number has a special home! In 3,958: The 8 is in the 'Ones' home. The 5 is in the 'Tens' home (it stands for 50!). The 9 is in the 'Hundreds' home (it stands for 900!). The 3 is in the 'Thousands' home (it stands for 3,000!). So, the digit living in the tens place is 5. You've got the power of place value!",
    color: "bg-indigo-100 border-indigo-400 text-indigo-900"
  },
  {
    id: 8,
    title: "Water Workout!",
    text: "Pat drinks 2 glasses/day for 5 days. Mary drinks 4 glasses/day for 5 days. Which equation finds the total 'g'?",
    options: [
      { id: "A", text: "2 + 5 = 7; 4 + 5 = 9; 7 + 9 = g" },
      { id: "B", text: "2 + 5 = 7; 4 + 5 = 9; 7 × 9 = g" },
      { id: "C", text: "2 × 5 = 10; 4 × 5 = 20; 10 + 20 = g" },
      { id: "D", text: "2 × 5 = 10; 4 × 5 = 20; 10 × 20 = g" }
    ],
    correctAnswer: "C",
    explanation: "We need to find the total amount of water for both people. First, calculate Pat's total: 2 glasses every day for 5 days means 2 × 5 = 10. Next, calculate Mary's total: 4 glasses every day for 5 days means 4 × 5 = 20. To find the grand total 'g', we add their totals together: 10 + 20 = g. Choice C follows these steps perfectly. You're a logic master!",
    color: "bg-teal-100 border-teal-400 text-teal-900"
  },
  {
    id: 9,
    title: "Missing Squares!",
    text: "A model has a tall part (6x2) and a short part (3x5). What is the total area?",
    options: [
      { id: "A", text: "14 square units" },
      { id: "B", text: "15 square units" },
      { id: "C", text: "27 square units" },
      { id: "D", text: "45 square units" }
    ],
    correctAnswer: "C",
    explanation: "To find the total area of a shape made of two parts, we find the area of each part and then add them together! Part 1 (the tall part) is 6 units high and 2 units wide: 6 × 2 = 12. Part 2 (the short part) is 3 units high and 5 units wide: 3 × 5 = 15. Now, add the two areas: 12 + 15 = 27 square units. You're building great math skills!",
    color: "bg-red-100 border-red-400 text-red-900"
  },
  {
    id: 10,
    title: "Lemonade Logic!",
    text: "Ms. Wayne has 12 liters of lemonade and 6 containers. How many liters go in each container equally?",
    options: [
      { id: "A", text: "2 liters" },
      { id: "B", text: "6 liters" },
      { id: "C", text: "18 liters" },
      { id: "D", text: "72 liters" }
    ],
    correctAnswer: "A",
    explanation: "When we share something equally, we use division! Ms. Wayne has 12 liters total and wants to split them into 6 equal groups. So we do 12 ÷ 6. Think: 'What number times 6 equals 12?' The answer is 2! So, each container gets exactly 2 liters of delicious lemonade. Refreshing work, Ibrahim!",
    color: "bg-lime-100 border-lime-400 text-lime-900"
  },
  {
    id: 11,
    title: "Fraction Face-Off!",
    text: "Which two fractions each have a value greater than 2/4?",
    options: [
      { id: "A", text: "1/4 and 2/6" },
      { id: "B", text: "3/4 and 2/3" },
      { id: "C", text: "2/3 and 1/4" },
      { id: "D", text: "3/4 and 2/6" }
    ],
    correctAnswer: "B",
    explanation: "First, let's simplify 2/4. It's exactly the same as 1/2 (one half). Now we look for fractions bigger than a half. 3/4 is 3 pieces out of 4, which is more than half! 2/3 is 2 pieces out of 3, which is also more than half! In Choice A, 1/4 is less than half. In Choice C, 1/4 is also there. In Choice D, 2/6 is less than half. So B is the only pair where BOTH are bigger than 2/4. You're a fraction champion!",
    color: "bg-cyan-100 border-cyan-400 text-cyan-900"
  },
  {
    id: 12,
    title: "True or False Fractions!",
    text: "Which number sentence is true?",
    options: [
      { id: "A", text: "1/8 = 2/4" },
      { id: "B", text: "2/3 = 4/6" },
      { id: "C", text: "3/4 = 3/6" },
      { id: "D", text: "1/2 = 2/8" }
    ],
    correctAnswer: "B",
    explanation: "Equivalent fractions are like the same amount of pizza cut into different numbers of slices! To check if they are equal, see if you can multiply the numerator (top) and denominator (bottom) by the same number. For 2/3, if we multiply both by 2, we get: (2×2) / (3×2) = 4/6. That means 2/3 and 4/6 are exactly the same value! The others don't work: 1/2 is not 2/8 (that would be 4/8). Choice B is the truth!",
    color: "bg-violet-100 border-violet-400 text-violet-900"
  },
  {
    id: 13,
    title: "Missing Number Mystery!",
    text: "32 ÷ ? = 8. Which equation can be used to solve for the unknown?",
    options: [
      { id: "A", text: "32 × 8 = ?" },
      { id: "B", text: "32 + 8 = ?" },
      { id: "C", text: "8 × ? = 32" },
      { id: "D", text: "8 + ? = 32" }
    ],
    correctAnswer: "C",
    explanation: "Multiplication and division are best friends! They belong to 'fact families'. If you know that 32 divided by a mystery number is 8, you also know that 8 times that mystery number must equal 32. It's like working backwards! 8 × 4 = 32, so the mystery number is 4. Choice C is the perfect way to solve it. You're a math detective!",
    color: "bg-emerald-100 border-emerald-400 text-emerald-900"
  },
  {
    id: 14,
    title: "Playground Puzzle!",
    text: "An L-shaped playground has side lengths of 3m, 7m, 9m, and 4m. What is the total area in square meters?",
    options: [
      { id: "A", text: "23 square meters" },
      { id: "B", text: "32 square meters" },
      { id: "C", text: "45 square meters" },
      { id: "D", text: "63 square meters" }
    ],
    correctAnswer: "C",
    explanation: "To find the area of an L-shape, we 'chop' it into two simple rectangles. Rectangle 1 is 3m wide and 7m long: 3 × 7 = 21. Rectangle 2 is the rest of the shape. Its width is 9m minus the 3m we already used (9 - 3 = 6m), and its length is 4m. So, 6 × 4 = 24. Finally, add the two areas together: 21 + 24 = 45 square meters. You've mastered complex area! Amazing!",
    color: "bg-rose-100 border-rose-400 text-rose-900"
  }
];

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-10 border-2 border-black">
      <motion.div 
        className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for forward
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (optionId: string) => {
    if (showExplanation) return;
    playSound(sounds.click);
    setSelectedAnswer(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
      playSound(sounds.success);
    } else {
      const audio = new Audio(sounds.error);
      audio.volume = 1.0;
      audio.play().catch(e => console.log("Audio play blocked", e));
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    playSound(sounds.click);
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    playSound(sounds.click);
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    playSound(sounds.click);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-white border-8 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center rounded-[40px]"
        >
          <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">You're a Legend, Ibrahim!</h1>
          <p className="text-2xl mb-8 font-bold text-gray-600">You've mastered the Math Quest!</p>
          
          <div className="bg-yellow-100 p-8 rounded-[32px] mb-10 border-4 border-black">
            <p className="text-lg uppercase font-black text-yellow-700 mb-2 tracking-widest">Your Superhero Score</p>
            <p className="text-8xl font-black text-black">{score} / {questions.length}</p>
          </div>

          <button 
            onClick={resetQuiz}
            className="w-full py-6 bg-black text-white font-black text-2xl rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none"
          >
            <RefreshCcw className="w-8 h-8" />
            Restart Quest
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-6 font-sans">
      <div className="max-w-xl mx-auto">
        {/* Header - Matching Image */}
        <header className="bg-white border-4 border-black p-4 md:p-5 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl md:text-3xl">🚀</span>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
              Ibrahim's Math Quest!
            </h1>
            <span className="text-2xl md:text-3xl">🚀</span>
          </div>
          <p className="text-base md:text-lg font-black text-gray-700 flex items-center justify-center gap-2">
            You are a Math Superhero! Let's solve these puzzles! 🧠 ✨
          </p>
          
          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full font-black text-sm flex items-center gap-2 shadow-lg">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{score}</span>
          </div>
        </header>

        <ProgressBar current={currentIndex} total={questions.length} />

        <div className="relative overflow-hidden min-h-[450px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0, scale: 0.9 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                bounce: 0.5 
              }}
              className={`border-8 border-black p-5 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-[32px] ${currentQuestion.color.split(' ')[0]}`}
            >
              <div className="mb-5">
                <span className="inline-block px-2 py-1 bg-black text-white text-[10px] font-black rounded-lg mb-3 uppercase tracking-[0.2em]">
                  Mission {currentIndex + 1} of {questions.length}
                </span>
                <h2 className="text-xl md:text-3xl font-black leading-tight mb-3 tracking-tight">
                  {currentQuestion.title}
                </h2>
                <p className="text-lg md:text-xl font-black text-gray-900 leading-tight">
                  {currentQuestion.text}
                </p>
              </div>

              {currentQuestion.image && (
                <div className="mb-5 border-4 border-black rounded-[20px] overflow-hidden bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <img 
                    src={currentQuestion.image} 
                    alt="Quest visual" 
                    className="w-full h-auto object-cover max-h-[200px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="grid gap-3 mb-5">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = showExplanation && option.id === currentQuestion.correctAnswer;
                  const isWrong = showExplanation && isSelected && option.id !== currentQuestion.correctAnswer;

                  let stateClasses = "bg-white border-black hover:bg-gray-50";
                  if (isSelected) stateClasses = "bg-yellow-300 border-black ring-4 ring-black ring-offset-2";
                  if (isCorrect) stateClasses = "bg-green-500 border-black text-white";
                  if (isWrong) stateClasses = "bg-red-500 border-black text-white";

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      disabled={showExplanation}
                      className={`flex items-center gap-3 p-3 md:p-5 border-4 rounded-[16px] text-left transition-all duration-200 active:scale-95 ${stateClasses}`}
                    >
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : isWrong ? (
                          <Circle className="w-7 h-7 opacity-50" />
                        ) : (
                          <div className={`w-7 h-7 rounded-full border-4 border-black flex items-center justify-center font-black text-base ${isSelected ? 'bg-black text-white' : 'bg-transparent'}`}>
                            {option.id}
                          </div>
                        )}
                      </div>
                      <span className="text-base md:text-lg font-black leading-tight">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {!showExplanation && (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-[0.1em] transition-all border-4 border-black ${
                    selectedAnswer 
                      ? 'bg-black text-white hover:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Check Answer
                </button>
              )}

              {showExplanation && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`border-4 border-black p-6 md:p-8 rounded-[20px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                    selectedAnswer === currentQuestion.correctAnswer 
                      ? 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100' 
                      : 'bg-gradient-to-br from-orange-100 via-yellow-50 to-amber-100'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-2xl ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-500' : 'bg-orange-500'}`}>
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-black text-xl md:text-2xl uppercase mb-2 tracking-tight ${
                        selectedAnswer === currentQuestion.correctAnswer ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {selectedAnswer === currentQuestion.correctAnswer ? "🎉 Spot on, Ibrahim!" : "💪 Not quite, but keep going!"}
                      </h4>
                    </div>
                  </div>
                  <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>


        {/* Navigation Buttons Outside Card */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex-1 py-4 font-black text-lg rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest border-4 border-black ${
              currentIndex === 0 
                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex-[2] py-4 bg-blue-600 text-white font-black text-lg rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 active:translate-y-1 active:shadow-none"
          >
            {currentIndex === questions.length - 1 ? "Finish Quest" : "Next Mission"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between text-gray-500 font-black text-sm uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse border-2 border-black" />
            Math Superhero Training
          </div>
          <div>Mission {currentIndex + 1} / {questions.length}</div>
        </div>

      </div>
    </div>
  );
}
