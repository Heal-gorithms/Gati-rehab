import { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { sendMessage, subscribeToMessages } from '../services/messageService';

const ChatWindow = ({ currentUser, otherUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const unsubscribe = subscribeToMessages(
      currentUser.uid,
      otherUser.uid,
      (msgs) => {
        setMessages(msgs);
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    );

    return () => unsubscribe();
  }, [currentUser, otherUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(currentUser.uid, otherUser.uid, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send:', error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <User className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-bold">{otherUser.name || 'Chat'}</h3>
          <p className="text-blue-100 text-xs">Direct Message</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl font-medium text-sm shadow-sm ${
              msg.senderId === currentUser.uid
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
