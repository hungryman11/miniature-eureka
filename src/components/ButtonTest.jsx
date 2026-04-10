import { useState } from "react";

export default function ButtonTest() {
  const [clicks, setClicks] = useState(0);
  const [text, setText] = useState("");

  const handleClick = () => {
    console.log("Button clicked! Clicks:", clicks + 1);
    setClicks(clicks + 1);
  };

  const isValid = text.trim().length > 0;

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Button Test</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <label>
          Type something:
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            style={{
              display: "block",
              padding: "10px",
              marginTop: "10px",
              fontSize: "16px",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Valid:</strong> {isValid ? "YES ✓" : "NO ✗"}
        </p>
        <p>
          <strong>Clicks:</strong> {clicks}
        </p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className={isValid ? "btn-active" : "btn-inactive"}
        style={{
          padding: "16px 32px",
          fontSize: "16px",
          backgroundColor: isValid ? "#0d0d0d" : "#ccc",
          color: isValid ? "#fff" : "#666",
          border: "none",
          borderRadius: "8px",
          cursor: isValid ? "pointer" : "not-allowed",
          opacity: isValid ? 1 : 0.5,
          minHeight: "48px",
          minWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        Click Me! ({clicks} clicks)
      </button>

      <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
        <p>
          <strong>Debug Info:</strong>
        </p>
        <p>Is valid: {String(isValid)}</p>
        <p>Text value: "{text}"</p>
        <p>Text length: {text.length}</p>
      </div>
    </div>
  );
}
