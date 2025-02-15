
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, Heart } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi love! How was your day?",
      sender: "John",
      timestamp: "10:00 AM"
    },
    {
      id: 2,
      text: "It was great! Missing you though ❤️",
      sender: "Jane",
      timestamp: "10:01 AM"
    },
    {
      id: 3,
      text: "Shall we plan something for the weekend?",
      sender: "John",
      timestamp: "10:02 AM"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = "John"; // This would normally come from authentication

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 to-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-center text-gray-900 mb-8 animate-fadeIn">
          Love Chat
        </h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 animate-fadeIn opacity-0" 
             style={{ animationDelay: "200ms" }}>
          {/* Chat History */}
          <ScrollArea className="h-[400px] pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === currentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === currentUser
                        ? "bg-love-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{message.sender}</span>
                      <span className="text-xs opacity-70">{message.timestamp}</span>
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
