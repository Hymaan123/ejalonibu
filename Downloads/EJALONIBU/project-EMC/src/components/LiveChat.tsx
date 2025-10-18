import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to EMC Ejalonibu Metal and Aluminium Works. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickResponses = [
    'I need a quote for metal construction',
    'What services do you offer?',
    'How long does a project take?',
    'Do you work with aluminum?',
    'I need security fencing',
    'Can I schedule a consultation?'
  ];

  const botResponses = {
    'quote': 'I\'d be happy to help you with a quote! Could you tell me more about your project? What type of metalwork are you looking for?',
    'services': 'We offer comprehensive metal fabrication services including: Metal Construction Works, Wrought Iron Work, Aluminum Works, Security Fence Systems, Heavy Duty Gates & Doors, and Car Park Installation. Which service interests you most?',
    'time': 'Project timelines vary depending on complexity. Simple projects take 1-2 weeks, while complex industrial projects can take 8-16 weeks. What type of project are you planning?',
    'aluminum': 'Yes! We specialize in aluminum works including windows, doors, curtain wall systems, and custom aluminum fabrication. We have certified aluminum specialists on our team.',
    'security': 'We offer comprehensive security fencing solutions including chain link fencing, perimeter protection, automated gates, and access control systems. What\'s your security requirement?',
    'consultation': 'Absolutely! We offer both in-person and virtual consultations. You can schedule one through our website or I can connect you with our consultation team right now.',
    'default': 'Thank you for your message. Let me connect you with one of our specialists who can provide detailed information about your specific needs. In the meantime, you can also call us at +234 (0) 123 456 7890.'
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('quote') || message.includes('price') || message.includes('cost')) {
      return botResponses.quote;
    } else if (message.includes('service') || message.includes('what do you')) {
      return botResponses.services;
    } else if (message.includes('time') || message.includes('long') || message.includes('duration')) {
      return botResponses.time;
    } else if (message.includes('aluminum') || message.includes('aluminium')) {
      return botResponses.aluminum;
    } else if (message.includes('security') || message.includes('fence') || message.includes('fencing')) {
      return botResponses.security;
    } else if (message.includes('consultation') || message.includes('meeting') || message.includes('schedule')) {
      return botResponses.consultation;
    } else {
      return botResponses.default;
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (response: string) => {
    sendMessage(response);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'hidden' : 'block'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          1
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-blue-900 text-white p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">EMC Ejalonibu Support</h3>
                  <p className="text-xs text-blue-200">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            {messages.length <= 2 && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.slice(0, 3).map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickResponse(response)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => sendMessage(inputMessage)}
                  className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              {/* Contact Options */}
              <div className="flex justify-center space-x-4 mt-3 pt-3 border-t border-gray-100">
                <a
                  href="tel:+2341234567890"
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </a>
                <a
                  href="mailto:info@ejalonibumetalworks.com"
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <Mail className="h-3 w-3" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;