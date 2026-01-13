import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    MoreVertical,
    Phone,
    ChevronRight,
    Send,
    Check
} from 'lucide-react';
import './Messages.css';

const Messages = () => {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Mock Conversations Data
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: 'Arjun Verma',
            role: 'Auto Driver',
            lastMessage: 'Can you share the pickup details please?',
            time: '3 min ago',
            unread: 2,
            img: 'https://randomuser.me/api/portraits/men/33.jpg',
            status: 'online',
            verified: true
        },
        {
            id: 2,
            name: 'Ramesh Yadav',
            role: 'Construction Laborer',
            lastMessage: 'Yes, I can come tomorrow. What time should...',
            time: '15 min ago',
            unread: 2,
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
            status: 'offline',
            verified: false // example
        },
        {
            id: 3,
            name: 'Mohan Das',
            role: 'Electrician',
            lastMessage: 'My current job will be done tomorrow. I will...',
            time: '20 min ago',
            unread: 0,
            img: 'https://randomuser.me/api/portraits/men/62.jpg',
            status: 'offline'
        },
        {
            id: 4,
            name: 'Anita Sharma',
            role: 'Employer',
            lastMessage: 'Can you recommend a good plumber?',
            time: 'Yesterday',
            unread: 0,
            img: 'https://randomuser.me/api/portraits/women/44.jpg',
            status: 'online'
        },
        {
            id: 5,
            name: 'Vinod Patel',
            role: 'Mason',
            lastMessage: 'Yes, I have all the required tools for the job.',
            time: '2 days ago',
            unread: 0,
            img: 'https://randomuser.me/api/portraits/men/11.jpg',
            status: 'offline'
        },
        {
            id: 6,
            name: 'Rahul Singh',
            role: 'Painter',
            lastMessage: "I'll arrive by 8 AM for the painting job.",
            time: '4 days ago',
            unread: 0,
            img: 'https://randomuser.me/api/portraits/men/24.jpg',
            status: 'offline'
        }
    ]);

    // Active Chat Messages (Specific for Arjun, generic for others)
    const [activeChatId, setActiveChatId] = useState(1);

    const [messages, setMessages] = useState({
        1: [ // Arjun's messages
            { id: 1, sender: 'other', text: 'Hi Arjun, we need goods to be transported from sector 21 to Hinjewadi tomorrow. Are you interested?', time: '9:10 AM' },
            { id: 2, sender: 'me', text: 'Yes, I am interested. What time should I reach sector 21?', time: '9:15 AM' },
            { id: 3, sender: 'other', text: 'You should reach by 10:10AM. The goods need to be delivered by evening.', time: '9:16 AM' },
            { id: 4, sender: 'me', text: 'Can you share the pickup details please?', time: '9:15 AM' } // Timestamp mismatch in user prompt (9:15 vs 9:16 prev), corrected order for logic or kept exact? Kept exact time strings from prompt but logical order.
        ]
    });

    const [newMessage, setNewMessage] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChatId]);

    const handleSelectConversation = (id) => {
        setActiveChatId(id);
        // Mark as read
        setConversations(prev => prev.map(c =>
            c.id === id ? { ...c, unread: 0 } : c
        ));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setMessages(prev => ({
            ...prev,
            [activeChatId]: [
                ...(prev[activeChatId] || []),
                { id: Date.now(), sender: 'me', text: newMessage, time: timeString }
            ]
        }));
        setNewMessage('');
    };

    const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0];
    const activeMessages = messages[activeChatId] || [];

    return (
        <main className="center-content-scrollable">
            {/* Breadcrumbs */}
            <div className="breadcrumb" style={{ marginBottom: '12px' }}>
                <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Messages</span>
            </div>

            <h1 className="page-title" style={{ marginBottom: '20px' }}>Messages</h1>

            <div className="messages-container">
                {/* LEFT SIDEBAR: LIST */}
                <div className="conversations-sidebar">
                    <div className="search-bar-container">
                        <div className="search-input-wrapper">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Your feed messaget"
                                className="messages-search-input"
                            />
                        </div>
                    </div>

                    <div className="conversations-list">
                        {conversations.map(convo => (
                            <div
                                key={convo.id}
                                className={`conversation-item ${activeChatId === convo.id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(convo.id)}
                            >
                                <div className="convo-avatar-container">
                                    <img src={convo.img} alt={convo.name} className="convo-avatar" />
                                </div>
                                <div className="convo-details">
                                    <div className="convo-header">
                                        <div className="convo-name">
                                            {convo.name}
                                            {convo.unread > 0 && <span className="unread-dot-inline" />} {/* Redundant if badge used */}
                                        </div>
                                        <span className="convo-time">{convo.time}</span>
                                    </div>
                                    <div className="convo-role">{convo.role}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="convo-message-preview">{convo.lastMessage}</div>
                                        {convo.unread > 0 && (
                                            <div className="unread-badge">{convo.unread}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDEBAR: CHAT */}
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-user">
                            {/* In header only show text details often, or avatar too? Prompt screenshot shows Name + Status + Icons */}
                            <div className="chat-header-details">
                                <h3>{activeConversation.name}</h3>
                                <div className="chat-user-status">
                                    <span className="status-dot"></span>
                                    {activeConversation.role}
                                </div>
                            </div>
                        </div>
                        <div className="chat-actions">
                            <div className="chat-action-btn"><Phone size={20} /></div>
                            <div className="chat-action-btn"><MoreVertical size={20} /></div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="messages-list">
                        {activeMessages.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>No messages yet.</p>
                        ) : (
                            activeMessages.map((msg, index) => (
                                <div key={msg.id} className={`message-group ${msg.sender === 'me' ? 'outgoing' : 'incoming'}`}>
                                    {msg.sender !== 'me' && (
                                        <img src={activeConversation.img} alt="Sender" className="message-avatar" />
                                    )}
                                    {msg.sender === 'me' && (
                                        /* In a real app user avatar here, or just bubble. User prompt shows avatars for incoming only usually, outgoing just bubble. */
                                        <div style={{ width: '0px' }}></div>
                                    )}

                                    <div className="message-bubble-container">
                                        <div className="message-bubble">
                                            {msg.text}
                                        </div>
                                        <div className="message-time">{msg.time}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form className="message-input-area" onSubmit={handleSendMessage}>
                        <textarea
                            className="message-textarea"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <button type="submit" className="btn-send">Send</button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Messages;
