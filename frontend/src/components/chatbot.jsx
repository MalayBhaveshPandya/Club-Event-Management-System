import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageSend = async () => {
    if (inputMessage.trim() === "") return;
    setIsLoading(true);
    const newMessages = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/chat",
        { messages: newMessages },
        { headers: { "Content-Type": "application/json" } }
      );
      let assistantText = "";

      if (response.data.content) {
        if (typeof response.data.content === "string") {
          assistantText = response.data.content;
        } else if (
          response.data.content.parts &&
          Array.isArray(response.data.content.parts)
        ) {
          assistantText = response.data.content.parts
            .map((p) => p.text)
            .join(" ");
        } else {
          assistantText = "Sorry, no response text available.";
        }
      } else {
        assistantText = "Sorry, no response content.";
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: assistantText },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error in the server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleMessageSend();
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-2 py-10">
      <div className="bg-white rounded-[20px] shadow-lg max-w-xl w-full flex flex-col h-[70vh]">
        <div
          className="flex-1 overflow-y-auto p-6"
          id="chat-container"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message, index) =>
            message.content !== undefined ? (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-indigo-100 text-indigo-900"
                      : "bg-gray-100 text-gray-800"
                  } rounded-[16px] px-4 py-2 max-w-[75%]`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
              </div>
            ) : (
              <div key={index} className="mb-4 flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-[16px] px-4 py-2 max-w-[75%]">
                  Error in the server
                </div>
              </div>
            )
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="animate-pulse w-8 h-4 bg-indigo-200 rounded"></div>
            </div>
          )}
        </div>
        <div className="border-t bg-blue-100 flex items-center gap-2 px-6 py-3 rounded-b-[20px]">
          <input
            className="flex-1 px-4 py-2 bg-white border border-blue-300 rounded-[10px] focus:outline-indigo-400"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={handleMessageSend}
            disabled={inputMessage.trim() === "" || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-[10px] font-semibold transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
