import os
import httpx
from dotenv import load_dotenv

load_dotenv()

RAG_AI_URL = os.getenv("RAG_AI_URL")

async def get_llm_response(message: str) -> str:
    if not RAG_AI_URL:
        return "RAG_AI_URL not configured."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(RAG_AI_URL, json={"query": message})
            response.raise_for_status()
            data = response.json()
            return data.get("response", "No response received.")
    except Exception as e:
        return f"Error connecting to LLM: {str(e)}"

