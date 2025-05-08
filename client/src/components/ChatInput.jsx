import { useState } from "react";

export default function ChatInput({ onSend }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSend(message);
        setMessage("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 border-t bg-white flex space-x-2"
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded px-4 py-2"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Send
            </button>
        </form>
    );
}
