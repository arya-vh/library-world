import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chatbot.css";
import { IoMdSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { RiRobot2Fill } from "react-icons/ri";
import { FcReadingEbook } from "react-icons/fc";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const chatWindowRef = useRef(null);
    const [firstOpen, setFirstOpen] = useState(true); // Track first open

    useEffect(() => {
        if (isOpen) {
            chatWindowRef.current?.scrollIntoView({ behavior: "smooth" });
            
            // Show greeting message only on the first open
            if (firstOpen) {
                setMessages([{ sender: "bot", text: "Hello! I am Library World Chatbot. Ask me anything about the library. How can I assist you today?" }]);
                setFirstOpen(false);
            }
        }
    }, [isOpen]);

    // Handle clicks outside the chatbot
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/v1/ai-chatbot", { message: input });
            const botMessage = { sender: "bot", text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMessage = { sender: "bot", text: "⚠️ Error: Unable to get response." };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }

        setLoading(false);
    };

    return (
        <div className="chatbot-wrapper">
            {!isOpen && (
                <button className="chatbot-button" onClick={() => setIsOpen(true)}>
                    <RiRobot2Fill size={20} />
                    Message Us
                </button>
            )}

            {isOpen && (
                <div className="chatbot-container" ref={chatWindowRef}>
                    <div className="chatbot-header">
                        <span><FcReadingEbook size={20} /> Library World</span>
                        <IoClose className="close-btn" size={20} onClick={() => setIsOpen(false)} />
                    </div>

                    <div className="chat-window">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <span>{msg.text}</span>
                            </div>
                        ))}
                        {loading && <div className="message bot">Typing...</div>}
                        <div ref={chatWindowRef}></div>
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>
                            <IoMdSend size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
