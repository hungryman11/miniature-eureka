import { useState } from "react";

const FIRST_QUESTION = {
  id: "name",
  number: "00",
  label: "First, what's your name?",
  hint: "We'll personalize everything for you.",
  type: "text",
  placeholder: "Your full name",
};

export default function IntakeTest() {
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const q = FIRST_QUESTION;
  const value = answers[q.id];

  const isValid = () => {
    console.log("isValid() called - value:", value, "trimmed length:", value ? String(value).trim().length : 0);
    if (!value) return false;
    return String(value).trim().length > 0;
  };

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    console.log("Input changed to:", newVal);
    setAnswers(p => {
      const updated = { ...p, [q.id]: newVal };
      console.log("Answers updated:", updated);
      return updated;
    });
  };

  const handleNext = () => {
    console.log("Next button clicked. isValid:", isValid());
    if (isValid()) {
      console.log("Valid! Moving forward. Current answers:", answers);
      setCurrent(c => c + 1);
    } else {
      console.log("Not valid, staying on this question");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Intake Test - First Question Only</h1>

      <div style={{ marginBottom: "30px" }}>
        <div style={{ fontSize: "12px", color: "#999", marginBottom: "10px" }}>Q{q.number}</div>
        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>{q.label}</div>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>{q.hint}</div>

        <input
          type="text"
          value={value || ""}
          onChange={handleInputChange}
          placeholder={q.placeholder}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: "16px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
            marginBottom: "20px",
          }}
          autoFocus
        />
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "4px", fontSize: "14px" }}>
        <p><strong>Current value:</strong> "{value}"</p>
        <p><strong>Value type:</strong> {typeof value}</p>
        <p><strong>Value length:</strong> {value ? value.length : 0}</p>
        <p><strong>isValid():</strong> {String(isValid())}</p>
      </div>

      <button
        type="button"
        onClick={handleNext}
        style={{
          width: "100%",
          padding: "16px 32px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: isValid() ? "#0d0d0d" : "#999",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: isValid() ? "pointer" : "not-allowed",
          minHeight: "48px",
          transition: "background-color 0.2s",
        }}
      >
        {isValid() ? "Continue →" : "Type your name to continue"}
      </button>

      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px", fontSize: "13px" }}>
        <p><strong>Debug Instructions:</strong></p>
        <ol>
          <li>Open browser console (F12 or right-click → Inspect → Console)</li>
          <li>Type your name in the input field above</li>
          <li>Watch the console logs - you should see:
            <ul>
              <li>"Input changed to: [name]"</li>
              <li>"Answers updated: ..."</li>
              <li>"isValid() called" and then true/false</li>
            </ul>
          </li>
          <li>The button should turn black when valid</li>
          <li>Tap the button - you should see "Next button clicked" in console</li>
        </ol>
      </div>
    </div>
  );
}
