// File: src/app/dashboard/messages/page.tsx
'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/utils/auth';
import { 
  FaPaperPlane, 
  FaArchive, 
  FaTrash, 
  FaInbox, 
  FaChevronLeft, 
  FaInfoCircle, 
  FaSpinner, 
  FaCheckCircle, 
  FaHourglassHalf,
  FaSearch,
  FaEllipsisV,
  FaSmile,
  FaPaperclip,
  FaTimes,
  FaChevronDown,
  FaBolt
} from 'react-icons/fa';
import Image from 'next/image';

// --- Data Structures ---
interface Message {
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
  type?: 'text' | 'image' | 'document';
  fileUrl?: string;
  status?: 'sent' | 'pending_approval' | 'approved' | 'rejected';
}

interface Conversation {
  thread_id: string;
  participants: string[];
  listing_title: string;
  messages: Message[];
  unreadCount?: number;
  listing_price?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
}

// --- Mock Data ---
const mockConversations: Conversation[] = [
  {
    thread_id: "t001",
    participants: ["ada@example.com", "john@example.com"],
    listing_title: "Luxury Bed",
    listing_price: 100000,
    messages: [
      { sender: "john@example.com", content: "Hi Ada, is the Luxury Bed still available? What's its exact condition?", timestamp: "2025-07-10T10:30:00Z", read: true, status: 'approved' },
      { sender: "ada@example.com", content: "Yes John, it's still available! It's in brand new condition, barely used.", timestamp: "2025-07-10T10:35:00Z", read: false, status: 'approved' },
      { sender: "john@example.com", content: "Great! Can you share more photos of it?", timestamp: "2025-07-10T10:40:00Z", read: false, status: 'approved' },
      { sender: "ada@example.com", content: "Sure, I'll send some more close-ups by evening. Are you interested in viewing it?", timestamp: "2025-07-10T10:45:00Z", read: false, status: 'approved' },
      { sender: "john@example.com", content: "Possibly! What's the best time to see it this week?", timestamp: "2025-07-11T09:00:00Z", read: false, status: 'approved' }
    ]
  },
  {
    thread_id: "t002",
    participants: ["ada@example.com", "grace@example.com"],
    listing_title: "Vintage Chair",
    listing_price: 15000,
    messages: [
      { sender: "grace@example.com", content: "Hello, I saw your Vintage Chair listing. Is the price negotiable?", timestamp: "2025-07-11T14:20:00Z", read: true, status: 'approved' },
      { sender: "ada@example.com", content: "Hi Grace! Yes, it's slightly negotiable. What's your offer?", timestamp: "2025-07-11T14:25:00Z", read: true, status: 'approved' },
      { sender: "grace@example.com", content: "Would you consider ₦13,000 for it?", timestamp: "2025-07-11T14:30:00Z", read: false, status: 'approved' },
      { sender: "ada@example.com", content: "Let me think about it. I'll get back to you soon.", timestamp: "2025-07-11T14:35:00Z", read: false, status: 'approved' }
    ]
  },
  {
    thread_id: "t003",
    participants: ["john@example.com", "michael@example.com"],
    listing_title: "Office Desk",
    listing_price: 50000,
    messages: [
      { sender: "michael@example.com", content: "Is the office desk available? How old is it?", timestamp: "2025-07-09T11:00:00Z", read: true, status: 'approved' },
      { sender: "john@example.com", content: "Yes, it is. About 2 years old, still in great condition.", timestamp: "2025-07-09T11:05:00Z", read: true, status: 'approved' }
    ]
  },
  {
    thread_id: "t004",
    participants: ["ada@example.com", "john@example.com"],
    listing_title: "Stylish Sofa",
    listing_price: 250000,
    messages: [
      { sender: "john@example.com", content: "Hey, about the Stylish Sofa, is pickup available this weekend?", timestamp: "2025-07-12T16:00:00Z", read: true, status: 'approved' },
      { sender: "ada@example.com", content: "Yes, Saturday morning works best for me.", timestamp: "2025-07-12T16:05:00Z", read: true, status: 'approved' },
      { sender: "john@example.com", content: "Okay, I'll confirm. Thanks!", timestamp: "2025-07-12T16:10:00Z", read: false, status: 'approved' }
    ]
  },
  {
    thread_id: "t005",
    participants: ["grace@example.com", "john@example.com"],
    listing_title: "Luxury Bed",
    listing_price: 100000,
    messages: [
      { sender: "grace@example.com", content: "Hi John, saw your listing for the Luxury Bed. Any flexibility on price?", timestamp: "2025-07-13T09:30:00Z", read: true, status: 'approved' },
      { sender: "john@example.com", content: "Grace, I've just had another offer. Price is firm for now. Are you still interested?", timestamp: "2025-07-13T09:35:00Z", read: true, status: 'approved' }
    ]
  }
];

