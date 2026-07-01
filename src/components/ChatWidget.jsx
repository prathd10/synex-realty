import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const QUICK_REPLIES = [
  'View available properties',
  'Get price estimates',
  'Schedule a site visit',
  'Investment advice',
];

const BOT_RESPONSES = {
  'view available properties': "We have 100+ premium properties listed across Mumbai. You can browse all of them at /properties or tell me your preferred area — Bandra, Worli, Powai, Juhu, and more!",
  'get price estimates': "Mumbai property prices vary by area. South Mumbai (Malabar Hill, Worli) ranges ₹40,000–80,000/sq.ft. Western suburbs (Bandra, Juhu) are ₹30,000–55,000/sq.ft. Eastern/Thane are ₹13,000–25,000/sq.ft. Which area interests you?",
  'schedule a site visit': "Absolutely! Our team is available 7 days a week for site visits. Please share your name and preferred date, or fill the inquiry form on any property page and we'll reach you within 24 hours.",
  'investment advice': "Mumbai real estate has consistently delivered strong returns. Currently, areas like Lower Parel, Powai, and Thane (Ghodbunder Road) offer the best appreciation potential. Would you like details on specific investment opportunities?",
};

const getResponse = (text) => {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key.split(' ')[0]) || lower.includes(key.split(' ')[1] || '')) {
      return val;
    }
  }
  return "Thanks for reaching out! Our property experts are available Mon–Sat, 9 AM–7 PM. You can also call us at +91 98765 43210 or fill the inquiry form on any listing. How else can I help?";
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hi! 👋 I'm the Synex Realty assistant. How can I help you find your perfect Mumbai property today?" },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, from: 'bot', text: getResponse(text) }]);
    }, 600);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-5 w-auto sm:w-96 max-w-full glass-dark rounded-3xl shadow-float z-50 flex flex-col overflow-hidden animate-slide-in border border-white/10 backdrop-blur-xl">
          {/* Header */}
          <div className="bg-[#110D1A]/70 px-5 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center shadow-luxury">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white text-xs uppercase tracking-widest font-bold">Synex Advisor</div>
                <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors duration-300 w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-72 bg-[#110D1A]/90 backdrop-blur-md">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-accent text-white rounded-br-none shadow-luxury border border-white/5'
                      : 'bg-white/10 backdrop-blur-sm text-white shadow-luxury rounded-bl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 pt-2.5 pb-1 flex flex-wrap gap-1.5 bg-[#110D1A]/90 backdrop-blur-md">
              {QUICK_REPLIES.map(r => (
                <button
                  key={r}
                  onClick={() => send(r)}
                  className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-full hover:border-accent hover:text-white hover:shadow-luxury transition-all duration-300 font-bold"
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3.5 bg-[#110D1A] border-t border-white/5 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Type your message…"
              className="flex-1 text-xs font-medium border border-white/10 rounded-full px-4.5 py-2.5 focus:outline-none focus:border-accent text-white bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
            />
            <button
              onClick={() => send(input)}
              className="w-9 h-9 bg-accent hover:bg-accent-dark text-white rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-luxury hover:scale-105 shrink-0"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-float transition-all duration-500 hover:scale-105 border border-white/5 ${
          open ? 'bg-[#110D1A] rotate-90 border-white/10' : 'bg-accent hover:bg-accent-dark'
        }`}
        aria-label="Open chat"
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={20} className="text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow-md">
            1
          </span>
        )}
      </button>
    </>
  );
}
