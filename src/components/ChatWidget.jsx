import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { searchProperties } from '../lib/queries';
import { parsePropertyQuery, describeFilters } from '../lib/chatParser';

const QUICK_REPLIES = [
  '3 BHK in Bandra West',
  'Sea Facing 3 BHK in Worli',
  '2 BHK in Powai',
  'Office in Lower Parel',
];

const BOT_RESPONSES = {
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
  return "Tell me what you're looking for — e.g. \"2 BHK in Powai under 80 lakh\" or \"3 BHK for rent in Bandra\" — and I'll pull up matching listings. You can also call us at +91 98765 43210.";
};

function propertiesSearchUrl(filters) {
  const params = new URLSearchParams();
  if (filters.area) params.set('area', filters.area);
  if (filters.type) params.set('type', filters.type);
  if (filters.purpose) params.set('purpose', filters.purpose);
  if (filters.bhk) params.set('bhk', filters.bhk >= 5 ? '5+' : String(filters.bhk));
  if (filters.maxPrice) params.set('maxPrice', String(Math.round(filters.maxPrice)));
  return `/properties?${params.toString()}`;
}

function ChatPropertyResult({ property }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="flex gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 transition-colors duration-300"
    >
      <img src={property.images?.[0]} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 bg-white/10" />
      <div className="min-w-0 flex flex-col justify-center">
        <div className="text-white text-xs font-bold truncate">{property.title}</div>
        <div className="text-cream/50 text-[10px] mt-0.5">
          {property.bhk ? `${property.bhk} BHK · ` : ''}{property.area}
        </div>
        <div className="text-accent text-xs font-bold mt-0.5">{property.priceDisplay}</div>
      </div>
    </Link>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hi! 👋 I'm the Synex Realty assistant. Tell me what you're looking for — e.g. \"2 BHK in Powai under 80 lakh\" — and I'll find matching listings for you." },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    const filters = parsePropertyQuery(text);

    if (filters.hasFilters) {
      const typingId = Date.now() + 1;
      setMessages((m) => [...m, { id: typingId, from: 'bot', text: 'Searching…' }]);
      try {
        const results = await searchProperties(filters, 4);
        setMessages((m) =>
          m.map((msg) =>
            msg.id === typingId
              ? {
                  ...msg,
                  text:
                    results.length > 0
                      ? `Here's what I found for ${describeFilters(filters)}:`
                      : `I couldn't find any listings for ${describeFilters(filters)}. Try widening your search, or browse everything on the Properties page.`,
                  results,
                  filters,
                }
              : msg
          )
        );
      } catch {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === typingId ? { ...msg, text: 'Something went wrong searching properties. Please try again.' } : msg
          )
        );
      }
      return;
    }

    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: getResponse(text) }]);
    }, 500);
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-96 bg-[#110D1A]/90 backdrop-blur-md">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.results ? 'max-w-[92%]' : 'max-w-[80%]'} ${
                    msg.from === 'user'
                      ? 'bg-accent text-white rounded-br-none shadow-luxury border border-white/5'
                      : 'bg-white/10 backdrop-blur-sm text-white shadow-luxury rounded-bl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                  {msg.results?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.results.map((p) => (
                        <ChatPropertyResult key={p.id} property={p} />
                      ))}
                      <Link
                        to={propertiesSearchUrl(msg.filters)}
                        className="block text-center text-[10px] uppercase tracking-wider font-bold text-accent hover:text-white transition-colors pt-1"
                      >
                        View All Matches →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 pt-2.5 pb-1 flex flex-wrap gap-1.5 bg-[#110D1A]/90 backdrop-blur-md">
              {QUICK_REPLIES.map((r) => (
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="e.g. 2 BHK in Powai under 80 lakh"
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
        onClick={() => setOpen((o) => !o)}
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
