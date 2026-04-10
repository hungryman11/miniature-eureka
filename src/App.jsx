import { useState } from "react";
import Intake from "./components/Intake";
import Results from "./components/Results";
import "./index.css";

export default function App() {
  const [stage, setStage] = useState("intake");
  const [userData, setUserData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (answers) => {
    setUserData(answers);
    setStage("loading");
    setError(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setOpportunities(data.opportunities);
      setStage("results");
    } catch (err) {
      setError(err.message);
      setStage("intake");
    }
  };

  const handleReset = () => {
    setStage("intake");
    setUserData(null);
    setOpportunities([]);
    setError(null);
  };

  return (
    <div className="app">
      {stage === "intake" && (
        <Intake onSubmit={handleSubmit} error={error} />
      )}
      {stage === "loading" && (
        <LoadingScreen userData={userData} />
      )}
      {stage === "results" && (
        <Results
          opportunities={opportunities}
          userData={userData}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

function LoadingScreen({ userData }) {
  const messages = [
    "Reading between the lines of your dream...",
    "Scanning fellowships across 6 continents...",
    "Matching your drive to what's out there...",
    "Finding opportunities most people never see...",
    "Almost there — curating your top 100 opportunities...",
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setMsgIndex(m => (m + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-orb" />
      <div className="loading-name">{userData?.name || "Friend"}</div>
      <div className="loading-msg">{messages[msgIndex]}</div>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
