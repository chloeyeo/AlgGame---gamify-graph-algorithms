import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(true);

  const quickQuestions = [
    "How do I navigate the page?",
    "What are the different algorithms available?",
    "How do I switch between education and game mode?",
    "How does the scoring system work?",
    "What are the different difficulty levels?",
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          text: "Hello! How can I assist you today? Here are some questions I can help with:",
        },
      ]);
      setShowOptions(true);
    }
  }, [isOpen, messages.length]);

  const handleQuestionClick = (question) => {
    setShowOptions(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: question },
    ]);

    let answer = "";
    switch (question) {
      case "How do I navigate the page?":
        answer =
          "Use the sidebar menu (☰) in the top-left corner to navigate between different algorithms. Each algorithm has both education and game modes available.";
        break;
      case "What are the different algorithms available?":
        answer =
          "We offer several graph algorithms:\n\nTraversal:\n• BFS\n• DFS\n\nShortest Path:\n• Dijkstra's\n• A*\n\nMinimum Spanning Tree:\n• Prim's\n• Kruskal's\n\nNetwork Flow:\n• Ford-Fulkerson";
        break;
      case "How do I switch between education and game mode?":
        answer =
          "Use the toggle button (↔) in the top-right corner of any algorithm page to switch between modes:\n\nEducation Mode:\n• Learn step-by-step\n• View detailed explanations\n\nGame Mode:\n• Test your understanding\n• Earn points and compete";
        break;
      case "How does the scoring system work?":
        answer =
          "Points System:\n\nCorrect Moves:\n• +10-15 points\n\nIncorrect Moves:\n• -5 points\n\nRound Completion:\n• +20 bonus points\n\nNote: Scores are saved to leaderboard when logged in";
        break;
      case "What are the different difficulty levels?":
        answer =
          "Choose your challenge level:\n\nEasy:\n• Fewer nodes\n• Simple graph structures\n\nMedium:\n• More nodes\n• Moderate complexity\n\nHard:\n• Maximum nodes\n• Complex configurations";
        break;
      default:
        answer =
          "I'm sorry, I don't have an answer for that question.\n\nPlease try:\n• One of the suggested questions above\n• Rephrasing your question";
    }

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: answer },
      ]);
      setTimeout(() => {
        setShowOptions(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            text: "Do you have any other questions? I can help with:",
          },
        ]);
      }, 500);
    }, 500);
  };

  return (
    <div
      className={`fixed z-50 bottom-[12%] right-[6%] md:bottom-[15%] lg:bottom-[13%] ${
        isOpen ? "max-w-none" : ""
      }`}
    >
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold">Chat Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-md whitespace-pre-line ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-black"
                  } max-w-[70%]`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            {showOptions && (
              <div className="mt-4 space-y-2">
                {quickQuestions.map((question, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="p-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {question}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
