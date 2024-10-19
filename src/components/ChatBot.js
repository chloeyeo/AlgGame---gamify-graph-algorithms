// import React, { useState, useEffect } from "react";
// import { MessageCircle, X } from "lucide-react";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [showOptions, setShowOptions] = useState(true);

//   const quickQuestions = [
//     "How do I navigate the page?",
//     "What are the different algorithms available?",
//     "How do I switch between education and game mode?",
//   ];

//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setMessages([
//         {
//           type: "bot",
//           text: "Hello! How can I assist you today? Here are some questions I can help with:",
//         },
//       ]);
//       setShowOptions(true);
//     }
//   }, [isOpen]);

//   const handleQuestionClick = (question) => {
//     setShowOptions(false);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { type: "user", text: question },
//     ]);

//     let answer = "";
//     switch (question) {
//       case "How do I navigate the page?":
//         answer =
//           "Use the sidebar menu to navigate between different sections of the site. Click on the menu icon in the top left corner to open the sidebar.";
//         break;
//       case "What are the different algorithms available?":
//         answer =
//           "We offer various graph algorithms including Dijkstra's, A*, Prim's, and Kruskal's algorithms. You can select these from the sidebar menu.";
//         break;
//       case "How do I switch between education and game mode?":
//         answer =
//           "You can switch between education and game mode using the toggle in the sidebar menu. Education mode provides detailed explanations, while game mode offers interactive challenges.";
//         break;
//       default:
//         answer =
//           "I'm sorry, I don't have an answer for that question. Is there anything else I can help you with?";
//     }

//     setTimeout(() => {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { type: "bot", text: answer },
//       ]);
//       setTimeout(() => {
//         setShowOptions(true);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             type: "bot",
//             text: "Do you have any other questions? I can help with:",
//           },
//         ]);
//       }, 500);
//     }, 500);
//   };

//   return (
//     <div className="fixed z-50 sm:bottom-[calc(50vh-288px+1rem)] sm:right-[calc(50vw-288px+1rem)]">
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors"
//         >
//           <MessageCircle size={24} />
//         </button>
//       )}
//       {isOpen && (
//         <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
//           <div className="flex justify-between items-center p-4 border-b">
//             <h3 className="font-bold">Chat Assistant</h3>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X size={20} />
//             </button>
//           </div>
//           <div className="flex-grow overflow-y-auto p-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`mb-2 ${
//                   message.type === "user" ? "text-right" : "text-left"
//                 }`}
//               >
//                 <span
//                   className={`inline-block p-2 rounded-md ${
//                     message.type === "user"
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-100 text-black"
//                   } ${
//                     message.type === "user" ? "max-w-[70%]" : "max-w-[100%]"
//                   }`}
//                 >
//                   {message.text}
//                 </span>
//               </div>
//             ))}
//             {showOptions && (
//               <div className="mt-4 space-y-2">
//                 {quickQuestions.map((question, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleQuestionClick(question)}
//                     className="p-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200"
//                   >
//                     {question}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;

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
  }, [isOpen]);

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
      className={`fixed z-50 bottom-[12%] right-[6%] md:bottom-[15%] ${
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