const mockUsers = [
  { id: 1, name: "Ada Obi", email: "ada@example.com", profileImage: "/images/profiles/ada-obi.jpg" },
  { id: 2, name: "John Doe", email: "john@example.com", profileImage: "/images/profiles/john-doe.png" },
  { id: 3, name: "Grace Uche", email: "grace@example.com", profileImage: "/images/profiles/grace-uche.jpg" },
  { id: 4, name: "Michael Okoro", email: "michael@example.com", profileImage: "/images/profiles/michael-okoro.jpg" },
  { id: 5, name: "Sarah Hassan", email: "sarah@example.com", profileImage: "/images/profiles/sarah-hassan.jpg" }
];

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const markAsRead = useCallback((threadId: string, userEmail: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.thread_id === threadId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.sender !== userEmail && !msg.read && msg.status !== 'pending_approval' ? { ...msg, read: true } : msg
              ),
            }
          : conv
      )
    );
  }, []);

  useEffect(() => {
    async function loadUserDataAndConversations() {
      const user = await getCurrentUser();
      if (user && user.email) {
        setCurrentUser(user as User);

        const userConversations = mockConversations
          .filter(conv => conv.participants.includes(user.email))
          .sort((a, b) => {
            const lastMsgA = a.messages[a.messages.length - 1]?.timestamp || '0';
            const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || '0';
            return new Date(lastMsgB).getTime() - new Date(lastMsgA).getTime();
          });

        setConversations(userConversations);

        if (userConversations.length > 0) {
          setActiveConversation(userConversations[0]);
        }
      }
    }
    loadUserDataAndConversations();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeConversation && currentUser) {
      markAsRead(activeConversation.thread_id, currentUser.email);
    }
    scrollToBottom();
  }, [activeConversation, currentUser, markAsRead]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [messageText]);

  // Typing simulation
  const simulateTyping = () => {
    if (messageText.trim()) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleSendMessage = (content: string, status: 'sent' | 'pending_approval' = 'sent') => {
    if (!content.trim() || !currentUser || !activeConversation) return;

    const newMessage: Message = {
      sender: currentUser.email,
      content: content,
      timestamp: new Date().toISOString(),
      read: true,
      status: status
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.thread_id === activeConversation.thread_id
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );

    setActiveConversation(prev =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : null
    );

    setMessageText('');
    setShowOtherInput(false);
    setIsTyping(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const getParticipantName = useCallback((conversation: Conversation) => {
    if (!currentUser) return 'Unknown User';
    const otherParticipantEmail = conversation.participants.find(p => p !== currentUser.email);
    const participant = mockUsers.find(u => u.email === otherParticipantEmail);
    return participant?.name || otherParticipantEmail || 'Unknown User';
  }, [currentUser]);

  const getParticipantImage = useCallback((email: string) => {
    const user = mockUsers.find(u => u.email === email);
    return user?.profileImage || '/default-avatar.png';
  }, []);

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 2 && date.getDate() === now.getDate() - 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => 
      getParticipantName(conv).toLowerCase().includes(searchText.toLowerCase()) ||
      conv.listing_title.toLowerCase().includes(searchText.toLowerCase()) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [conversations, searchText, getParticipantName]);

  const totalUnreadMessages = useMemo(() => {
    if (!currentUser) return 0;
    return conversations.reduce((total, conv) => {
      return total + conv.messages.filter(msg => msg.sender !== currentUser.email && !msg.read && msg.status !== 'pending_approval').length;
    }, 0);
  }, [conversations, currentUser]);

  const handlePredefinedQuestion = (question: string) => {
    if (question === "Other") {
      setShowOtherInput(true);
      setMessageText('');
    } else if (question.startsWith("Offer ")) {
      const offer = parseFloat(question.replace('Offer ₦', '').replace(/,/g, ''));
      handleSendMessage(`I'd like to offer ₦${offer.toLocaleString()}.`, 'pending_approval');
    } else {
      handleSendMessage(question);
    }
  };

  const generateNegotiationOptions = (basePrice: number | undefined) => {
    if (!basePrice) return [];
    const options = [];
    const lowerBound2Percent = basePrice * 0.98;
    const lowerBound5Percent = basePrice * 0.95;

    options.push(Math.round(lowerBound2Percent));
    options.push(Math.round(basePrice * 0.965));
    options.push(Math.round(lowerBound5Percent));

    return options.map(price => `Offer ₦${price.toLocaleString()}`);
  };

  const predefinedQuestions = useMemo(() => {
    const questions = [
      "Is this item still available?",
      "What's the exact condition of the item?",
      "When is the best time for pickup?",
      "What payment methods do you accept?",
      "Is the price negotiable?",
      "Can you provide more photos/videos?",
      "Other"
    ];

    if (activeConversation?.listing_price) {
      const negotiableIndex = questions.indexOf("Is the price negotiable?");
      if (negotiableIndex !== -1) {
        questions.splice(negotiableIndex, 1, ...generateNegotiationOptions(activeConversation.listing_price));
      }
    }
    return questions;
  }, [activeConversation?.listing_price]);

  const emojis = ['😊', '👍', '❤️', '😂', '😍', '🙏', '👌', '🔥', '💯', '✨'];

  const addEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (!currentUser) {
    return (
      <DashboardLayout totalUnreadMessages={0}>
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="relative">
              <FaSpinner className="animate-spin text-[#775522] text-5xl mx-auto mb-4" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#775522]/20 to-transparent rounded-full animate-pulse"></div>
            </div>
            <p className="text-xl text-gray-700 font-medium">Loading your conversations...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#775522] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#775522] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-[#775522] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout totalUnreadMessages={totalUnreadMessages}>
      <div className="flex h-[calc(100vh-90px)] bg-gradient-to-br from-gray-50 to-gray-100 p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
        
        {/* Mobile Header */}
        {isSmallScreen && (
          <div className="absolute top-2 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <button
              className="p-2 text-[#775522] hover:bg-[#775522]/10 rounded-full transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaChevronLeft className={`${sidebarOpen ? 'rotate-180' : ''} transition-transform duration-200`} />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            <div className="w-8"></div>
          </div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            ${isSmallScreen 
              ? `fixed top-0 left-0 z-20 w-full h-full bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
              : 'relative w-1/3 max-w-sm flex-shrink-0'
            }
            bg-white border-r border-gray-200 shadow-xl rounded-xl md:rounded-l-xl md:rounded-r-none
            flex flex-col overflow-hidden
          `}
        >
          <div className={`p-4 border-b border-gray-100 bg-gradient-to-r from-[#775522] to-[#8B6635] ${isSmallScreen ? 'pt-16' : ''}`}>
            <div className="flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaInbox className="text-white/90" /> 
                <span>Inbox</span>
              </h2>
              <div className="flex items-center gap-2">
                {totalUnreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {totalUnreadMessages}
                  </span>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="mt-3 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30 focus:border-white transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FaInbox className="text-4xl mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No conversations found</p>
                <p className="text-sm mt-1">Try adjusting your search or start a new chat</p>
              </div>
            ) : (
              filteredConversations.map((conv, index) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const unreadCount = conv.messages.filter(
                  msg => msg.sender !== currentUser.email && !msg.read && msg.status !== 'pending_approval'
                ).length;
                const otherParticipantName = getParticipantName(conv);
                const otherParticipantImage = getParticipantImage(conv.participants.find(p => p !== currentUser.email) || '');

                return (
                  <div
                    key={conv.thread_id}
                    className={`
                      flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer
                      transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md
                      ${activeConversation?.thread_id === conv.thread_id
                        ? 'bg-gradient-to-r from-[#775522]/10 to-[#E8CEB0]/30 shadow-inner border-l-4 border-[#775522]'
                        : 'bg-gray-50 hover:bg-white hover:shadow-sm'}
                    `}
                    onClick={() => {
                      setActiveConversation(conv);
                      if (isSmallScreen) setSidebarOpen(false);
                      setShowOtherInput(false);
                      setMessageText('');
                      setShowQuickReplies(false);
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="relative">
                        <Image
                          src={otherParticipantImage}
                          alt={otherParticipantName}
                          width={48}
                          height={48}
                          className="rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        {/* Online status indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800 truncate pr-2">{otherParticipantName}</p>
                        {lastMsg && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTimestamp(lastMsg.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 truncate ${unreadCount > 0 ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                        {lastMsg ? lastMsg.content : 'No messages yet.'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-[#775522] bg-[#775522]/10 px-2 py-1 rounded-full truncate max-w-[140px]">
                          {conv.listing_title}
                        </p>
                        {conv.listing_price && (
                          <span className="text-xs font-medium text-green-600">
                            ₦{conv.listing_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className={`
          flex flex-col flex-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden
          ${isSmallScreen && sidebarOpen ? 'hidden' : 'flex'}
        `}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  {isSmallScreen && (
                    <button
                      className="p-2 text-[#775522] hover:bg-[#775522]/10 rounded-full transition-colors"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <FaChevronLeft />
                    </button>
                  )}
                  <div className="relative">
                    <Image
                      src={getParticipantImage(getParticipantEmail(activeConversation, currentUser.email))}
                      alt={getParticipantName(activeConversation)}
                      width={44}
                      height={44}
                      className="rounded-full object-cover border-2 border-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{getParticipantName(activeConversation)}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600 truncate">
                        {activeConversation.listing_title}
                      </p>
                      {activeConversation.listing_price && (
                        <span className="text-sm font-medium text-green-600">
                          • ₦{activeConversation.listing_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {isTyping && (
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="flex gap-1">
                          <span className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></span>
                          <span className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                          <span className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        </span>
                        typing...
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 text-gray-600 hover:text-[#775522] hover:bg-[#775522]/10 rounded-full transition-colors"
                  >
                    <FaEllipsisV />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-12 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-10 min-w-[160px]">
                      <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FaInfoCircle className="text-[#775522]" />
                        View Listing
                      </button>
                      <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FaArchive className="text-[#775522]" />
                        Archive Chat
                      </button>
                      <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <FaTrash className="text-red-500" />
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white">
                {activeConversation.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === currentUser.email ? 'flex-row-reverse' : 'flex-row'}`}>
                      {msg.sender !== currentUser.email && (
                        <Image
                          src={getParticipantImage(msg.sender)}
                          alt="Avatar"
                          width={28}
                          height={28}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      
                      <div
                        className={`
                          px-4 py-3 rounded-2xl shadow-sm relative group
                          ${msg.sender === currentUser.email
                            ? 'bg-gradient-to-r from-[#775522] to-[#8B6635] text-white rounded-br-md'
                            : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                          }
                        `}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        
                        <div className={`flex items-center justify-${msg.sender === currentUser.email ? 'end' : 'start'} gap-2 mt-2 text-xs opacity-70`}>
                          <span>{formatTimestamp(msg.timestamp)}</span>
                          {msg.sender === currentUser.email && (
                            <div className="flex items-center gap-1">
                              {msg.status === 'pending_approval' ? (
                                <span className="text-yellow-200" title="Pending approval (up to 12 hours)">
                                  <FaHourglassHalf />
                                </span>
                              ) : msg.read ? (
                                <span className="text-white/80" title="Read">
                                  <FaCheckCircle />
                                </span>
                              ) : (
                                <span className="text-white/60" title="Sent">
                                  <FaCheckCircle />
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {msg.status === 'pending_approval' && msg.sender === currentUser.email && (
                          <div className="mt-2 p-2 bg-yellow-100 rounded-lg">
                            <p className="text-xs text-yellow-800">
                              <FaHourglassHalf className="inline mr-1" />
                              Awaiting approval (max 12 hours)
                            </p>
                          </div>
                        )}
                        
                        {/* Message hover actions */}
                        <div className={`
                          absolute ${msg.sender === currentUser.email ? 'left-[-40px]' : 'right-[-40px]'} 
                          top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
                        `}>
                          <button className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 text-xs">
                            <FaSmile />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {/* Quick Replies Toggle for Mobile */}
                {isSmallScreen && (
                  <div className="flex justify-center mb-3">
                    <button
                      onClick={() => setShowQuickReplies(prev => !prev)}
                      className="flex items-center gap-2 text-[#775522] text-sm font-medium bg-[#775522]/10 px-4 py-2 rounded-full hover:bg-[#775522]/20 transition-colors"
                    >
                      <FaBolt />
                      {showQuickReplies ? 'Hide Quick Replies' : 'Quick Replies'}
                      <FaChevronDown className={`transition-transform ${showQuickReplies ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}

                {/* Quick Replies */}
                {(!isSmallScreen || showQuickReplies) && !showOtherInput && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBolt className="text-[#775522]" />
                      <span className="text-sm font-medium text-gray-700">Quick Replies</span>
                    </div>
                    <div className={`
                      ${isSmallScreen 
                        ? "grid grid-cols-1 gap-2" 
                        : "grid grid-cols-2 lg:grid-cols-3 gap-2"}
                      max-h-32 overflow-y-auto
                    `}>
                      {predefinedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePredefinedQuestion(q)}
                          className="px-3 py-2 text-sm bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-gray-700 hover:from-[#E8CEB0]/30 hover:to-[#775522]/10 hover:text-[#775522] transition-all duration-200 border border-gray-200 hover:border-[#775522]/30 text-left transform hover:scale-[1.02] hover:shadow-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Message Input - Only shown when "Other" is selected */}
                {showOtherInput && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-amber-800">Custom Message</span>
                        <button
                          onClick={() => {
                            setShowOtherInput(false);
                            setMessageText('');
                          }}
                          className="text-amber-600 hover:text-amber-800 p-1"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p className="text-xs text-amber-700 mb-1">
                        <FaHourglassHalf className="inline mr-1" />
                        Custom messages require approval and may take up to 12 hours to be sent.
                      </p>
                      <p className="text-xs text-amber-600">
                        Use this option only for messages not covered by quick replies above.
                      </p>
                    </div>

                    {/* Custom Message Input Area */}
                    <div className="flex items-end gap-2">
                      {/* Attachment Button */}
                      <button
                        className="p-3 text-gray-500 hover:text-[#775522] hover:bg-[#775522]/10 rounded-full transition-colors flex-shrink-0"
                        title="Attach file"
                      >
                        <FaPaperclip />
                      </button>

                      {/* Text Input */}
                      <div className="flex-1 relative">
                        <textarea
                          ref={textareaRef}
                          value={messageText}
                          onChange={(e) => {
                            setMessageText(e.target.value);
                            simulateTyping();
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(messageText, 'pending_approval');
                            }
                          }}
                          placeholder="Type your custom message for approval..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#775522]/30 focus:border-[#775522] placeholder-gray-500 text-gray-800 bg-gray-50 hover:bg-white transition-all min-h-[48px] max-h-[120px] overflow-y-auto"
                          rows={1}
                        />
                        
                        {/* Emoji Button */}
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="text-gray-500 hover:text-[#775522] transition-colors"
                          >
                            <FaSmile />
                          </button>
                          
                          {/* Simple Emoji Picker */}
                          {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                              <div className="grid grid-cols-5 gap-1">
                                {emojis.map((emoji, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => addEmoji(emoji)}
                                    className="p-1 hover:bg-gray-100 rounded text-lg"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Send for Approval Button */}
                      <button
                        onClick={() => handleSendMessage(messageText, 'pending_approval')}
                        disabled={!messageText.trim()}
                        className={`
                          p-3 rounded-full shadow-lg transition-all duration-300 transform flex-shrink-0
                          ${messageText.trim()
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:scale-105 hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }
                        `}
                        title="Send for approval"
                      >
                        <FaHourglassHalf />
                      </button>
                    </div>

                    {/* Character counter for custom messages */}
                    {messageText && (
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {messageText.length} characters
                      </div>
                    )}
                  </div>
                )}

                {/* Message when no custom input is shown */}
                {!showOtherInput && (
                  <div className="text-center py-6 text-gray-500">
                    <FaBolt className="text-2xl mx-auto mb-2 text-[#775522]/50" />
                    <p className="text-sm font-medium">Use Quick Replies above to send messages instantly</p>
                    <p className="text-xs mt-1">Or select "Other" for custom messages that require approval</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 p-8 text-center bg-gradient-to-br from-gray-50 to-white">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#775522]/20 to-[#E8CEB0]/40 rounded-full flex items-center justify-center">
                  <FaInbox className="text-4xl text-[#775522]" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#775522] to-[#8B6635] rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Messages</h3>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Select a conversation to start chatting with buyers and sellers. Your messages will appear here with real-time updates.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Real-time messaging
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Quick replies
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  Price negotiations
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Click outside to close dropdowns */}
        {(showDropdown || showEmojiPicker) && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => {
              setShowDropdown(false);
              setShowEmojiPicker(false);
            }}
          />
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out forwards;
        }
        
        @keyframes pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .animate-pop {
          animation: pop 0.3s ease-out;
        }
        
        @keyframes chat-bubble-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-chat-bubble-in {
          animation: chat-bubble-in 0.3s ease-out forwards;
        }
      `}</style>
    </DashboardLayout>
  );
}

const getParticipantEmail = (conversation: Conversation, currentUserEmail: string) => {
  return conversation.participants.find(p => p !== currentUserEmail) || '';
};