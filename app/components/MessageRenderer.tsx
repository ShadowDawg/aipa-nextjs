import { ReactNode, useState } from "react";
import ReactMarkdown from "react-markdown";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Mail,
    Send,
    BookOpen,
    ExternalLink,
    Clock,
} from "lucide-react";
import Image from "next/image";

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

interface EmailSummary {
    summary: string;
    subject: string;
    from_email: string;
}

interface DraftMail {
    to: string[];
    subject: string;
    body: string;
}

interface SlackDraft {
    message: string;
    channel: string;
}

interface CalendarEvent {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    meeting_link?: string;
}

interface ParsedResponse {
    response_type: string;
    email_summaries?: EmailSummary[];
    draft_mail_for_approval?: DraftMail;
    draft?: SlackDraft;
    notion_response?: string;
    create_event?: CalendarEvent;
    event_summary?: CalendarEvent[];
    whatsapp_response?: string;
    other?: any;
    [key: string]: any;
}

// Common avatar wrapper component
const AvatarWrapper = ({
    children,
    avatarSrc,
    altText,
    imageClassName = "",
}: {
    children: React.ReactNode;
    avatarSrc: string;
    altText: string;
    imageClassName?: string;
}) => {
    return (
        <div className="w-full">
            <div className="relative">
                <div className="absolute -bottom-3 -left-12 w-11 h-11 rounded-full overflow-hidden border-2 border-black shadow-md z-10 bg-black flex items-center justify-center">
                    <Image
                        src={avatarSrc}
                        alt={altText}
                        width={36}
                        height={36}
                        className={`object-contain ${imageClassName}`}
                    />
                </div>
                {children}
            </div>
        </div>
    );
};

const EmailSummaryRenderer = ({
    emailSummaries,
}: {
    emailSummaries: EmailSummary[];
}) => {
    return (
        <AvatarWrapper avatarSrc="/gmail-logo.png" altText="Gmail Logo">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Email Summary</CardTitle>
                    <Mail className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                    {emailSummaries.map((email, index) => (
                        <div key={index} className="py-3">
                            {index > 0 && <Separator className="my-2" />}
                            <p className="font-bold text-gray-800">
                                {email.subject}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                From: {email.from_email}
                            </p>
                            <p className="mt-2 text-gray-700 leading-relaxed">
                                {email.summary}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AvatarWrapper>
    );
};

const SlackDraftRenderer = ({ draft }: { draft: SlackDraft }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    // Access the global send message function
    const sendMessage = (message: string) => {
        // Get the chat input form element
        const chatForm = document.querySelector("form");
        const chatInput = chatForm?.querySelector("textarea");
        const submitButton = chatForm?.querySelector(
            "button[type='submit']"
        ) as HTMLButtonElement;

        if (chatInput && chatForm && submitButton) {
            // Set the message in the input
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value"
            )?.set;

            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(chatInput, message);
                chatInput.dispatchEvent(new Event("input", { bubbles: true }));

                // Click the submit button directly
                submitButton.click();
            }
        }
    };

    const handleSend = () => {
        setIsDisabled(true);
        sendMessage(`Send.`);
    };

    return (
        <AvatarWrapper avatarSrc="/slack-logo.png" altText="Slack Logo">
            <Card className="w-full max-w-3xl mx-auto border-l-4 border-l-[#4A154B]">
                <CardHeader className="flex flex-row items-center justify-between py-2 px-4 md:px-6 bg-[#4A154B]/5">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-[#4A154B]">
                            #{draft.channel}
                        </span>
                        <div className="mx-2 h-1 w-1 bg-gray-300 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                            Draft Message
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="py-3 px-4 md:px-6">
                    <p className="text-gray-800 whitespace-pre-wrap">
                        {draft.message}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end py-2 px-4 md:px-6 bg-gray-50">
                    <Button
                        onClick={handleSend}
                        disabled={isDisabled}
                        size="sm"
                        className="bg-[#4A154B] hover:bg-[#4A154B]/90"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                    </Button>
                </CardFooter>
            </Card>
        </AvatarWrapper>
    );
};

const DraftMailRenderer = ({ draftMail }: { draftMail: DraftMail }) => {
    // Convert HTML <br> tags to newlines for textarea display
    const convertHtmlToPlainText = (html: string) => {
        return html.replace(/<br\s*\/?>/gi, "\n");
    };

    const [subject, setSubject] = useState(draftMail.subject);
    const [body, setBody] = useState(convertHtmlToPlainText(draftMail.body));
    const [isDisabled, setIsDisabled] = useState(false);

    // Convert newlines back to <br> tags when sending
    const prepareBodyForSending = () => {
        return body.replace(/\n/g, "<br>");
    };

    // Access the global send message function
    const sendMessage = (message: string) => {
        // Get the chat input form element
        const chatForm = document.querySelector("form");
        const chatInput = chatForm?.querySelector("textarea");
        const submitButton = chatForm?.querySelector(
            "button[type='submit']"
        ) as HTMLButtonElement;

        if (chatInput && chatForm && submitButton) {
            // Set the message in the input
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value"
            )?.set;

            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(chatInput, message);
                chatInput.dispatchEvent(new Event("input", { bubbles: true }));

                // Click the submit button directly
                submitButton.click();
            }
        }
    };

    const handleSend = () => {
        setIsDisabled(true);
        const formattedBody = prepareBodyForSending();
        sendMessage(`Send it.`);
    };

    const handleCancel = () => {
        setIsDisabled(true);
        sendMessage("Cancel the email draft");
    };

    return (
        <AvatarWrapper avatarSrc="/gmail-logo.png" altText="Gmail Logo">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Draft Email</CardTitle>
                    <Mail className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                            To: {draftMail.to.join(", ")}
                        </p>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    disabled={isDisabled}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body">Body</Label>
                                <Textarea
                                    id="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={6}
                                    disabled={isDisabled}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isDisabled}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={isDisabled}>
                        Send
                    </Button>
                </CardFooter>
            </Card>
        </AvatarWrapper>
    );
};

