import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../../services/aiService';
import { generateSessionId } from '../../utils/formatters';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Assalomu alaykum! Men BMG School yordamchisiman. Kurslar, narxlar, IELTS yoki boshqa savollaringiz bo'lsa, so'rang.",
};

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef(generateSessionId());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = { role: 'user', content: trimmed };
    const conversationHistory = messages
      .filter((m) => m !== WELCOME_MESSAGE)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const { response } = await sendChatMessage(trimmed, sessionIdRef.current, conversationHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Kechirasiz, texnik xatolik yuz berdi. Iltimos, birozdan keyin qayta urinib ko'ring yoki qo'ng'iroq qiling.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {/* Floating tugma */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-ink-800 scale-90' : 'bg-gold-400 hover:scale-105'
        }`}
        aria-label="AI Support chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-ink-900" strokeWidth={2.2} />
        )}
      </button>

      {/* Chat oynasi */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-up">
          <div className="bg-ink-900 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-400 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4.5 h-4.5 text-ink-900" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">BMG School yordamchisi</p>
              <p className="text-slate-400 text-xs">Odatda tezda javob beradi</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-ink-900 text-white rounded-br-md'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-200 p-3 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="w-10 h-10 rounded-full bg-gold-400 hover:bg-gold-300 disabled:opacity-40 disabled:hover:bg-gold-400 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 text-ink-900" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
