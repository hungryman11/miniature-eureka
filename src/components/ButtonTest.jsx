import { useState } from "react";

export default function ButtonTest() {
  const [clicks, setClicks] = useState(0);
  const [text, setText] = useState("");

  const handleClick = () => {
    console.log("Button clicked! Clicks:", clicks + 1);
    setClicks(clicks + 1);
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    console.log("Input changed to:", newText, "Trimmed length:", newText.trim().length);
    setText(newText);
  };

  const isValid = text && text.trim().length > 0;
  console.log("Rendering - isValid:", isValid, "text:", text, "length:", text.length);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Button Test</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <label>
          Type something:
          <input
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Enter text..."
            style={{
              display: "block",
              padding: "10px",
              marginTop: "10px",
              fontSize: "16px",
              width: "100%",
              boxSizing: "border-box",
              border: "2px solid #ccc",
              borderRadius: "4px",
            }}
            autoFocus
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
        <p><strong>Valid:</strong> {String(isValid)} (should be true after typing)</p>
        <p><strong>Clicks:</strong> {clicks}</p>
        <p><strong>Text length:</strong> {text.length}</p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        style={{
          padding: "16px 32px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: isValid ? "#0d0d0d" : "#999",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: isValid ? "pointer" : "not-allowed",
          width: "100%",
          minHeight: "48px",
          transition: "background-color 0.2s",
        }}
      >
        {isValid ? "✓ ACTIVE - Click Me!" : "✗ INACTIVE - Type first"}
      </button>

      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px", fontSize: "14px" }}>
        <p><strong>Open Console (F12) to see logs</strong></p>
        <p>Check that:</p>
        <ul>
          <li>Input change logs appear when you type</li>
          <li>isValid becomes true</li>
          <li>Button click logs appear when you tap</li>
        </ul>
      </div>
    </div>
  );
}