const NotionResponseRenderer = ({
    notionResponse,
    linkToDocument,
}: {
    notionResponse: string;
    linkToDocument?: string;
}) => {
    // Extract URL if present in the markdown
    const urlMatch = notionResponse.match(/\[.*?\]\((.*?)\)/);
    const notionUrl = urlMatch ? urlMatch[1] : linkToDocument || null;

    return (
        <AvatarWrapper
            avatarSrc="/notion-logo.png"
            altText="Notion Logo"
            imageClassName="invert brightness-100"
        >
            <Card className="w-full max-w-4xl mx-auto border-l-4 border-l-[#E6E6E4]">
                <CardHeader className="flex flex-row items-center justify-between py-2 px-4 md:px-6 bg-[#F7F6F3]">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-[#37352F]">
                            Notion
                        </span>
                    </div>
                    <BookOpen className="h-5 w-5 text-[#37352F]" />
                </CardHeader>
                <CardContent className="py-3 px-4 md:px-6 bg-[#FEFEFE]">
                    <div className="notion-content text-[#37352F]">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1
                                        className="text-xl font-bold my-3"
                                        {...props}
                                    />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2
                                        className="text-lg font-bold my-2"
                                        {...props}
                                    />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3
                                        className="text-md font-bold my-2"
                                        {...props}
                                    />
                                ),
                                h4: ({ node, ...props }) => (
                                    <h4 className="font-bold my-2" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                    <p className="my-2" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul
                                        className="list-disc pl-6 my-2"
                                        {...props}
                                    />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol
                                        className="list-decimal pl-6 my-2"
                                        {...props}
                                    />
                                ),
                                li: ({ node, ...props }) => (
                                    <li className="my-1" {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                    <a
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    />
                                ),
                            }}
                        >
                            {notionResponse}
                        </ReactMarkdown>
                    </div>
                </CardContent>
                {notionUrl && (
                    <CardFooter className="flex justify-end py-2 px-4 md:px-6 bg-[#F7F6F3]">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-[#37352F] border-[#E6E6E4] hover:bg-[#EFEFEF]"
                            onClick={() => window.open(notionUrl, "_blank")}
                        >
                            Open in Notion
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </AvatarWrapper>
    );
};

const WhatsAppRenderer = ({ message }: { message: string }) => {
    return (
        <AvatarWrapper avatarSrc="/whatsapp-logo.png" altText="WhatsApp Logo">
            <Card className="w-full max-w-4xl mx-auto border-l-4 border-l-[#25D366]">
                {/* <CardHeader className="flex flex-row items-center justify-between py-2 px-4 md:px-6 bg-[#25D366]/5">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-[#075E54]">
                            WhatsApp
                        </span>
                    </div>
                </CardHeader> */}
                <CardContent className="px-4 md:px-6">
                    <p className="text-gray-800 whitespace-pre-wrap">
                        {message}
                    </p>
                </CardContent>
            </Card>
        </AvatarWrapper>
    );
};

const CalendarEventRenderer = ({ event }: { event: CalendarEvent }) => {
    // Format dates for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatTimeOnly = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    const startFormatted = formatDate(event.start_date);
    const endFormatted = isSameDay
        ? formatTimeOnly(event.end_date)
        : formatDate(event.end_date);

    const timeDisplay = isSameDay
        ? `${startFormatted} - ${endFormatted}`
        : `${startFormatted} - ${endFormatted}`;

    const openCalendarEvent = () => {
        if (event.meeting_link) {
            window.open(event.meeting_link, "_blank");
        }
    };

    return (
        <AvatarWrapper
            avatarSrc="/calendar-logo.png"
            altText="Google Calendar Logo"
        >
            <Card className="w-full max-w-4xl mx-auto border-l-4 border-l-[#4285F4]">
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 md:px-6 bg-[#4285F4]/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#4285F4]" />
                        <span>Calendar Event</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-4 md:px-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {event.title}
                    </h3>

                    <div className="flex items-start gap-2 mb-3 text-gray-700">
                        <Clock className="h-5 w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                        <span>{timeDisplay}</span>
                    </div>

                    {event.description && (
                        <div className="mt-4 border-t border-gray-100 pt-3">
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>
                    )}
                </CardContent>
                {event.meeting_link && (
                    <CardFooter className="flex justify-end gap-2 py-3 px-4 md:px-6 bg-gray-50">
                        <Button
                            onClick={openCalendarEvent}
                            className="bg-[#4285F4] hover:bg-[#3367D6]"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in Calendar
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </AvatarWrapper>
    );
};

const CalendarEventSummaryRenderer = ({
    events,
}: {
    events: CalendarEvent[];
}) => {
    // Format dates for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatTimeOnly = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getTimeDisplay = (
        startDate: Date,
        endDate: Date,
        startFormatted: string,
        endFormatted: string
    ) => {
        const isSameDay = startDate.toDateString() === endDate.toDateString();
        return isSameDay
            ? `${startFormatted} - ${formatTimeOnly(endDate.toISOString())}`
            : `${startFormatted} - ${endFormatted}`;
    };

    return (
        <AvatarWrapper
            avatarSrc="/calendar-logo.png"
            altText="Google Calendar Logo"
        >
            <Card className="w-full max-w-4xl mx-auto border-l-4 border-l-[#4285F4]">
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 md:px-6 bg-[#4285F4]/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#4285F4]" />
                        <span>Upcoming Events</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-4 md:px-6">
                    {events.map((event, index) => {
                        const startDate = new Date(event.start_date);
                        const endDate = new Date(event.end_date);
                        const startFormatted = formatDate(event.start_date);
                        const endFormatted = formatDate(event.end_date);
                        const timeDisplay = getTimeDisplay(
                            startDate,
                            endDate,
                            startFormatted,
                            endFormatted
                        );

                        return (
                            <div
                                key={index}
                                className={
                                    index > 0
                                        ? "mt-6 pt-6 border-t border-gray-200"
                                        : ""
                                }
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    {event.title}
                                </h3>

                                <div className="flex items-start gap-2 mb-3 text-gray-700">
                                    <Clock className="h-5 w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                                    <span>{timeDisplay}</span>
                                </div>

                                {event.description && (
                                    <div className="mt-4 border-t border-gray-100 pt-3">
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {event.description}
                                        </p>
                                    </div>
                                )}

                                {event.meeting_link && (
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            onClick={() =>
                                                window.open(
                                                    event.meeting_link,
                                                    "_blank"
                                                )
                                            }
                                            className="bg-[#4285F4] hover:bg-[#3367D6]"
                                            size="sm"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Open in Calendar
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </AvatarWrapper>
    );
};

const OtherResponseRenderer = ({ text }: { text: string }) => {
    return (
        <Card className="bg-black border-0">
            <CardContent className="text-white">{text}</CardContent>
        </Card>
    );
};

const ResponseRenderer = ({
    parsedResponse,
}: {
    parsedResponse: ParsedResponse;
}) => {
    switch (parsedResponse.response_type) {
        case "email_summary":
            return parsedResponse.email_summaries ? (
                <EmailSummaryRenderer
                    emailSummaries={parsedResponse.email_summaries}
                />
            ) : (
                <div>Invalid email summary data</div>
            );
        case "draft_mail_for_approval":
            return parsedResponse.draft_mail_for_approval ? (
                <DraftMailRenderer
                    draftMail={parsedResponse.draft_mail_for_approval}
                />
            ) : (
                <div>Invalid draft mail data</div>
            );
        case "draft_message_approval":
            return parsedResponse.draft ? (
                <SlackDraftRenderer draft={parsedResponse.draft} />
            ) : (
                <div>Invalid draft message data</div>
            );
        case "notion_response":
            return parsedResponse.notion_response ? (
                <NotionResponseRenderer
                    notionResponse={parsedResponse.notion_response}
                />
            ) : (
                <div>Invalid Notion response data</div>
            );
        case "create_event":
            return parsedResponse.create_event ? (
                <CalendarEventRenderer event={parsedResponse.create_event} />
            ) : (
                <div>Invalid calendar event data</div>
            );
        case "event_summary":
            return parsedResponse.event_summary ? (
                <CalendarEventSummaryRenderer
                    events={parsedResponse.event_summary}
                />
            ) : (
                <div>Invalid event summary data</div>
            );
        case "whatsapp_response":
            return parsedResponse.whatsapp_response ? (
                <WhatsAppRenderer message={parsedResponse.whatsapp_response} />
            ) : (
                <div>Invalid WhatsApp response data</div>
            );
        case "other":
            return parsedResponse.other ? (
                <OtherResponseRenderer text={parsedResponse.other} />
            ) : (
                <div>Invalid other response data</div>
            );
        default:
            return (
                <div>Unknown response type: {parsedResponse.response_type}</div>
            );
    }
};

const tryParseJSON = (text: string): any | null => {
    try {
        return JSON.parse(text);
    } catch (e) {
        return null;
    }
};

const MessageRenderer = ({ message }: { message: ChatMessage }): ReactNode => {
    // Check if this is an assistant message with JSON content
    if (
        message.role === "assistant" &&
        message.status === "completed" &&
        Array.isArray(message.content) &&
        message.content.length > 0 &&
        message.content[0].type === "output_text"
    ) {
        const parsedData = tryParseJSON(message.content[0].text);
        if (parsedData && parsedData.response_type) {
            return <ResponseRenderer parsedResponse={parsedData} />;
        }
    }

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
        // Check if the content might be JSON from a Notion response
        const parsedData = tryParseJSON(message.content[0].text);
        if (
            parsedData &&
            parsedData.response_type === "notion_response" &&
            parsedData.notion_response
        ) {
            return <ResponseRenderer parsedResponse={parsedData} />;
        }

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
