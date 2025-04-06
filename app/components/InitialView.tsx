import { FormEvent } from "react";
import { FaUser, FaFileAlt, FaBrain, FaWhatsapp } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { colors } from "@/lib/styles/colors";

interface InitialViewProps {
    input: string;
    setInput: (value: string) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean;
    handlePromptClick: (promptText: string) => void;
}

const InitialView = ({
    input,
    setInput,
    handleSubmit,
    handleKeyDown,
    isLoading,
    handlePromptClick,
}: InitialViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-2xl">
                <h1 className="text-5xl font-semibold mb-2">
                    Hi there, <span className="text-[#ff3131]">Dev</span>
                </h1>
                <h2 className="text-5xl font-semibold mb-6">
                    What{" "}
                    <span className="text-[#ff3131]">
                        would you like to do?
                    </span>
                </h2>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <Card
                        style={{ backgroundColor: colors.blackLight }}
                        className="bg-vivid-500 hover:bg-gray-600 cursor-pointer border-0"
                        onClick={() =>
                            handlePromptClick("Summarise my last 3 emails.")
                        }
                    >
                        <CardContent className="flex flex-col items-center justify-center p-3 h-24">
                            <div className="relative w-6 h-6 mb-2">
                                <Image
                                    src="/gmail-logo.png"
                                    alt="Gmail"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-xs text-center text-white">
                                Summarise my emails from today.
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        style={{ backgroundColor: colors.blackLight }}
                        className="hover:bg-gray-600 cursor-pointer border-0"
                        onClick={() =>
                            handlePromptClick(
                                "Set up a Notion database to track my daily tasks and projects"
                            )
                        }
                    >
                        <CardContent className="flex flex-col items-center justify-center p-3 h-24">
                            <div className="relative w-6 h-6 mb-2">
                                <Image
                                    src="/notion-logo.png"
                                    alt="Notion"
                                    fill
                                    className="object-contain brightness-0 invert"
                                />
                            </div>
                            <div className="text-xs text-center text-white">
                                Set up a Notion database
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        style={{ backgroundColor: colors.blackLight }}
                        className="hover:bg-gray-600 cursor-pointer border-0"
                        onClick={() =>
                            handlePromptClick("Send a banger joke on #general")
                        }
                    >
                        <CardContent className="flex flex-col items-center justify-center p-3 h-24">
                            <div className="relative w-6 h-6 mb-2">
                                <Image
                                    src="/slack-logo.png"
                                    alt="Slack"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-xs text-center text-white">
                                Send a banger joke on #general
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        style={{ backgroundColor: colors.blackLight }}
                        className="hover:bg-gray-600 cursor-pointer border-0"
                        onClick={() => handlePromptClick("Schedule a meeting")}
                    >
                        <CardContent className="flex flex-col items-center justify-center p-3 h-24">
                            <div className="relative w-6 h-6 mb-2">
                                <Image
                                    src="/calendar-logo.png"
                                    alt="Calendar"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-xs text-center text-white">
                                Schedule a meeting
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative border border-gray-700 rounded-xl overflow-hidden">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent px-4 py-4 h-32 text-base md:text-lg lg:text-xl resize-none focus:outline-none focus-visible:ring-0 border-0"
                            placeholder="Ask away"
                        />
                        <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                            <Button
                                type="submit"
                                className="bg-[#ff3131] hover:bg-[#ff3131] rounded-lg p-2"
                                disabled={isLoading}
                                size="icon"
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

export default InitialView;
