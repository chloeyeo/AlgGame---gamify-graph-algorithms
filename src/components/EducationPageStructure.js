import { useState, useEffect } from "react";
import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";

export default function EducationPageStructure({
  title = "Graph Traversal",
  steps = [],
  conceptText = "",
  pseudocode = "",
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const readAloud = (text, type) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

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
    } else {
      console.log("Text-to-speech is not supported in this browser.");
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsSpeakingExplanation(false);
        setIsSpeakingConcept(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Learn {title}</h1>

      <div className="w-full max-w-4xl">
        {/* Graph Visualisation Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
          <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-64 overflow-auto no-scrollbar">
            {steps.length > 0 &&
            steps[currentStep] &&
            steps[currentStep].graphState ? (
              <GraphVisualisation graphState={steps[currentStep].graphState} />
            ) : (
              <p>No graph data available</p>
            )}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon for explanation section"
              width={40}
              height={40}
              onClick={
                !isSpeakingExplanation &&
                !isSpeakingConcept &&
                steps.length > 0 &&
                steps[currentStep]
                  ? () =>
                      readAloud(steps[currentStep].explanation, "explanation")
                  : undefined
              }
              className={`cursor-pointer ${
                isSpeakingExplanation ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">Explanation</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p>
              {steps.length > 0 && steps[currentStep]
                ? steps[currentStep].explanation
                : "No explanation available"}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-gray-300 p-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Concept Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon for concept section"
              width={40}
              height={40}
              onClick={
                !isSpeakingExplanation && !isSpeakingConcept && conceptText
                  ? () => readAloud(conceptText, "concept")
                  : undefined
              }
              className={`cursor-pointer ${
                isSpeakingConcept ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">{title} Concept</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p>{conceptText || "No concept text available"}</p>
          </div>
        </div>

        {/* Pseudocode Section */}
        {pseudocode && (
          <div className="mb-6">
            <h2 className="text-xl mb-2 font-semibold">Pseudocode</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {pseudocode}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
