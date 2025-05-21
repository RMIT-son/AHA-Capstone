from fastapi import APIRouter
from pydantic import BaseModel
from controllers.chat_controller import get_llm_response

router = APIRouter()

class MessageInput(BaseModel):
    message: str

@router.post("/chat")
async def chat_handler(payload: MessageInput):
    result = await get_llm_response(payload.message)
    return {"message": result}



