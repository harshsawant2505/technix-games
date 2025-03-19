"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import localFont from "next/font/local"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

// Function to generate a random size between 3 and 8
//const getRandomSize = () => Math.floor(Math.random() * 6) + 3

const squid = localFont({
  src: '../../fonts/squidfont.ttf',
  variable: "--font-squid",
  display: 'swap',
})

export default function Play() {
  const [selectedShape, setSelectedShape] = useState<string>("star")
  const [code, setCode] = useState<string>("")
  const [output, setOutput] = useState<string>("")

  const workerRef = useRef<Worker | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const screenSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    if (Cookies.get("eliminated") === "true") {
      window.location.href = "/eliminated"
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    screenSizeRef.current = { width: window.screen.width, height: window.screen.height }

    const handleElimination = () => {
      Cookies.set("eliminated", "true", { expires: 1 })
      alert("You're eliminated!")
      window.location.href = "/eliminated"
    }

    const handleVisibilityChange = () => {
      if (document.hidden) handleElimination()
    }

    const handleResize = () => {
      const { width, height } = screenSizeRef.current
      if (window.innerWidth < width * 0.95 || window.innerHeight < height * 0.95) {
        handleElimination()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Function to execute the code in a Web Worker
  const runCode = () => {
    if (workerRef.current) workerRef.current.terminate()
    setOutput("Running...")

    workerRef.current = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `onmessage = function(e) {
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
          };`,
          ],
          { type: "application/javascript" },
        ),
      ),
    )

    timeoutRef.current = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.terminate()
        setOutput("Error: Execution timed out (possible infinite loop).")
      }
    }, 5000)

    workerRef.current.onmessage = (e) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setOutput(e.data)
    }

    workerRef.current.postMessage(code)
  }

  const getPatternName = () => {
    switch (selectedShape) {
      case "triangle": return "Triangle";
      case "star": return "Star";
      case "heart": return "Heart";
      case "hexagon": return "Hexagon";
      default: return "Triangle";
    }
  }

  const getPatternDescription = () => {
    switch (selectedShape) {
      case "star":
        return (
          <>
            <p className="mb-4 text-white">
              Write a function <code>generateShape</code> that displays the output given below in the console output.
            </p>
            <p className="mb-4 text-white">
              NOTE: Using AI tools, Switching of tabs, reloading, or navigating away from the page will lead to direct elimination.
            </p>
            <div className="bg-black text-white border border-[rgba(255,255,255,0.2)] p-4 rounded-md mb-4">
              <p className="font-semibold">Expected Output: </p>
              <pre className="bg-black text-white mt-3 p-2 rounded-md">
                  {"      *\n"}
                  {"     * *\n"}
                  {"    *   *\n"}
                  {"*  *  *  *  *\n"}
                  {"  *       *\n"}
                  {" *         *\n"}
                  {"*           *\n"}
              </pre>
            </div>
          </>
        );
      case "heart":
        return (
          <>
            <p className="mb-4 text-white">
              Write a function <code>generateShape</code> that displays the output given below in the console output.
            </p>
            <p className="mb-4 text-white">
              NOTE: Using AI tools, Switching of tabs, reloading, or navigating away from the page will lead to direct elimination.
            </p>
            <div className="bg-black text-white border border-[rgba(255,255,255,0.2)] p-4 rounded-md mb-4">
              <p className="font-semibold">Expected Output: </p>
              <pre className="bg-black text-white mt-3 p-2 rounded-md">
                {"  ***   ***  \n"}
                {" ***** ***** \n"}
                {"*************\n"}
                {" *********** \n"}
                {"  *********  \n"}
                {"   *******   \n"}
                {"    *****    \n"}
                {"     ***     \n"}
                {"      *      \n"}
              </pre>
            </div>
          </>
        );
      case "hexagon":
        return (
          <>
            <p className="mb-4 text-white">
              Write a function <code>generateShape</code> that displays the output given below in the console output.
            </p>
            <p className="mb-4 text-white">
              NOTE: Using AI tools, Switching of tabs, reloading, or navigating away from the page will lead to direct elimination.
            </p>
            <div className="bg-black text-white border border-[rgba(255,255,255,0.2)] p-4 rounded-md mb-4">
              <p className="font-semibold">Expected Output: </p>
              <pre className="bg-black text-white mt-3 p-2 rounded-md">
                {"    *****\n"}
                {"   *******\n"}
                {"  *********\n"}
                {" ***********\n"}
                {"*************\n"}
                {" ***********\n"}
                {"  *********\n"}
                {"   *******\n"}
                {"    *****\n"}
              </pre>
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-border bg-black px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className={`text-xl font-bold text-[#edcd8b] ${squid.className}`}>The Dalgona Challenge</h1>
          <Select value={selectedShape} onValueChange={setSelectedShape}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="star">Star</SelectItem>
              <SelectItem value="heart">Heart</SelectItem>
              <SelectItem value="hexagon">Hexagon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-2/5 border-r border-border overflow-y-auto p-4">
          <h2 className="text-xl font-bold mb-4">{getPatternName()} Pattern Generator</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            {getPatternDescription()}
          </div>
        </div>

        {/* Right Panel - Code Editor and Output */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 relative border-b border-border">
            {MonacoEditor && (
              <MonacoEditor
                height="100%"
                language="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            )}
            <Button onClick={runCode} className="absolute right-4 top-4 z-10" size="sm">
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Code
            </Button>
          </div>

          {/* Output Display */}
          <div className="h-1/2 bg-black p-4 overflow-auto">
            <div className="flex items-center mb-2 text-muted">
              <h2 className="text-sm font-medium">Console Output</h2>
            </div>
            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}