import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, chatRooms = [], onSelectRoom, activeRoomId }) => {
    const navigate = useNavigate();

    return (
        <div
            className={`transition-all duration-300 ease-in-out ${
                isOpen ? "w-72" : "w-0"
            } bg-[#0E0E10] text-white flex flex-col relative overflow-hidden`}
        >
            <div
                className={`absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none ${
                    !isOpen && "hidden"
                }`}
            />

            {/* Fixed Top Section - New Chat Button */}
            <div className={`flex-shrink-0 p-6 pb-0 z-10 ${!isOpen && "hidden"}`}>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 justify-end w-full py-2 px-3 hover:bg-gray-700 rounded-md text-base font-light"
                >
                    <span>New Chat</span>
                    <span className="w-5 h-5 bg-gray-600 rounded-sm flex items-center justify-center text-xs">
                        +
                    </span>
                </button>
            </div>

            {/* Scrollable Middle Section - Chat Rooms */}
            <div 
                className={`flex-1 min-h-0 overflow-y-auto px-6 py-4 ${!isOpen && "hidden"}`}
                style={{
                    scrollbarWidth: 'thin', /* Firefox - make it thin */
                    scrollbarColor: 'white transparent' /* Firefox - white thumb, transparent track */
                }}
            >
                <style jsx="true">{`
                    div::-webkit-scrollbar {
                        width: 6px; /* Make scrollbar thinner */
                    }
                    div::-webkit-scrollbar-track {
                        background: transparent; /* No background */
                    }
                    div::-webkit-scrollbar-thumb {
                        background-color: white; /* White scrollbar */
                        border-radius: 3px; /* Rounded corners */
                    }
                    div::-webkit-scrollbar-thumb:hover {
                        background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent on hover */
                    }
                    div::-webkit-scrollbar-button {
                        display: none; /* Remove arrow buttons */
                    }
                `}</style>
                <div className="z-10">
                    {/* Recent Chats section */}
                    {chatRooms.length > 0 && (
                        <div className="w-full border-t border-gray-600 pt-4">
                            <h3 className="text-sm text-gray-400 mb-2 uppercase text-right">
                                Recent Chats
                            </h3>
                            <div className="space-y-1">
                                {chatRooms.map((room) => (
                                    <button
                                        key={room.id}
                                        onClick={() =>
                                            onSelectRoom && onSelectRoom(room.id)
                                        }
                                        className={`w-full text-right py-2 px-3 text-sm rounded-md truncate transition-colors ${
                                            activeRoomId === room.id
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-700"
                                        }`}
                                        title={room.name || `Chat ${room.id.slice(-5)}`}
                                    >
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {room.name || `Chat ${room.id.slice(-5)}`}
                                            </div>
                                            {room.lastMessageSnippet && (
                                                <div className="text-xs text-gray-400 truncate mt-0.5">
                                                    {room.lastMessageSnippet}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Empty state when no chat rooms */}
                    {chatRooms.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-8">
                            <p>No chat history yet</p>
                            <p className="text-xs mt-1">Start a new conversation!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Bottom Section - User Profile */}
            <div className={`flex-shrink-0 p-6 pt-0 z-10 ${!isOpen && "hidden"}`}>
                <div className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white rounded-xl p-3 flex flex-col text-sm w-full transition-colors">
                    <span className="text-gray-300 text-right">Welcome back,</span>
                    <span className="font-semibold text-right">Username</span>
                    <div className="text-right text-gray-400 mt-1 text-xs flex items-center justify-end">
                        Account Settings ⌄
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;