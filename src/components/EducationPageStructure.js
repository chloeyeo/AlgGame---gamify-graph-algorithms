import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";
import * as Tabs from "@radix-ui/react-tabs";

export default function EducationPageStructure({
  title = "Graph Algorithm",
  steps = [],
  comparisonSteps = [],
  conceptText = "",
  pseudocode = "",
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);
  const [activeTab, setActiveTab] = useState("graph1"); // Default to Graph A
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
    const maxSteps =
      comparisonSteps.length > 0
        ? Math.min(steps.length, comparisonSteps.length)
        : steps.length;
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

  const renderConceptText = (text) => (
    <>
      <p className="mb-4">{text?.introduction}</p>
      {text.keyCharacteristics && (
        <>
          <h3 className="text-lg font-bold mb-2">Key Characteristics:</h3>
          <ul className="list-disc pl-5 mb-4">
            {text.keyCharacteristics.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {text.applications && (
        <>
          <h3 className="text-lg font-bold mb-2">Applications:</h3>
          <ul className="list-disc pl-5">
            {text.applications.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );

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

  const renderGraphSection = (graphSteps, isGraphA) => {
    return (
      <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-[27rem] overflow-auto no-scrollbar relative">
        {isLoadingGraphA || isLoadingGraphB ? (
          <p>Loading graph...</p> // Replace with a loading spinner if desired
        ) : graphSteps[currentStep]?.graphState ? (
          <GraphVisualisation
            graphState={graphSteps[currentStep].graphState}
            isGraphA={isGraphA}
          />
        ) : (
          <p>No graph data available</p>
        )}
      </div>
    );
  };

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
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
                  {/* {renderGraphSection(steps)} */}
                  {/* {renderGraphSection(steps, isGraphA)} */}
                  {renderGraphSection(steps, true)} {/* Graph A */}
                </Tabs.Content>
                <Tabs.Content value="graph2" className="flex-1">
                  {/* {renderGraphSection(comparisonSteps)} */}
                  {/* {renderGraphSection(comparisonSteps, !isGraphA)} */}
                  {renderGraphSection(comparisonSteps, false)} {/* Graph B */}
                </Tabs.Content>
              </div>
            </Tabs.Root>
          ) : (
            renderGraphSection(steps, true) // Default to Graph A if no comparisons
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
              disabled={
                currentStep ===
                (comparisonSteps.length > 0
                  ? Math.min(steps.length, comparisonSteps.length)
                  : steps.length) -
                  1
              }
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
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
              onClick={() =>
                toggleSpeech(steps[currentStep]?.explanation, "explanation")
              }
              className={`cursor-pointer ${
                isSpeakingExplanation ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">Explanation</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
            <p>
              {steps[currentStep]?.explanation || "No explanation available"}
            </p>
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
              onClick={() =>
                conceptText && toggleSpeech(conceptText, "concept")
              }
              className={`cursor-pointer ${
                isSpeakingConcept ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">{title} Concept</span>
          </h2>
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
}
