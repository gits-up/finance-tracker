import React, { useState, useRef, useEffect } from "react";
import { sendMessageToGemini } from "../gemini";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const aiResponse = await sendMessageToGemini(input);
      const aiMessage = { role: "ai", content: aiResponse };

      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setInput("");
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 AI Financial Assistant</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#007bff" : "#333",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about investing..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#1a1a1a",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    width: "400px",
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #555",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#2a2a2a",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "8px",
    maxWidth: "80%",
    color: "#fff",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    width: "300px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#333",
    color: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Chat;
