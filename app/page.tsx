"use client"; // This component needs to be a client component

import { useState, FormEvent } from "react";
import { ChatMessage } from "./components/MessageRenderer";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import InitialView from "./components/InitialView";

export default function Home() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: "user", content: input };
        const updatedMessages = [...messages, newUserMessage];

        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: updatedMessages,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.detail || `Error: ${response.statusText}`
                );
            }

            const data = await response.json();
            // The backend returns the full message list including the assistant's reply
            setMessages(data.messages);
        } catch (err) {
            console.error("Failed to send message:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleMessageSubmit = (message: string) => {
        const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
        }) as unknown as FormEvent<HTMLFormElement>;

        setInput(message);
        handleSubmit(submitEvent);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.closest("form");
            if (form) form.requestSubmit();
        }
    };

    const handlePromptClick = (promptText: string) => {
        setInput(promptText);
        const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
        }) as unknown as FormEvent<HTMLFormElement>;
        handleSubmit(submitEvent);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white px-4">
            {messages.length === 0 ? (
                // Initial state - centered search with heading
                <InitialView
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    handleKeyDown={handleKeyDown}
                    isLoading={isLoading}
                    handlePromptClick={handlePromptClick}
                />
            ) : (
                // Chat interface - messages at top, input at bottom
                <>
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        error={error}
                    />
                    <ChatInput
                        isLoading={isLoading}
                        onSubmit={handleMessageSubmit}
                    />
                </>
            )}
        </div>
    );
}
