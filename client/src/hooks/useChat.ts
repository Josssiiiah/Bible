import { useState } from "react";

// Define types for our chat messages
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  toolCall?: {
    toolName: string;
    toolData: any;
  };
}

interface UseChatOptions {
  initialMessages?: Message[];
}

export function useChat({ initialMessages = [] }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to add a user message to the chat
  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    return userMessage;
  };

  // Function to add an assistant message to the chat
  const addAssistantMessage = (
    content: string,
    toolCall?: { toolName: string; toolData: any }
  ) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "assistant",
      timestamp: new Date(),
      toolCall,
    };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    return assistantMessage;
  };

  // Function to send a message to the Mastra API
  const sendMessage = async (content: string) => {
    // Add the user message to the chat
    addUserMessage(content);

    setIsLoading(true);
    setError(null);

    try {
      // Format all messages for the API
      const apiMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message to API messages
      apiMessages.push({
        role: "user",
        content: content,
      });

      // Call the Mastra API
      const response = await fetch("/api/agents/bibleAgent/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Check if the response includes tool call info
      let toolCall = undefined;

      // Parse the response to detect tool calls from the steps array
      if (
        data.steps &&
        data.steps.length > 0 &&
        data.steps[0].toolResults &&
        data.steps[0].toolResults.length > 0
      ) {
        const latestToolResult =
          data.steps[0].toolResults[data.steps[0].toolResults.length - 1];

        // Extract tool name and result
        const toolName = latestToolResult.toolName;
        const toolData = latestToolResult.result;

        toolCall = {
          toolName,
          toolData,
        };
      }

      // Also check for toolResults at the root level (from our middleware)
      if (!toolCall && data.toolResults && data.toolResults.length > 0) {
        const latestToolResult = data.toolResults[data.toolResults.length - 1];
        toolCall = {
          toolName: latestToolResult.toolName,
          toolData: latestToolResult.result,
        };
      }

      addAssistantMessage(data.text, toolCall);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
