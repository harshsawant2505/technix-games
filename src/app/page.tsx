"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, Clock, CheckCircle2, Info } from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

// Function to generate a random size between 3 and 8
const getRandomSize = () => Math.floor(Math.random() * 6) + 3

const generateTriangleCode = () => {
  const size = getRandomSize()
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
`
}

export default function Play() {
  const [code, setCode] = useState<string>(generateTriangleCode())
  const [output, setOutput] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("description")

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

    const newCode = generateTriangleCode() // Generate a new random size each run
    setCode(newCode)

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

    workerRef.current.postMessage(newCode)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-foreground">Triangle Pattern Generator</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">Easy</span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" /> 5 min
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> 85% Success
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Hint
          </Button>
          <Button variant="outline" size="sm">
            Solution
          </Button>
          <Button variant="outline" size="sm">
            Submissions
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-2/5 border-r border-border overflow-y-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Triangle Pattern Generator</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="mb-4">
                      Write a function <code>generateShape</code> that takes an integer <code>size</code> as input and
                      returns a string representing a triangle pattern.
                    </p>
                    <p className="mb-4">
                      The triangle should have <code>size</code> rows, and each row should have stars (*) at the
                      boundary positions only.
                    </p>
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="font-bold mb-2">Example:</h3>
                      <p>
                        Input: <code>size = 5</code>
                      </p>
                      <pre className="bg-background p-2 rounded-md">
                        * {"\n"}* * {"\n"}* * * {"\n"}* * * *{"\n"}* * * * * {"\n"}
                      </pre>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                      <Info className="w-5 h-5 mr-2 text-yellow-600" />
                      <p className="text-sm">
                        Each time you run the code, a new random size between 3 and 8 will be generated.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="solution" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Solution Approach</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="mb-4">To solve this problem, we need to:</p>
                    <ol className="list-decimal pl-5 mb-4">
                      <li>Create a nested loop where the outer loop iterates through each row</li>
                      <li>The inner loop iterates through each column in the current row</li>
                      <li>
                        Print a star (*) only at boundary positions: first column, last column of each row, or the last
                        row
                      </li>
                      <li>Otherwise, print spaces</li>
                    </ol>
                    <p>The time complexity is O(n²) where n is the size of the triangle.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
          <div className="h-1/3 bg-black p-4 overflow-auto">
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

