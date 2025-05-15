import { postData } from "../api/dataApi";
import { useState } from "react";
import { ChatWindow, ChatInput } from "../components";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { id: 1, from: "bot", text: "Hello! How can I help you today?" },
    ]);

    const handleSend = async (message) => {
        const userMessage = {
            id: messages.length + 1,
            from: "user",
            text: message,
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const res = await postData({ message });

            const botMessage = {
                id: messages.length + 2,
                from: "bot",
                text: res.received.message || "No response",
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error("Error from backend:", err);
            setMessages((prev) => [
                ...prev,
                {
                    id: messages.length + 2,
                    from: "bot",
                    text: "⚠️ Sorry, backend error!",
                },
            ]);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800">
            <div className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 hidden md:block">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Chats</h2>
                <p className="text-gray-400">No chats yet.</p>
            </div>

            <div className="flex-1 flex flex-col">
                <ChatWindow messages={messages} />
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
}
