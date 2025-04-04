import React, { useState, useEffect } from "react";
import { getFinancialAdvice } from "../financeService";
import { getMarketData } from "../marketDataService";
import { getMarketAnalysis as getStockAnalysis } from '/src/services/predictionService.js';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedButton, setSelectedButton] = useState("FinAdvice");
    const [activeService, setActiveService] = useState("FinAdvice");
    

    // Initialize services
    useEffect(() => {
        const initializeServices = async () => {
            if (activeService === "FinAdvice") {
                await getFinancialAdvice("Hi");
            }
        };
        initializeServices();
    }, [activeService]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
    
        const newMessage = { sender: "user", text: inputMessage };
        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
        setIsTyping(true);
    
        try {
            let response;
            if (activeService === "FinAdvice") {
                response = await getFinancialAdvice(inputMessage);
            } else if (activeService === "Market-data") {
                response = await getMarketData(inputMessage);
            } else if (activeService === "Predicted-Stock") {
                // Always use market analysis for this option
                response = await getStockAnalysis();
            } else {
                response = { type: "info", message: "This feature is coming soon!" };
            }
    
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: response.message,
                    isHTML: response.isHTML || false
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: `Error: ${error.message}` },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleButtonClick = async (buttonName) => {
        setSelectedButton(buttonName);
        setActiveService(buttonName);
        setIsTyping(true);
      
        try {
          let response;
          const userInput = inputMessage.trim();
      
          switch(buttonName) {
            case "Predicted-Stock":
              // Always use market analysis for this button
              response = await getStockAnalysis();
              break;
      
            case "Market-data":
              response = await getMarketData(userInput || "AAPL");
              break;
      
            case "FinAdvice":
              response = await getFinancialAdvice(userInput || "Hello");
              break;
      
            default:
              response = { 
                type: "error", 
                message: "This feature is not available" 
              };
          }
      
          setMessages(prev => [
            ...prev,
            {
              sender: "bot",
              text: response.message,
              isHTML: response.isHTML,
              service: buttonName.toLowerCase().replace('-', '')
            }
          ]);
      
        } catch (error) {
          console.error('Button click error:', error);
          setMessages(prev => [
            ...prev,
            {
              sender: "bot",
              text: `❌ ${buttonName} error: ${error.message}`,
              isHTML: false,
              service: "error"
            }
          ]);
        } finally {
          setIsTyping(false);
          setInputMessage(""); // Clear input after processing
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-between">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <p className="text-gray-400 text-center">Start a conversation...</p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-xs ${msg.sender === "user"
                                        ? "bg-blue-600 text-white"
                                        : activeService === "FinAdvice"
                                            ? "bg-green-700 text-white"
                                            : activeService === "Market-data"
                                                ? "bg-purple-700 text-white"
                                                : "bg-yellow-700 text-white"
                                    }`}
                            >
                                {msg.isHTML ? (
                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isTyping && (
                    <p className="text-gray-400 text-sm">
                        {activeService === "FinAdvice"
                            ? "Finance Expert"
                            : activeService === "Market-data"
                                ? "Market Data"
                                : "Prediction Model"} is typing...
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex justify-start space-x-2 p-2">
                <button
                    onClick={() => handleButtonClick("FinAdvice")}
                    className={`px-4 py-2 rounded ${selectedButton === "FinAdvice"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                >
                    FinAdvice
                </button>
                <button
                    onClick={() => handleButtonClick("Market-data")}
                    className={`px-4 py-2 rounded ${selectedButton === "Market-data"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                >
                    Market-data
                </button>
                <button
                    onClick={() => handleButtonClick("Predicted-Stock")}
                    className={`px-4 py-2 rounded ${selectedButton === "Predicted-Stock"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                >
                    Predicted-Stock
                </button>
            </div>

            {/* Input Bar */}
            <div className="w-full p-4 bg-gray-900 flex items-center">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                    placeholder={
                        activeService === "FinAdvice"
                            ? "Ask financial advice..."
                            : activeService === "Market-data"
                                ? "Ask about stock prices..."
                                : "Enter stock symbol (e.g., AAPL)..."
                    }
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 bg-gray-700 p-2 rounded text-white"
                >
                    📨
                </button>
            </div>

            {/* Add CSS for prediction output */}
            <style>
                {`
          .prediction-result table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
          }
          .prediction-result th, 
          .prediction-result td {
            padding: 6px 10px;
            border: 1px solid rgba(255,255,255,0.2);
            text-align: left;
          }
          .prediction-result th {
            background-color: rgba(255,255,255,0.1);
          }
          .prediction-header {
            margin-bottom: 8px;
            font-weight: bold;
          }
          .prediction-note {
            font-size: 0.8em;
            opacity: 0.8;
            margin-top: 8px;
          }
        `}
            </style>
        </div>
    );
};

export default Chat;