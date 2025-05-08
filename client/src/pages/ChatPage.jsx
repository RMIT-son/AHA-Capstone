import { useState } from "react";
import { ChatWindow, ChatInput } from "../components";

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { id: 1, from: "bot", text: "Hello! How can I help you today?" },
    ]);

    const handleSend = (message) => {
        const newMessage = {
            id: messages.length + 1,
            from: "user",
            text: message,
        };

        setMessages([...messages, newMessage]);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    from: "bot",
                    text: "Received: " + message,
                },
            ]);
        }, 500);
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 hidden md:block">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Chats</h2>
                <p className="text-gray-400">No chats yet.</p>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
                <ChatWindow messages={messages} />
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
}
