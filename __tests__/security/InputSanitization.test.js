import { render, screen, fireEvent } from "@testing-library/react";
import EducationPageStructure from "@/components/EducationPageStructure";

describe("Security Tests", () => {
  it("sanitizes user input in graph generation", () => {
    render(<EducationPageStructure />);

    const maliciousInput = '<script>alert("xss")</script>';
    const input = screen.getByLabelText("Number of nodes:");
    fireEvent.change(input, { target: { value: maliciousInput } });

    expect(document.body.innerHTML).not.toContain(maliciousInput);
  });

  it("prevents prototype pollution in graph state", () => {
    const maliciousState = {
      __proto__: { malicious: true },
      constructor: { prototype: { malicious: true } },
    };

    render(<EducationPageStructure graphStates={[maliciousState]} />);
    expect(Object.prototype.malicious).toBeUndefined();
  });
});
