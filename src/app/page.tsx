"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// Function to generate a random size between 3 and 8
const getRandomSize = () => Math.floor(Math.random() * 6) + 3;

const generateTriangleCode = () => {
  const size = getRandomSize();
  return `
// Generate a triangle boundary
function generateShape(size) {
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
console.log(generateShape(${size}));
`;
};

export default function Play() {
  const [code, setCode] = useState<string>(generateTriangleCode());
  const [output, setOutput] = useState<string>("");

  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const screenSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    if (Cookies.get("eliminated") === "true") {
      window.location.href = "/eliminated";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    screenSizeRef.current = { width: window.screen.width, height: window.screen.height };

    const handleElimination = () => {
      Cookies.set("eliminated", "true", { expires: 1 });
      alert("You're eliminated!");
      window.location.href = "/eliminated";
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleElimination();
    };

    const handleResize = () => {
      const { width, height } = screenSizeRef.current;
      if (window.innerWidth < width * 0.95 || window.innerHeight < height * 0.95) {
        handleElimination();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to execute the code in a Web Worker
  const runCode = () => {
    if (workerRef.current) workerRef.current.terminate();
    setOutput("Running...");

    const newCode = generateTriangleCode(); // Generate a new random size each run
    setCode(newCode);

    workerRef.current = new Worker(
      URL.createObjectURL(
        new Blob(
          [`onmessage = function(e) {
            let finished = false;
            let timeout = setTimeout(() => {
              if (!finished) postMessage("Error: Execution timed out (possible infinite loop).");
            }, 5000);
            
            try {
              let consoleOutput = [];
              const customConsole = {
                log: (...args) => consoleOutput.push(args.join(" ")),
              };
              
              const func = new Function("console", e.data);
              func(customConsole);
              
              finished = true;
              clearTimeout(timeout);
              postMessage(consoleOutput.join("\\n"));
            } catch (error) {
              postMessage("Error: " + error.message);
            }
          };`],
          { type: "application/javascript" }
        )
      )
    );

    timeoutRef.current = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.terminate();
        setOutput("Error: Execution timed out (possible infinite loop).");
      }
    }, 5000);

    workerRef.current.onmessage = (e) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setOutput(e.data);
    };

    workerRef.current.postMessage(newCode);
  };

  return (
    <div className="flex h-screen">
      {/* Left - Code Editor */}
      <div className="w-1/2 h-full border-r border-gray-700">
        {MonacoEditor && (
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
          />
        )}
        <button onClick={runCode} className=" absolute right-4 rounded-sm top-4 bg-blue-600 text-white p-3 text-lg">
          Run Code
        </button>
      </div>

      {/* Right - Output Display */}
      <div className="w-1/2 h-full bg-black text-green-400 p-6 overflow-auto">
        <h2 className="text-lg font-bold mb-2">Output:</h2>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
