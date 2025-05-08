export default function ChatWindow({ messages }) {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-md ${
                        msg.from === "user"
                            ? "bg-blue-500 text-white ml-auto"
                            : "bg-gray-200 text-gray-800 mr-auto"
                    }`}
                >
                    {msg.text}
                </div>
            ))}
        </div>
    );
}
