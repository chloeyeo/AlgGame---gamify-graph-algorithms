import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";

export default function GamePageStructure({
  title = "Graph Traversal Game",
  steps = [],
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeakingFeedback, setIsSpeakingFeedback] = useState(false);
  const router = useRouter();

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

  const readAloud = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      utterance.onstart = () => {
        setIsSpeakingFeedback(true);
      };

      utterance.onend = () => {
        setIsSpeakingFeedback(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-speech is not supported in this browser.");
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsSpeakingFeedback(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Stop speech when the path changes
    const handlePathChange = () => {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      setIsSpeakingFeedback(false);
    };

    const pathname = router.pathname;

    // Re-run when pathname changes
    handlePathChange();
  }, [router.pathname]);

  useEffect(() => {
    // Automatically read the feedback when the step changes
    if (steps.length > 0 && steps[currentStep]) {
      readAloud(steps[currentStep].feedback);
    }
  }, [currentStep, steps]);

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{title}</h1>

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

        {/* Feedback Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon for feedback section"
              width={40}
              height={40}
              className={`${
                isSpeakingFeedback ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">Feedback</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
            <p>
              {steps.length > 0 && steps[currentStep]
                ? steps[currentStep].feedback
                : "No feedback available"}
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
      </div>
    </main>
  );
}
