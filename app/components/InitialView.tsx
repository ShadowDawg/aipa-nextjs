import { FormEvent, useState } from "react";
import {
    FaArrowUp,
    FaUser,
    FaEnvelope,
    FaFileAlt,
    FaBrain,
    FaSlack,
    FaWhatsapp,
} from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import { SiNotion } from "react-icons/si";

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
                    Hi there, <span className="text-purple-500">John</span>
                </h1>
                <h2 className="text-5xl font-semibold mb-6">
                    What{" "}
                    <span className="text-purple-500">would like to know?</span>
                </h2>
                <p className="text-gray-400 mb-6">
                    Use one of the most common prompts below or use your own to
                    begin
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div
                        className="flex flex-col items-center p-4 bg-gray-800 bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60"
                        onClick={() =>
                            handlePromptClick(
                                "Create a filter in Gmail to organize my promotional emails into a separate folder"
                            )
                        }
                    >
                        <FaEnvelope className="text-red-500 mb-3" size={24} />
                        <div className="text-sm text-center">
                            Create a filter in Gmail to organize my promotional
                            emails
                        </div>
                    </div>
                    <div
                        className="flex flex-col items-center p-4 bg-gray-800 bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60"
                        onClick={() =>
                            handlePromptClick(
                                "Set up a Notion database to track my daily tasks and projects"
                            )
                        }
                    >
                        <SiNotion className="text-white mb-3" size={24} />
                        <div className="text-sm text-center">
                            Set up a Notion database to track my daily tasks and
                            projects
                        </div>
                    </div>
                    <div
                        className="flex flex-col items-center p-4 bg-gray-800 bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60"
                        onClick={() =>
                            handlePromptClick(
                                "Create an automated Slack reminder for my team's weekly meetings"
                            )
                        }
                    >
                        <FaSlack className="mb-3" size={24} />
                        <div className="text-sm text-center">
                            Create an automated Slack reminder for my team's
                            weekly meetings
                        </div>
                    </div>
                    <div
                        className="flex flex-col items-center p-4 bg-gray-800 bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60"
                        onClick={() =>
                            handlePromptClick(
                                "Set up automatic responses for common WhatsApp business inquiries"
                            )
                        }
                    >
                        <FaWhatsapp className="text-green-500 mb-3" size={24} />
                        <div className="text-sm text-center">
                            Set up automatic responses for common WhatsApp
                            business inquiries
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <button className="flex items-center text-gray-400 hover:text-white">
                        <IoRefresh className="mr-2" size={18} />
                        Refresh Prompts
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative border border-gray-700 rounded-xl overflow-hidden">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent px-4 py-4 h-24 resize-none focus:outline-none"
                            placeholder="Ask whatever you want...."
                            disabled={isLoading}
                        />
                        <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                            <div className="text-gray-400 mr-4">0/1000</div>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <AiOutlinePlus size={20} />
                                <span className="sr-only">Add Attachment</span>
                            </button>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-white transition-colors"
                                disabled={isLoading}
                            >
                                <LuImagePlus size={20} />
                                <span className="sr-only">Use Image</span>
                            </button>
                            <button
                                type="submit"
                                className={`text-white bg-purple-600 hover:bg-purple-700 rounded-lg p-2 transition-colors ${
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

export default InitialView;
