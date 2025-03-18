"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Eliminated() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "harsh123"; // Change this as needed

  useEffect(() => {
    // Prevent back navigation to the game
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      Cookies.remove("eliminated");
      router.push("/");
    } else {
      alert("Incorrect password! Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center relative">
      {/* Red "ELIMINATED" text with glowing effect */}
      <h1 className="text-6xl font-extrabold text-red-600 animate-pulse">ELIMINATED</h1>

      {/* Subtext */}
      <p className="text-lg text-gray-400 mt-4">
        You have been eliminated from the challenge. Better luck next time!
      </p>

      {/* Enter Password Button */}
      <button
        onClick={() => setShowDialog(true)}
        className="mt-6 bg-gray-700 hover:bg-gray-900 text-white px-6 py-2 rounded-lg text-lg transition-all"
      >
        Enter Password
      </button>

      {/* Floating Password Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Enter Password</h2>
            <input
              type="password"
              className="w-full p-2  rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handlePasswordSubmit}
                className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-all"
              >
                Submit
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dramatic effect - flickering red light */}
      {/* <div className="absolute z-0 inset-0 bg-red-900 opacity-10 animate-flicker"></div> */}

      {/* Tailwind animation keyframes */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        .animate-flicker {
          animation: flicker 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
