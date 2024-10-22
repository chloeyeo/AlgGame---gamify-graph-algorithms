import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GraphVisualisation from "@/components/GraphVisualisation";
import * as Tabs from "@radix-ui/react-tabs";

export default function EducationPageStructure({
  title = "Graph Algorithm",
  steps = [],
  comparisonSteps = [],
  conceptText = "",
  pseudocode = "",
  GraphVisualisationComponent = GraphVisualisation,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);
  const [activeTab, setActiveTab] = useState("graph1");
  const router = useRouter();
  const [isLoadingGraphA, setIsLoadingGraphA] = useState(false);
  const [isLoadingGraphB, setIsLoadingGraphB] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "graph1") {
        setIsLoadingGraphA(false);
      } else {
        setIsLoadingGraphB(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const nextStep = () => {
    const maxSteps = Math.min(
      steps.length,
      comparisonSteps.length || steps.length
    );
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

  useEffect(() => {
    const handlePathChange = () => {
      window.speechSynthesis.cancel();
      setIsSpeakingExplanation(false);
      setIsSpeakingConcept(false);
    };

    handlePathChange();
  }, [router.pathname]);

  const toggleSpeech = (text, type) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeakingExplanation(false);
        setIsSpeakingConcept(false);
      } else {
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
        utterance.onstart = () =>
          type === "explanation"
            ? setIsSpeakingExplanation(true)
            : setIsSpeakingConcept(true);
        utterance.onend = () =>
          type === "explanation"
            ? setIsSpeakingExplanation(false)
            : setIsSpeakingConcept(false);
        window.speechSynthesis.speak(utterance);
      }
    }
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

  // const renderGraphSection = (graphSteps, isGraphA) => {
  //   return (
  //     <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-[27rem] lg:h-[calc(100%-4rem)] overflow-auto no-scrollbar relative">
  //       {isLoadingGraphA || isLoadingGraphB ? (
  //         <p>Loading graph...</p>
  //       ) : graphSteps[currentStep]?.graphState ? (
  //         <GraphVisualisationComponent
  //           graphState={graphSteps[currentStep].graphState}
  //           isGraphA={isGraphA}
  //         />
  //       ) : (
  //         <p>No graph data available</p>
  //       )}
  //     </div>
  //   );
  // };

  // Mobile content
  const mobileContent = (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar lg:hidden">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Learn {title}</h1>

      <div className="w-full max-w-4xl">
        {/* Graph Visualization Section */}
        <div className="mb-6">
          <h2 className="text-xl px-3 mb-2 font-semibold">
            Graph Visualisation
          </h2>
          {comparisonSteps.length > 0 ? (
            <Tabs.Root
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <Tabs.List className="flex mb-2 border-b">
                <Tabs.Trigger
                  value="graph1"
                  className={`px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 ${
                    activeTab === "graph1" ? "!border-blue-500 font-bold" : ""
                  }`}
                >
                  Graph A
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="graph2"
                  className={`px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 ${
                    activeTab === "graph2" ? "border-blue-500 font-bold" : ""
                  }`}
                >
                  Graph B
                </Tabs.Trigger>
              </Tabs.List>

              <div className="flex space-x-4">
                <Tabs.Content value="graph1" className="flex-1">
                  <div className="h-[400px] bg-white border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {isLoadingGraphA ? (
                      <p>Loading graph...</p>
                    ) : (
                      <GraphVisualisationComponent
                        graphState={steps[currentStep]?.graphState}
                        isGraphA={true}
                      />
                    )}
                  </div>
                </Tabs.Content>
                <Tabs.Content value="graph2" className="flex-1">
                  <div className="h-[400px] bg-white border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {isLoadingGraphB ? (
                      <p>Loading graph...</p>
                    ) : (
                      <GraphVisualisationComponent
                        graphState={comparisonSteps[currentStep]?.graphState}
                        isGraphA={false}
                      />
                    )}
                  </div>
                </Tabs.Content>
              </div>
            </Tabs.Root>
          ) : (
            <div className="h-[400px] bg-white border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {isLoadingGraphA ? (
                <p>Loading graph...</p>
              ) : (
                <GraphVisualisationComponent
                  graphState={steps[currentStep]?.graphState}
                  isGraphA={true}
                />
              )}
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-gray-300 p-2 rounded disabled:opacity-50"
            >
              Prev
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

        {/* Explanation Section */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Explanation</h2>
            <button
              onClick={() =>
                toggleSpeech(steps[currentStep]?.explanation, "explanation")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p>
              {steps[currentStep]?.explanation || "No explanation available"}
            </p>
          </div>
        </div>

        {/* Concept Section */}
        <div className="mb-6">
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
          <div
            className={`bg-white border border-gray-300 rounded-lg p-4 ${
              !conceptText ? "text-center" : ""
            }`}
          >
            {conceptText ? renderConceptText(conceptText) : "No text available"}
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

  // Desktop content
  const desktopContent = (
    <div className="hidden lg:flex flex-row h-screen">
      {/* Left Panel - Graph Visualization */}
      <div className="w-1/2 p-4 border-r border-gray-300">
        <h1 className="text-2xl font-bold mb-4">Learn {title}</h1>

        <div className="bg-white rounded-lg shadow-md p-4 h-auto">
          {comparisonSteps.length > 0 ? (
            <div>
              <div className="flex mb-4 border-b">
                <button
                  onClick={() => setActiveTab("graph1")}
                  className={`px-4 py-2 ${
                    activeTab === "graph1"
                      ? "border-b-2 border-blue-500 font-bold"
                      : ""
                  }`}
                >
                  Graph A
                </button>
                <button
                  onClick={() => setActiveTab("graph2")}
                  className={`px-4 py-2 ${
                    activeTab === "graph2"
                      ? "border-b-2 border-blue-500 font-bold"
                      : ""
                  }`}
                >
                  Graph B
                </button>
              </div>
              <div className="h-[500px]">
                {activeTab === "graph1" ? (
                  <GraphVisualisationComponent
                    graphState={steps[currentStep]?.graphState}
                    isGraphA={true}
                  />
                ) : (
                  <GraphVisualisationComponent
                    graphState={comparisonSteps[currentStep]?.graphState}
                    isGraphA={false}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="h-[500px]">
              <GraphVisualisationComponent
                graphState={steps[currentStep]?.graphState}
                isGraphA={true}
              />
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Explanation and Pseudocode */}
      <div className="w-1/2 p-4 overflow-y-auto no-scrollbar">
        {/* Explanation Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">Explanation</h2>
            <button
              onClick={() =>
                toggleSpeech(steps[currentStep]?.explanation, "explanation")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          <p>{steps[currentStep]?.explanation || "No explanation available"}</p>
        </div>

        {/* Concept Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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

        {/* Pseudocode Section */}
        {pseudocode && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Pseudocode</h2>
            <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto font-mono text-sm">
              {pseudocode}
            </pre>
          </div>
        )}
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
