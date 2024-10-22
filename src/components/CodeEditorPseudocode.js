import React from "react";

const CodeEditorPseudocode = ({ pseudocode }) => {
  // Split pseudocode into lines and add line numbers
  const lines = pseudocode.split("\n");

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="text-zinc-400 font-mono text-sm">Pseudocode</div>
        </div>
      </div>

      {/* Code content */}
      <div className="bg-zinc-950 p-4 font-mono text-sm overflow-x-auto">
        <table className="w-full">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-zinc-900">
                <td className="text-zinc-600 pr-4 text-right select-none w-12">
                  {index + 1}
                </td>
                <td className="text-zinc-100 whitespace-pre">{line || " "}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CodeEditorPseudocode;
