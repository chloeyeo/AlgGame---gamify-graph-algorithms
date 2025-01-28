import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EducationPageStructure from "@/components/EducationPageStructure";

// Mock data for testing
const mockProps = {
  title: "Test Algorithm",
  graphStates: [
    [
      {
        graphState: {
          nodes: [{ id: "A" }, { id: "B" }],
          edges: [{ source: "A", target: "B", weight: 1 }],
          currentNode: null,
        },
        explanation: "Test explanation",
      },
    ],
  ],
  conceptText: {
    introduction: "Test introduction",
    keyCharacteristics: ["Key 1", "Key 2"],
    applications: ["App 1", "App 2"],
  },
  pseudocode: "function test() {\n  return true;\n}",
  GraphVisualisationComponent: ({ graphState }) => (
    <div data-testid="mock-graph">{JSON.stringify(graphState)}</div>
  ),
};

describe("EducationPageStructure", () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  it("renders the title correctly", () => {
    render(<EducationPageStructure {...mockProps} />);
    expect(screen.getByText("Test Algorithm")).toBeInTheDocument();
  });

  it("renders the concept text sections", () => {
    render(<EducationPageStructure {...mockProps} />);
    expect(screen.getByText("Test introduction")).toBeInTheDocument();
    expect(screen.getByText("Key 1")).toBeInTheDocument();
    expect(screen.getByText("App 1")).toBeInTheDocument();
  });

  it("renders the pseudocode section", () => {
    render(<EducationPageStructure {...mockProps} />);
    expect(screen.getByText(/function test/)).toBeInTheDocument();
  });

  it("renders the graph visualization component", () => {
    render(<EducationPageStructure {...mockProps} />);
    expect(screen.getByTestId("mock-graph")).toBeInTheDocument();
  });

  it("handles step navigation correctly", () => {
    const multiStepMockProps = {
      ...mockProps,
      graphStates: [
        [
          {
            graphState: { nodes: [{ id: "A" }], edges: [], currentNode: null },
            explanation: "Step 1",
          },
          {
            graphState: { nodes: [{ id: "B" }], edges: [], currentNode: null },
            explanation: "Step 2",
          },
        ],
      ],
    };

    render(<EducationPageStructure {...multiStepMockProps} />);

    // Check initial state
    expect(screen.getByText("Step 1")).toBeInTheDocument();

    // Navigate to next step
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // Check updated state
    expect(screen.getByText("Step 2")).toBeInTheDocument();
  });

  it("displays error state when required props are missing", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // @ts-ignore - intentionally missing required props
    render(<EducationPageStructure title="Test" />);

    expect(screen.getByText(/Error/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("handles example switching correctly", () => {
    const multiExampleProps = {
      ...mockProps,
      graphStates: [
        [{ graphState: { nodes: [], edges: [] }, explanation: "Example 1" }],
        [{ graphState: { nodes: [], edges: [] }, explanation: "Example 2" }],
      ],
    };

    render(<EducationPageStructure {...multiExampleProps} />);

    // Check initial example
    expect(screen.getByText("Example 1")).toBeInTheDocument();

    // Switch to second example
    const exampleButton = screen.getByRole("button", { name: /example 2/i });
    fireEvent.click(exampleButton);

    // Check updated example
    expect(screen.getByText("Example 2")).toBeInTheDocument();
  });
});
