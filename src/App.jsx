import { useState } from "react";
import "./index.css";

export default function App() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: "20px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>MOBILE BUTTON TEST</h1>
      
      <input
        type="text"
        value={text}
        onChange={(e) => {
          console.log("Input change:", e.target.value);
          setText(e.target.value);
        }}
        placeholder="Type something..."
        style={{
          padding: "12px",
          fontSize: "16px",
          marginBottom: "20px",
          width: "200px",
          border: "2px solid #ccc",
        }}
        autoFocus
      />

      <p><strong>Text entered:</strong> "{text}"</p>
      <p><strong>Text length:</strong> {text.length}</p>

      <button
        onClick={() => {
          console.log("Button clicked!");
          if (text.trim()) {
            alert("Success! Text: " + text);
          }
        }}
        disabled={text.trim().length === 0}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          backgroundColor: text.trim() ? "#000" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: text.trim() ? "pointer" : "not-allowed",
          minHeight: "50px",
          minWidth: "200px",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        {text.trim() ? "✓ CLICK ME" : "Type first"}
      </button>
    </div>
  );
}

