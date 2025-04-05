import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { LiveProvider, LiveError, LivePreview } from "react-live";

interface ContentItem {
    type: string;
    text: string;
    annotations: any[] | null;
}

export interface ChatMessage {
    role?: string;
    content?: string | ContentItem[];
    type?: string;
    call_id?: string;
    name?: string;
    arguments?: string;
    output?: string;
    status?: string;
    id?: string;
    [key: string]: any;
}

const MessageRenderer = ({ message }: { message: ChatMessage }): ReactNode => {
    // Regular text message from user
    if (typeof message.content === "string") {
        // Check if content might be a React component
        if (message.content.includes("<") && message.content.includes("/>")) {
            return (
                <LiveProvider code={message.content} noInline={false}>
                    <LiveError />
                    <LivePreview />
                </LiveProvider>
            );
        }
        return <ReactMarkdown>{message.content}</ReactMarkdown>;
    } else if (
        Array.isArray(message.content) &&
        message.content.length > 0 &&
        typeof message.content[0].text === "string"
    ) {
        if (
            message.content[0].text.includes("<") &&
            message.content[0].text.includes("/>")
        ) {
            return (
                <LiveProvider code={message.content[0].text} noInline={false}>
                    <LiveError />
                    <LivePreview />
                </LiveProvider>
            );
        }
        return <ReactMarkdown>{message.content![0].text}</ReactMarkdown>;
    } else {
        return <div>{""}</div>;
    }
};

export default MessageRenderer;
