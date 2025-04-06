import { useState, FormEvent } from "react";
import { ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type IntegrationType = "Notion" | "Gmail" | "Slack" | "Calendar" | "Whatsapp";

interface ChatInputProps {
    isLoading: boolean;
    onSubmit: (message: string, integrations: IntegrationType[]) => void;
}

const ChatInput = ({ isLoading, onSubmit }: ChatInputProps) => {
    const [input, setInput] = useState("");
    const allIntegrations: IntegrationType[] = [
        "Notion",
        "Gmail",
        "Slack",
        "Calendar",
        "Whatsapp",
    ];
    const [selectedIntegrations, setSelectedIntegrations] = useState<
        IntegrationType[]
    >([...allIntegrations]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        onSubmit(input, selectedIntegrations);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const form = e.currentTarget.closest("form");
            if (form) form.requestSubmit();
        }
    };

    const addIntegration = (integration: IntegrationType) => {
        setSelectedIntegrations((prev) => [...prev, integration]);
    };

    const removeIntegration = (integration: IntegrationType) => {
        setSelectedIntegrations((prev) =>
            prev.filter((item) => item !== integration)
        );
    };

    // Get available integrations for dropdown
    const availableIntegrations = allIntegrations.filter(
        (integration) => !selectedIntegrations.includes(integration)
    );

    return (
        <div className="py-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="mb-2 flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className="bg-black border border-gray-700"
                        >
                            {availableIntegrations.length > 0 ? (
                                availableIntegrations.map((integration) => (
                                    <DropdownMenuItem
                                        key={integration}
                                        onClick={() =>
                                            addIntegration(integration)
                                        }
                                        className="text-sm text-gray-300 hover:text-gray-300 focus:text-gray-300 focus:bg-black-900 hover:bg-black-900 cursor-pointer flex items-center"
                                    >
                                        <img
                                            src={`/${integration.toLowerCase()}-logo.png`}
                                            alt={`${integration} logo`}
                                            className={`h-4 w-4 mr-2 ${
                                                integration === "Notion"
                                                    ? "filter invert brightness-200"
                                                    : ""
                                            }`}
                                        />
                                        {integration}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem
                                    disabled
                                    className="text-sm text-gray-500"
                                >
                                    No more integrations
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* <span className="text-gray-400 ml-2 text-sm">
                        Your connections
                    </span> */}

                    {selectedIntegrations.length > 0 && (
                        <div className="flex gap-2 ml-2">
                            {selectedIntegrations.map((integration) => (
                                <div
                                    key={integration}
                                    className="group relative px-3 py-1 text-sm bg-black border border-gray-700 rounded-md text-gray-300 flex items-center"
                                >
                                    <img
                                        src={`/${integration.toLowerCase()}-logo.png`}
                                        alt={`${integration} logo`}
                                        className={`h-4 w-4 mr-2 ${
                                            integration === "Notion"
                                                ? "filter invert brightness-200"
                                                : ""
                                        }`}
                                    />
                                    {integration}
                                    <button
                                        onClick={() =>
                                            removeIntegration(integration)
                                        }
                                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative border border-gray-700 rounded-md overflow-hidden">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="min-h-32 resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Type a message..."
                        />
                        <div className="absolute bottom-3 right-3 flex items-center justify-center">
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading}
                                className={`bg-[#ff3131] hover:bg-[#ff3131] rounded-full ${
                                    isLoading ? "opacity-50" : ""
                                }`}
                            >
                                <ArrowUp className="h-4 w-4 text-black" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;
