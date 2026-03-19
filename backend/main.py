from __future__ import annotations

from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class HistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: list[HistoryItem] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str


class HealthResponse(BaseModel):
    status: str


app = FastAPI(title="webIterm API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    history_count = len(payload.history)
    message = payload.message.strip() or "<empty>"

    reply = "\n".join(
        [
            "mock://assistant boot complete",
            "cwd: ~/workspace/webIterm",
            "history: " + str(history_count) + " messages",
            "",
            "input> " + message,
            "",
            "This is a mock response from the FastAPI backend.",
            "Connect a real AI provider inside backend/main.py when ready.",
        ]
    )

    return ChatResponse(reply=reply)
