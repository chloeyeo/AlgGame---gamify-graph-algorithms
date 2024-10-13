import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const questions = [
    "How do I navigate the page?",
    "What are the different algorithms available?",
    "How do I switch between education and game mode?",
  ];

  const handleQuestionClick = (question) => {
    setMessages([...messages, { type: "user", text: question }]);
    let answer = "";
    switch (question) {
      case "How do I navigate the page?":
        answer =
          "Use the sidebar menu to navigate between different sections of the site. Click on the menu icon in the top left corner to open the sidebar.";
        break;
      case "What are the different algorithms available?":
        answer =
          "We offer various graph algorithms including Dijkstra's, A*, Prim's, and Kruskal's algorithms. You can select these from the sidebar menu.";
        break;
      case "How do I switch between education and game mode?":
        answer =
          "You can switch between education and game mode using the toggle in the sidebar menu. Education mode provides detailed explanations, while game mode offers interactive challenges.";
        break;
      default:
        answer =
          "I'm sorry, I don't have an answer for that question. Please try another one or contact support for more help.";
    }
    setMessages([
      ...messages,
      { type: "user", text: question },
      { type: "bot", text: answer },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 max-h-96 flex flex-col">
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
                  className={`inline-block p-2 rounded-lg ${
                    message.type === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <h4 className="font-semibold mb-2">Quick Questions:</h4>
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="block w-full text-left p-2 hover:bg-gray-100 rounded mb-1"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
