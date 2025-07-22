// File: src/app/dashboard/messages/page.tsx
'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/utils/auth';
import { FaPaperPlane, FaArchive, FaTrash, FaInbox, FaChevronLeft, FaInfoCircle, FaSpinner, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import Image from 'next/image';

// --- Data Structures ---
interface Message {
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
  type?: 'text' | 'image' | 'document';
  fileUrl?: string;
  status?: 'sent' | 'pending_approval' | 'approved' | 'rejected'; // Added status
}

interface Conversation {
  thread_id: string;
  participants: string[];
  listing_title: string;
  messages: Message[];
  unreadCount?: number;
  listing_price?: number; // Added for negotiation logic
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
    listing_price: 100000, // Example price for negotiation
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false); // State for quick replies visibility
  const [isSmallScreen, setIsSmallScreen] = useState(false); // State to detect small screens

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
      setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
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

  const handleSendMessage = (content: string, status: 'sent' | 'pending_approval' = 'sent') => {
    if (!content.trim() || !currentUser || !activeConversation) return;

    const newMessage: Message = {
      sender: currentUser.email,
      content: content,
      timestamp: new Date().toISOString(),
      read: true, // Sender's own message is always read
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
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

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

  const totalUnreadMessages = useMemo(() => {
    if (!currentUser) return 0;
    return conversations.reduce((total, conv) => {
      return total + conv.messages.filter(msg => msg.sender !== currentUser.email && !msg.read && msg.status !== 'pending_approval').length;
    }, 0);
  }, [conversations, currentUser]);

  const handlePredefinedQuestion = (question: string) => {
    if (question === "Other") {
      setShowOtherInput(true);
      setMessageText(''); // Clear previous text when "Other" is selected
    } else if (question.startsWith("Offer ")) {
      // Handle negotiation logic
      const offer = parseFloat(question.replace('Offer ₦', '').replace(/,/g, ''));
      handleSendMessage(`I'd like to offer ₦${offer.toLocaleString()}.`, 'pending_approval');
    }
    else {
      handleSendMessage(question);
    }
  };

  const generateNegotiationOptions = (basePrice: number | undefined) => {
    if (!basePrice) return [];
    const options = [];
    const lowerBound2Percent = basePrice * 0.98;
    const lowerBound5Percent = basePrice * 0.95;

    // Provide 3 specific negotiation points within 2% and 5% range
    // Example: 2% off, 3.5% off, 5% off
    options.push(Math.round(lowerBound2Percent));
    options.push(Math.round(basePrice * 0.965)); // Roughly 3.5% off
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


  if (!currentUser) {
    return (
      <DashboardLayout totalUnreadMessages={0}>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <FaSpinner className="animate-spin text-[#775522] text-5xl" />
          <p className="ml-4 text-xl text-gray-700">Loading messages...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout totalUnreadMessages={totalUnreadMessages}>
      <div className="flex h-[calc(100vh-90px)] bg-gray-50 p-4 sm:p-98 md:p-4 gap-4 overflow-hidden">
        {/* Sidebar Toggle for Mobile */}
        <button
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-white rounded-full shadow-lg text-[#775522]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle conversations"
        >
          <FaChevronLeft className={`${sidebarOpen ? 'rotate-180' : ''} transition-transform`} />
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed top-[60px] inset-x-0 z-10 w-full bg-white border-r border-gray-200 shadow-xl
            md:relative md:w-1/3 md:max-w-xs md:flex-shrink-0 md:rounded-xl md:shadow-lg md:border
            flex flex-col p-10 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:flex
            ${!sidebarOpen && !activeConversation ? 'hidden' : 'flex'}
          `}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 animate-slideInLeft">
            <FaInbox className="text-[#775522]" /> Inbox
          </h2>

          <div className="overflow-y-auto flex-1 hide-scrollbar">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 py-10 animate-fadeIn">
                <p>No conversations yet.</p>
                <p className="text-sm mt-2">Start a chat from a product listing!</p>
              </div>
            ) : (
              conversations.map((conv, index) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const unreadMessagesCount = conv.messages.filter(
                  msg => msg.sender !== currentUser.email && !msg.read && msg.status !== 'pending_approval'
                ).length;
                const otherParticipantName = getParticipantName(conv);
                const otherParticipantImage = getParticipantImage(conv.participants.find(p => p !== currentUser.email) || '');

                return (
                  <div
                    key={conv.thread_id}
                    className={`
                      flex items-center gap-3 p-4 mb-3 rounded-xl cursor-pointer
                      transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md
                      ${activeConversation?.thread_id === conv.thread_id
                        ? 'bg-[#E8CEB0]/20 shadow-inner border border-[#775522]/20'
                        : 'bg-white hover:bg-gray-50'}
                      animate-slideInLeft
                    `}
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => {
                      setActiveConversation(conv);
                      setSidebarOpen(false);
                      setShowOtherInput(false); // Reset "Other" input state
                      setMessageText('');
                      // On mobile, if a conversation is selected, hide quick replies by default
                      if (isSmallScreen) {
                        setShowQuickReplies(false);
                      }
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={otherParticipantImage}
                        alt={otherParticipantName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-gray-100"
                      />
                      {unreadMessagesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pop">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800 truncate">{otherParticipantName}</p>
                        {lastMsg && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTimestamp(lastMsg.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 truncate ${unreadMessagesCount > 0 ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                        {lastMsg ? lastMsg.content : 'No messages yet.'}
                      </p>
                      {conv.listing_title && (
                        <p className="text-xs text-gray-500 mt-1">Regarding: <span className="font-medium">{conv.listing_title}</span></p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main
          className={`
            flex flex-col flex-1 bg-white rounded-xl shadow-lg border border-gray-100
            transition-transform duration-300 ease-in-out
            md:translate-x-0 md:flex
            ${sidebarOpen ? 'hidden' : 'flex'}
            w-full
            mt-[60px]
          `}
        >
          {activeConversation ? (
            <>
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl animate-slideInUp">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Back button for mobile */}
                  <button
                    className="md:hidden p-2 text-[#775522] hover:text-[#5E441B] transition-colors"
                    onClick={() => setSidebarOpen(true)}
                    title="Back to conversations"
                  >
                    <FaChevronLeft className="text-lg" />
                  </button>
                  <Image
                    src={getParticipantImage(getParticipantEmail(activeConversation, currentUser.email))}
                    alt={getParticipantName(activeConversation)}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{getParticipantName(activeConversation)}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] sm:max-w-full">Regarding: {activeConversation.listing_title}</p>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-4 text-gray-600">
                  <button title="View Listing Details" className="p-2 hover:text-[#775522] transition-colors">
                    <FaInfoCircle className="text-base sm:text-lg" />
                  </button>
                  <button title="Archive Conversation" className="p-2 hover:text-[#775522] transition-colors">
                    <FaArchive className="text-base sm:text-lg" />
                  </button>
                  <button title="Delete Conversation" className="p-2 hover:text-red-500 transition-colors">
                    <FaTrash className="text-base sm:text-lg" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto scrollbar-hide bg-gray-50/50">
                {activeConversation.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'} animate-chat-bubble-in`}
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <div
                      className={`
                        px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-sm sm:text-base shadow-md max-w-[85%] sm:max-w-[70%] relative
                        ${msg.sender === currentUser.email
                          ? 'bg-[#775522] text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }
                      `}
                    >
                      {msg.content}
                      <div className={`text-[9px] sm:text-[10px] mt-1 flex items-center justify-${msg.sender === currentUser.email ? 'end' : 'start'} gap-1`}>
                        {formatTimestamp(msg.timestamp)}
                        {msg.sender === currentUser.email && (
                          <>
                            {msg.status === 'pending_approval' ? (
                              <span className="text-yellow-300" title="Pending approval (up to 12 hours)">
                                <FaHourglassHalf />
                              </span>
                            ) : msg.read ? (
                              <span className="text-white/70" title="Read">
                                <FaCheckCircle />
                              </span>
                            ) : (
                              <span className="text-white/70" title="Sent">
                                <FaCheckCircle />
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {msg.status === 'pending_approval' && msg.sender === currentUser.email && (
                        <p className="text-[10px] text-white/70 text-right mt-1">
                          (Will be sent after approval, max 12 hrs)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-xl flex flex-col gap-3 animate-slideInUp">
                {/* Toggle Button for Small Screens */}
                {isSmallScreen && (
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={() => setShowQuickReplies(prev => !prev)}
                      className="text-[#775522] text-sm font-medium underline focus:outline-none"
                    >
                      {showQuickReplies ? 'Hide Quick Replies' : 'Show Quick Replies'}
                    </button>
                  </div>
                )}

                {/* Predefined Questions */}
        {(!isSmallScreen || showQuickReplies) && !showOtherInput && (
  <div
    className={`w-full max-h-40 overflow-y-auto pr-1 ${
      isSmallScreen
        ? "flex flex-col gap-2"
        : "grid grid-cols-2 sm:grid-cols-3 gap-2"
    }`}
  >
    {predefinedQuestions.map((q, idx) => (
      <button
        key={idx}
        onClick={() => handlePredefinedQuestion(q)}
        className="w-full px-3 py-2 text-sm bg-gray-100 rounded-lg text-gray-700 hover:bg-[#E8CEB0]/50 hover:text-[#775522] transition-colors duration-200 border border-gray-200 text-left"
      >
        {q}
      </button>
    ))}
  </div>
)}
                {/* "Other" Input */}
                {showOtherInput && (
                  <div className="flex items-center gap-2 sm:gap-3 mt-2">
                    <textarea // Changed to textarea
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new line
                          e.preventDefault(); // Prevent default new line
                          handleSendMessage(messageText, 'pending_approval');
                        }
                      }}
                      placeholder="Type your custom message for approval..."
                      className="flex-1 border border-gray-300 px-4 py-2 sm:px-5 sm:py-3 text-gray-800 
                                 focus:outline-none focus:ring-3 focus:ring-[#775522]/30 focus:border-[#775522] transition-all duration-200
                                 placeholder-gray-500 text-sm resize-y min-h-[40px] max-h-[150px] overflow-y-auto" // Added resize-y, min-height, max-height, and overflow-y-auto
                    />
                    <button
                      onClick={() => handleSendMessage(messageText, 'pending_approval')}
                      disabled={!messageText.trim()}
                      className="bg-[#775522] hover:bg-[#5E441B] text-white p-3 rounded-full shadow-lg transition-all duration-300
                                 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send Message for Approval"
                    >
                      <FaPaperPlane className="text-base sm:text-lg" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 p-8 text-center animate-fadeIn">
              <FaInbox className="text-5xl sm:text-6xl text-[#775522]/50 mb-4 sm:mb-6" />
              <p className="text-lg sm:text-xl font-semibold mb-2">Select a conversation to begin chatting</p>
              <p className="text-sm sm:text-md max-w-sm">
                Your messages will appear here. Click on any conversation on the left to view its contents.
              </p>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}

const getParticipantEmail = (conversation: Conversation, currentUserEmail: string) => {
  return conversation.participants.find(p => p !== currentUserEmail) || '';
};