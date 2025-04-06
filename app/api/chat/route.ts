import { NextRequest, NextResponse } from "next/server";

// Define the expected structure for incoming chat messages (adjust if needed)
interface ChatMessage {
    role: string;
    content: string;
    // Add other fields if your Python backend expects them
    [key: string]: any;
}

// Define the expected structure for the request body
interface InvokeRequest {
    messages: ChatMessage[];
    integrations?: string[];
}

// Define the expected structure for the response from the Python backend
interface InvokeResponse {
    messages: ChatMessage[];
}

// Assume the Python backend is running on localhost:8000
// You might want to move this to environment variables for flexibility
const PYTHON_BACKEND_URL =
    process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000/invoke";

export async function POST(request: NextRequest) {
    try {
        const body: InvokeRequest = await request.json();
        const { messages, integrations } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                {
                    error: 'Invalid request format: "messages" array is required.',
                },
                { status: 400 }
            );
        }

        // console.log(`[API Route] Forwarding ${messages.length} messages to: ${PYTHON_BACKEND_URL}`);

        const response = await fetch(PYTHON_BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json", // Ensure we expect JSON back
            },
            body: JSON.stringify({ messages, integrations }), // Include integrations in the request
        });

        // Check if the backend response is successful
        if (!response.ok) {
            const errorBody = await response.text(); // Read error body as text first
            // console.error(`[API Route] Error from Python backend (${response.status}): ${errorBody}`);
            // Try to parse as JSON, but handle cases where it might not be
            let errorDetail = errorBody;
            try {
                const errorJson = JSON.parse(errorBody);
                errorDetail = errorJson.detail || JSON.stringify(errorJson);
            } catch (parseError) {
                // Keep the raw text if JSON parsing fails
            }
            return NextResponse.json(
                {
                    error: `Backend Error: ${response.statusText}`,
                    detail: errorDetail,
                },
                { status: response.status }
            );
        }

        // Parse the JSON response from the Python backend
        const responseData: InvokeResponse = await response.json();

        // console.log(`[API Route] Received ${responseData.messages.length} messages from backend.`);

        // Return the backend's response to the frontend
        return NextResponse.json(responseData);
    } catch (error) {
        console.error("[API Route] Internal Server Error:", error);
        let errorMessage = "Internal Server Error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json(
            { error: "Failed to process chat request.", detail: errorMessage },
            { status: 500 }
        );
    }
}
