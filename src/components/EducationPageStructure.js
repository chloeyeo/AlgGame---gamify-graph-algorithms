import React, { useState, useEffect, useRef } from "react";
import GraphVisualisation from "./GraphVisualisation";
import CodeEditorPseudocode from "./CodeEditorPseudocode";

const ExplanationSection = ({ explanation }) => {
  const formatExplanation = (text) => {
    if (text.includes("•")) {
      const [mainText, ...bullets] = text.split("•").map((t) => t.trim());
      return (
        <div className="space-y-2">
          {mainText && <p>{mainText}</p>}
          {bullets.length > 0 && (
            <ul className="list-disc pl-6 space-y-1">
              {bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (/^\d+\./.test(text)) {
      const parts = text.split(/(?=\d+\.)/).map((t) => t.trim());
      if (parts.length > 1) {
        return (
          <ol className="list-decimal pl-6 space-y-1">
            {parts.map((part, index) => (
              <li key={index}>{part.replace(/^\d+\./, "").trim()}</li>
            ))}
          </ol>
        );
      }
    }

    return <p>{text}</p>;
  };

  return (
    <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
      {formatExplanation(explanation)}
    </div>
  );
};

export default function EducationPageStructure({
  title = "Graph Algorithm",
  graphStates = [], // Now using graphStates array for all graphs
  conceptText = "",
  pseudocode = "",
  GraphVisualisationComponent = GraphVisualisation,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const nextStep = () => {
    if (currentStep < graphStates[activeTab].length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGraph = () => {
    setCurrentStep(0);
  };

  // Speech synthesis handlers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        window.speechSynthesis.cancel();
        setIsSpeakingExplanation(false);
        setIsSpeakingConcept(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleSpeech = (text, type) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const isCurrentlySpeaking =
        type === "explanation" ? isSpeakingExplanation : isSpeakingConcept;

      if (isCurrentlySpeaking) {
        window.speechSynthesis.cancel();
        if (type === "explanation") {
          setIsSpeakingExplanation(false);
        } else {
          setIsSpeakingConcept(false);
        }
        return;
      }

      window.speechSynthesis.cancel();
      setIsSpeakingExplanation(false);
      setIsSpeakingConcept(false);

      let textToRead = "";
      if (type === "concept" && typeof text === "object") {
        textToRead = `${
          text.introduction
        } Key Characteristics: ${text.keyCharacteristics.join(
          ". "
        )}. Applications: ${text.applications.join(". ")}`;
      } else {
        textToRead = text;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onstart = () => {
        if (type === "explanation") {
          setIsSpeakingExplanation(true);
        } else {
          setIsSpeakingConcept(true);
        }
      };
      utterance.onend = () => {
        if (type === "explanation") {
          setIsSpeakingExplanation(false);
        } else {
          setIsSpeakingConcept(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const getCurrentGraphState = () => {
    return graphStates[activeTab]?.[currentStep]?.graphState;
  };

  const getCurrentExplanation = () => {
    return graphStates[activeTab]?.[currentStep]?.explanation;
  };

  const renderConceptText = (text) => (
    <div className="mb-4">
      <p className="mb-2">{text?.introduction}</p>
      {text.keyCharacteristics && (
        <>
          <h3 className="font-bold mb-2">Key Characteristics:</h3>
          <ul className="list-disc pl-5 mb-2">
            {text.keyCharacteristics.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {text.applications && (
        <>
          <h3 className="font-bold mb-2">Applications:</h3>
          <ul className="list-disc pl-5">
            {text.applications.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const renderGraphSection = (isDesktop = false) => (
    <div
      className={`${
        isDesktop ? "h-[500px]" : "h-[400px]"
      } relative bg-white bg-opacity-50 rounded-lg`}
    >
      <div className="w-full h-full">
        {graphStates.length > 1 && (
          <div className="flex mb-2 border-b">
            {graphStates.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  setCurrentStep(0);
                }}
                className={`px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none ${
                  activeTab === index ? "border-blue-500 font-bold" : ""
                }`}
              >
                Graph {String.fromCharCode(65 + index)}
              </button>
            ))}
          </div>
        )}

        <div className="flex h-[calc(100%-3rem)]">
          <div className="flex-1 h-full">
            <div className="h-full flex items-center justify-center">
              {isLoading ? (
                <p>Loading graph...</p>
              ) : (
                <GraphVisualisationComponent
                  graphState={getCurrentGraphState()}
                  isGraphA={activeTab === 0}
                  graphIndex={activeTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="bg-gray-300 p-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={resetGraph}
          className="bg-yellow-500 text-white p-2 rounded"
        >
          Reset
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === graphStates[activeTab]?.length - 1}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Mobile content
  const mobileContent = (
    <main className="flex flex-col p-6 items-center justify-center lg:hidden min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Learn {title}</h1>

      <div className="w-full max-w-4xl space-y-6">
        <div className="rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Graph Visualisation</h2>
          {renderGraphSection()}
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Explanation</h2>
            <button
              onClick={() =>
                toggleSpeech(getCurrentExplanation(), "explanation")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>

          <ExplanationSection
            explanation={getCurrentExplanation() || "No explanation available"}
          />
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">{title} Concept</h2>
            <button
              onClick={() =>
                conceptText && toggleSpeech(conceptText, "concept")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          <div className={!conceptText ? "text-center" : ""}>
            {conceptText ? renderConceptText(conceptText) : "No text available"}
          </div>
        </div>

        {pseudocode && (
          <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">Pseudocode</h2>
            <CodeEditorPseudocode pseudocode={pseudocode} />
          </div>
        )}
      </div>
    </main>
  );

  // Desktop content
  const desktopContent = (
    <div className="hidden lg:flex flex-row h-screen">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Learn {title}</h1>

        {/* Graph Section */}
        <div className="mb-6">{renderGraphSection(true)}</div>

        {/* Explanation Section - Moved below graph */}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">Explanation</h2>
            <button
              onClick={() =>
                toggleSpeech(getCurrentExplanation(), "explanation")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          <ExplanationSection
            explanation={getCurrentExplanation() || "No explanation available"}
          />
        </div>
      </div>

      <div className="w-1/2 p-4 overflow-y-auto no-scrollbar border-l border-gray-300">
        {pseudocode && (
          <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Pseudocode</h2>
            <CodeEditorPseudocode pseudocode={pseudocode} />
          </div>
        )}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4 mt-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">{title} Concept</h2>
            <button
              onClick={() =>
                conceptText && toggleSpeech(conceptText, "concept")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          {conceptText
            ? renderConceptText(conceptText)
            : "No concept text available"}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}
