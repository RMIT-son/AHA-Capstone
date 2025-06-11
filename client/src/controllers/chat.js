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


// Best hybrid version - combines performance with reliability
export async function streamFromBackend(conversationId, content, sender, onChunk) {
  // Pre-validate to fail fast
  if (!conversationId || conversationId === 'undefined') {
    throw new Error("Conversation ID is required");
  }

  // Pre-build request body to avoid JSON.stringify overhead during fetch
  const requestBody = JSON.stringify({
    sender,
    content,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await fetch(`${app.serverURL}/api/conversations/${conversationId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body: requestBody,
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode and append to buffer
        buffer += decoder.decode(value, { stream: true });

        // Handle both single-line and multi-line SSE events
        // First try to process complete SSE events (ending with \n\n)
        let eventEndIndex;
        while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, eventEndIndex);
          buffer = buffer.slice(eventEndIndex + 2);

          // Process the complete event
          processSSEEvent(event, onChunk);
        }

        // Fallback: if no complete events but we have single lines, process them
        // This handles servers that send single-line events without \n\n
        if (!buffer.includes('\n\n') && buffer.includes('\n')) {
          const lines = buffer.split('\n');
          buffer = lines.pop() || ""; // Keep last incomplete line
          
          for (const line of lines) {
            if (line.trim().startsWith('data: ')) {
              const data = line.trim().slice(6);
              if (data === '[DONE]') return;
              onChunk?.(data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error("Streaming error:", error);
    throw error;
  }
}

// Helper method for processing complete SSE events
function processSSEEvent(event, onChunk) {
  for (const line of event.split('\n')) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('data: ')) {
      const data = trimmedLine.slice(6);
      if (data === '[DONE]') return true; // Signal completion
      onChunk?.(data);
    }
  }
  return false;
}