import { ChatMessage } from "./MessageRenderer";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
}

const MessageList = ({ messages, isLoading, error }: MessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto py-4">
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
                    <div className="mb-2 p-3 rounded-lg bg-red-900 text-red-200 text-left">
                        <span className="font-semibold">Error: </span>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageList;
