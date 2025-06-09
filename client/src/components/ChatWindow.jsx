import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, isBotTyping }) {
    const messagesEndRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const previousMessagesLength = useRef(0);
    const isNewConversation = useRef(true);

    // Instantly position at bottom (no scroll motion)
    const positionAtBottomInstant = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    };

    // Smooth scroll to bottom for new messages
    const scrollToBottomSmooth = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const messagesIncreased = messages.length > previousMessagesLength.current;
        
        if (isNewConversation.current && messages.length > 0) {
            // New conversation or conversation switch - instantly position at bottom
            positionAtBottomInstant();
            isNewConversation.current = false;
        } else if (isBotTyping || messagesIncreased) {
            // New messages or bot typing - smooth scroll
            scrollToBottomSmooth();
        }
        
        // Update previous message count
        previousMessagesLength.current = messages.length;
    }, [messages, isBotTyping]);

    // Reset conversation state when messages are completely replaced (conversation switch)
    useEffect(() => {
        // If messages array changed dramatically (conversation switch), mark as new conversation
        if (messages.length === 0 || (previousMessagesLength.current > 0 && messages.length !== previousMessagesLength.current + 1)) {
            isNewConversation.current = true;
        }
    }, [messages]);

    return (
        <div 
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
        >
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Start a conversation...</p>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={message.tempId || message.id || index}
                        className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : message.isError
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            <p className="text-sm">{message.content}</p>
                            {message.timestamp && (
                                <p className="text-xs mt-1 opacity-70">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </div>
                ))
            )}
            
            {isBotTyping && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
        </div>
    );
}