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
    "How do I use the chatbot?",
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
          "We offer several graph algorithms:\n\n" +
          "• Traversal:\n" +
          "  - BFS\n" +
          "  - DFS\n\n" +
          "• Shortest Path:\n" +
          "  - Dijkstra's\n" +
          "  - A*\n\n" +
          "• Minimum Spanning Tree:\n" +
          "  - Prim's\n" +
          "  - Kruskal's\n\n" +
          "• Network Flow:\n" +
          "  - Ford-Fulkerson";
        break;
      case "How do I switch between education and game mode?":
        answer =
          "Use the toggle button (<svg class='inline-block w-4 h-4' viewBox='0 0 24 24'><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'></path></svg>) in the top-right corner of any algorithm page to switch between education and game modes.\n\nEducation mode helps you learn the algorithm step by step, while game mode tests your understanding through interactive challenges.";
        break;
      case "How does the scoring system work?":
        answer =
          "The scoring system works as follows:\n\n" +
          "• Correct moves: +10-15 points\n" +
          "• Incorrect moves: -5 points\n" +
          "• Completing a round: +20 bonus points\n\n" +
          "Your scores are saved to the leaderboard if you're logged in.";
        break;
      case "What are the different difficulty levels?":
        answer =
          "There are three difficulty levels:\n\n" +
          "• Easy: Fewer nodes and simpler graph structures\n" +
          "• Medium: More nodes and moderate complexity\n" +
          "• Hard: Maximum nodes and challenging configurations\n\n" +
          "You can change difficulty during gameplay using the Difficulty button.";
        break;
      case "How do I use the chatbot?":
        answer =
          "I'm here to help! You can:\n\n" +
          "• Click on any preset questions above\n" +
          "• Type your own question about:\n" +
          "  - Algorithms\n" +
          "  - Gameplay\n" +
          "  - Navigation\n" +
          "  - Features";
        break;
      default:
        answer =
          "I'm sorry, I don't have an answer for that question. Please try one of the suggested questions above, or rephrase your question.";
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
                  className={`inline-block p-2 rounded-md ${
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
