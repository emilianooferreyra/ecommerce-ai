import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request: Request) {
  try {
    console.log("🔵 [Chat API] Request received");

    const { messages }: { messages: UIMessage[] } = await request.json();
    console.log("📨 [Chat API] Messages count:", messages.length);
    console.log("📝 [Chat API] Messages:", JSON.stringify(messages, null, 2));

    // Get the user's session - userId will be null if not authenticated
    const { userId } = await auth();
    console.log("👤 [Chat API] User ID:", userId || "anonymous");

    // Verify API key
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ [Chat API] GROQ_API_KEY missing!");
      throw new Error("API key not configured");
    }
    console.log("✅ [Chat API] Groq API key found");

    // Create agent with user context (orders tool only available if authenticated)
    const agent = createShoppingAgent({ userId });
    console.log("🤖 [Chat API] Agent created");

    console.log("🚀 [Chat API] Starting stream response...");
    const response = await createAgentUIStreamResponse({
      agent,
      uiMessages: messages,
    });

    console.log("✅ [Chat API] Stream response created successfully");
    return response;
  } catch (error) {
    console.error("❌ [Chat API] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
