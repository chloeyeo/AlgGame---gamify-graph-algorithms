import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const quickQuestions = [
    "How do I navigate the page?",
    "What are the different algorithms available?",
    "How do I switch between education and game mode?",
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          text: "Hello! How can I assist you today? Here are some questions I can help with:",
        },
        ...quickQuestions.map((q) => ({
          type: "bot",
          text: q,
          isQuestion: true,
        })),
      ]);
    }
  }, [isOpen]);

  const handleQuestionClick = (question) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: question },
    ]);

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
          "I'm sorry, I don't have an answer for that question. Is there anything else I can help you with?";
    }

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: answer },
        {
          type: "bot",
          text: "Do you have any other questions? I can help with:",
        },
        ...quickQuestions.map((q) => ({
          type: "bot",
          text: q,
          isQuestion: true,
        })),
      ]);
    }, 500);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 sm:bottom-[calc(50vh-288px+1rem)] sm:right-[calc(50vw-288px+1rem)]">
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
                      : message.isQuestion
                      ? "bg-yellow-100 cursor-pointer hover:bg-yellow-200"
                      : "bg-pink-100"
                  } ${
                    message.type === "user" ? "max-w-[70%]" : "max-w-[100%]"
                  }`}
                  onClick={() =>
                    message.isQuestion && handleQuestionClick(message.text)
                  }
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
