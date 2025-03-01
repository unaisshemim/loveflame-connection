import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, Heart } from "lucide-react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Corrected import path

interface Message {
  id: string; // Changed to string to match Firestore IDs
  text: string;
  sender: string;
  timestamp: string; // Changed to string for rendering
  isAI?: boolean; // Added to distinguish AI messages
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser?.displayName || "John"; // Fallback for now

  // Gemini AI API Key
  const GEMINI_API_KEY = "AIzaSyDgmmAkMsVSL1Qd5u9xFACmVKxq4aUVcRY";

  // Function to send a message to Gemini AI
  const sendToGeminiAI = async (message: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Add AI response to Firestore
      await addDoc(collection(db, "messages"), {
        text: aiResponse,
        sender: "Gemini AI",
        timestamp: Timestamp.now(),
        isAI: true,
      });
    } catch (error) {
      console.error("Error sending message to Gemini AI:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          sender: doc.data().sender,
          timestamp: doc.data().timestamp.toDate().toLocaleString(), // Convert Firestore Timestamp to string
          isAI: doc.data().isAI || false,
        }))
      );
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message to Firestore
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      sender: currentUser,
      timestamp: Timestamp.now(),
    });

    // Send the message to Gemini AI
    await sendToGeminiAI(newMessage);

    setNewMessage(""); // Clear input field
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 to-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-center text-gray-900 mb-8 animate-fadeIn">
          Love Chat
        </h1>

        <div
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 animate-fadeIn opacity-0"
          style={{ animationDelay: "200ms" }}
        >
          {/* Chat History */}
          <ScrollArea className="h-[400px] pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === currentUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === currentUser
                        ? "bg-love-500 text-white"
                        : message.isAI
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {message.sender}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp} {/* Now a string, safe to render */}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-love-500 hover:bg-love-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
