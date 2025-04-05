import MessageRenderer, { ChatMessage } from "./MessageRenderer";

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
    if (message.role === "user") {
        return (
            <div className="flex justify-end mb-4">
                <div className="bg-white text-black rounded-3xl px-5 py-3 max-w-[80%]">
                    <MessageRenderer message={message} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex mb-4">
            <div className="text-white max-w-[80%]">
                <MessageRenderer message={message} />
            </div>
        </div>
    );
};

export default MessageBubble;
