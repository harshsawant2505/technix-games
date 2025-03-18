"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor (Client-side only)
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const initialCode = `
// Generate a triangle boundary with '*'
function generateShape() {
  let size = 5; // Change size as needed
  let shape = "";
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i || i === size - 1) {
        shape += "* ";
      } else {
        shape += "  ";
      }
    }
    shape += "\\n";
  }

  return shape;
}

generateShape();
`;

export default function Play() {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");

  // Prevent tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("You switched tabs! You're eliminated.");
        window.location.href = "/eliminated"; // Redirect to an elimination page
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const runCode = () => {
    try {
      // Create an isolated execution environment
      const sandbox = new Function(`${code}\n return generateShape();`);
      const result = sandbox();

      // Set output to be displayed as preformatted text
      setOutput(result);
    } catch (error:any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Dalgona Coding Challenge</h1>
      <div className="flex w-full max-w-4xl gap-4">
        {/* Code Editor */}
        <div className="w-1/2 border rounded-lg overflow-hidden">
          {MonacoEditor && (
            <MonacoEditor
              height="300px"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          )}
          <button onClick={runCode} className="w-full bg-blue-600 text-white p-2">
            Run Code
          </button>
        </div>

        {/* Output Display */}
        <div className="w-1/2 border rounded-lg p-4 bg-black text-green-400 font-mono">
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}
