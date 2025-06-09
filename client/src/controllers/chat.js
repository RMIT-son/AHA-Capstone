import axios from "axios";
import { app } from "../config/keys";

export const createConversation = async (user_id = "anonymous") => {
  try {
    console.log("Creating conversation for user:", user_id);
    const res = await axios.post(`${app.serverURL}/api/conversations/`, {
      user_id,
    });
    console.log("Created conversation:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to create conversation", error);
    throw error;
  }
};

// Send a message to a specific conversation
export const sendMessageToConversation = async (
  conversationId,
  sender,
  content
) => {
  // Add validation and debugging
  if (!conversationId || conversationId === "undefined") {
    console.error("Invalid conversationId:", conversationId);
    throw new Error("Conversation ID is required and cannot be undefined");
  }

  console.log("Sending message:", { conversationId, sender, content });

  try {
    const res = await axios.post(
      `${app.serverURL}/api/conversations/${conversationId}/message`,
      {
        sender,
        content,
      }
    );
    console.log("Message sent successfully:", res.data);
    return res.data; // Updated conversation
  } catch (error) {
    console.error("Failed to send message", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const getAllConversations = async () => {
  try {
    const res = await axios.get(`${app.serverURL}/api/conversations/`);
    console.log("Loaded conversations:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to load conversations", error);
    return [];
  }
};

export const getConversationById = async (conversationId) => {
  if (!conversationId || conversationId === "undefined") {
    console.error(
      "Invalid conversationId for getConversationById:",
      conversationId
    );
    return null;
  }

  try {
    const res = await axios.get(
      `${app.serverURL}/api/conversations/${conversationId}`
    );
    console.log("Loaded conversation:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to get conversation", error);
    return null;
  }
};

export async function streamFromBackend(conversationId, content, sender, onChunk) {
  console.log("Starting stream for conversation:", conversationId, "content:", content);

  // Validate inputs
  if (!conversationId || conversationId === 'undefined') {
    throw new Error("Conversation ID is required");
  }

  try {
    const response = await fetch(`${app.serverURL}/api/conversations/${conversationId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        sender: sender,
        content: content,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok || !response.body) {
      console.error("Failed to connect to the backend");
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("Stream completed");
        break;
      }

      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete messages
      const lines = buffer.split("\n\n");
      
      // Keep the last incomplete part in buffer
      buffer = lines.pop() || "";

      // Process each complete line
      for (const line of lines) {
        if (line.trim() && line.startsWith("data: ")) {
          const data = line.slice("data: ".length);
          
          if (data === "[DONE]") {
            console.log("Stream finished");
            return;
          }
          
          console.log("📦 Received chunk:", data);
          
          // Call the callback with the chunk
          if (onChunk) {
            onChunk(data);
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Streaming error:", error);
    throw error;
  }
}