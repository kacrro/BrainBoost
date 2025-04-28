import React, { useState, useRef, useEffect } from "react";

export const GameArea: React.FC = () => {
  const [status, setStatus] = useState<"waiting" | "ready" | "now">("waiting");
  const [message, setMessage] = useState("Click to start the reaction test");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startTest = () => {
    setStatus("ready");
    setMessage("Wait for green...");
    setReactionTime(null);

    const delay = Math.floor(Math.random() * 3000) + 2000;

    timeoutRef.current = setTimeout(() => {
      setStatus("now");
      setMessage("CLICK!");
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (status === "waiting") {
      startTest();
    } else if (status === "ready") {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      setStatus("waiting");
      setMessage("Too soon! Click to try again.");
    } else if (status === "now") {
      const endTime = Date.now();
      if (startTime !== null) {
        const time = endTime - startTime;
        setReactionTime(time);
        setMessage(`Your reaction time is ${time} ms. Click to try again.`);
      }
      setStatus("waiting");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-6 font-bold">🧠 Reaction Time Tester</h1>
      <div
        onClick={handleClick}
        className={`w-80 h-40 rounded-lg flex items-center justify-center text-xl font-semibold cursor-pointer transition-all duration-200 ${
          status === "waiting"
            ? "bg-blue-600"
            : status === "ready"
            ? "bg-red-600"
            : "bg-green-600"
        }`}
      >
        {message}
      </div>
      {reactionTime !== null && (
        <p className="mt-6 text-lg">⏱️ You clicked in {reactionTime} ms</p>
      )}
    </div>
  );
};
