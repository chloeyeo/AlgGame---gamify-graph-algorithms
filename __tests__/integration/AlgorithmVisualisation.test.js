import { render, screen, fireEvent } from "@testing-library/react";
import AlgorithmVisualisation from "@/components/AlgorithmVisualisation";

describe("Algorithm Visualisation Integration", () => {
  it("integrates with graph visualization and controls", async () => {
    render(<AlgorithmVisualisation />);

    // Test graph generation
    const generateButton = screen.getByText("Generate New Graph");
    fireEvent.click(generateButton);

    // Test algorithm execution
    const runButton = screen.getByText("Run DFS");
    fireEvent.click(runButton);

    // Verify visualization updates
    await screen.findByTestId("graph-visualization");
    expect(screen.getByTestId("graph-visualization")).toBeInTheDocument();
  });

  it("integrates with explanation and pseudocode highlighting", async () => {
    render(<AlgorithmVisualisation />);

    // Start algorithm
    fireEvent.click(screen.getByText("Run DFS"));

    // Verify synchronized updates
    await screen.findByTestId("highlighted-code");
    expect(screen.getByTestId("explanation-text")).toHaveTextContent(
      /current step/i
    );
  });
});
