const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendMessageToBackend(message) {
    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error("Failed to get response from backend");
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Backend error:", error);
        return null;
    }
}
