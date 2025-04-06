import { ChatMessage } from "./MessageRenderer";
import MessageBubble from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

const MessageList = ({ messages, isLoading, error }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom when messages change or when loading state changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="h-full overflow-auto py-4">
            <div className="w-full max-w-2xl mx-auto">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}

                {isLoading && (
                    <div className="flex mb-4">
                        <div className="text-white max-w-[80%] flex items-center space-x-2">
                            <span className="text-gray-400">Thinking</span>
                            <span className="flex space-x-1">
                                <span className="animate-pulse">.</span>
                                <span className="animate-pulse animation-delay-200">
                                    .
                                </span>
                                <span className="animate-pulse animation-delay-400">
                                    .
                                </span>
                            </span>
                        </div>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive" className="mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;
