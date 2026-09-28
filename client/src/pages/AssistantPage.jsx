import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Shield, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello ${user?.full_name?.split(' ')[0] || 'Ravi'}. I am your **LifeVault Digital Legacy Assistant**.\n\nI continuously monitor your estate records, documents, and nominee allocations to ensure your family is prepared. Ask me anything about your vault, or click one of the suggested prompts below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'What assets have I added?',
    'Which assets have no nominee?',
    'What documents are missing?',
    'How can I improve my legacy readiness?',
    'Who can access my insurance information?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText) => {
    const q = (questionText || input).trim();
    if (!q) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAssistant(q);
      if (res.success) {
        const assistantMsg = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: res.answer,
          category: res.category,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'I encountered an error querying your vault records. Please verify server connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-premium overflow-hidden">
      {/* Assistant Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">LifeVault Assistant</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">Autonomous vault intelligence &amp; estate query engine</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Suggested:</span>
          </span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs px-3 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-medium transition-all shadow-subtle"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 shadow-subtle'
              }`}
            >
              <div className="whitespace-pre-line font-sans space-y-2">
                {m.text.split('\n\n').map((para, i) => (
                  <p key={i}>
                    {para.split('**').map((part, j) =>
                      j % 2 === 1 ? <strong key={j} className="font-bold text-emerald-600 dark:text-emerald-400">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>

              <span className={`block text-[10px] mt-2 font-mono ${
                m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
              }`}>
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border border-emerald-200">
                {user?.full_name ? user.full_name[0] : 'U'}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Auditing vault database &amp; formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask about your assets, missing documents, or legacy readiness..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-subtle"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
