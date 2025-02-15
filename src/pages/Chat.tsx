
const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 to-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-center text-gray-900 mb-8 animate-fadeIn">
          Love Chat
        </h1>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fadeIn opacity-0" style={{ animationDelay: "200ms" }}>
          <p className="font-inter text-gray-600 text-center mb-8">
            Coming soon... A beautiful chat interface to connect with your loved ones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
