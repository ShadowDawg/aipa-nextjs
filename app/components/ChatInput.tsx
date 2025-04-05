import { useState, FormEvent } from "react";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";

interface ChatInputProps {
    isLoading: boolean;
    onSubmit: (message: string) => void;
}

const ChatInput = ({ isLoading, onSubmit }: ChatInputProps) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        onSubmit(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.closest("form");
            if (form) form.requestSubmit();
        }
    };

    return (
        <div className="py-4 border-t border-gray-800">
            <div className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative border border-gray-700 rounded-md overflow-hidden flex flex-col">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent px-4 py-4 h-32 resize-none focus:outline-none"
                            placeholder="Type a message..."
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-2 right-4 flex space-x-4">
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <FaMicrophone size={20} />
                            </button>
                            <button
                                type="submit"
                                className={`text-white bg-green-600 hover:bg-green-700 rounded-full p-3 transition-colors ${
                                    isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                disabled={isLoading}
                            >
                                <FaArrowUp size={16} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;
