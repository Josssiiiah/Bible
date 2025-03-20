import { useState, useRef, useEffect } from "react";
import { useChat, Message } from "../hooks/useChat";
import { WeatherCard } from "./WeatherCard";
import { CalendarEventCard } from "./CalendarEventCard";

export function ChatInterface() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Bible Chat Assistant</h2>
        <p className="text-gray-600">
          Ask questions about the Bible or discuss biblical topics
        </p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-lg bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Start a conversation by typing a message below.
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-pulse">Thinking...</div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:text-white disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearMessages}
            className="text-gray-500 px-3 hover:text-red-500 transition-colors"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Check for tool calls
  const hasWeatherToolCall =
    message.toolCall?.toolName === "weatherTool" && message.toolCall?.toolData;

  // Check for calendar tool calls
  const hasCalendarToolCall =
    message.toolCall?.toolName &&
    [
      "listCalendarsTool",
      "listEventsTool",
      "createEventTool",
      "updateEventTool",
      "deleteEventTool",
    ].includes(message.toolCall.toolName) &&
    message.toolCall?.toolData;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? "bg-primary text-black border rounded-tr-none"
            : "bg-white border rounded-tl-none"
        }`}
      >
        {/* If we have a weather tool call, show the WeatherCard */}
        {hasWeatherToolCall && message.toolCall && (
          <div className="mb-3">
            <WeatherCard weatherData={message.toolCall.toolData} />
          </div>
        )}

        {/* If we have a calendar tool call, show the CalendarEventCard */}
        {hasCalendarToolCall &&
          message.toolCall &&
          message.toolCall.toolName === "listEventsTool" && (
            <div className="mb-3">
              <CalendarEventCard
                events={message.toolCall.toolData}
                title="Calendar Events"
              />
            </div>
          )}

        <div className="text-sm">
          {message.content.split("\n").map((line, i) => (
            <p key={i}>{line || <br />}</p>
          ))}
        </div>
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          <h2 className="text-xs text-gray-600">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h2>
        </div>
      </div>
    </div>
  );
}
