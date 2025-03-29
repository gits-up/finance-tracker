import { useState } from "react";
import axios from "axios";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await axios.post("http://localhost:5000/chat", { message: input });
            setMessages(response.data.chatHistory);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role === "user" ? "user-message" : "ai-message"}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && <div className="typing-indicator">AI is typing...</div>}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about finance..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
