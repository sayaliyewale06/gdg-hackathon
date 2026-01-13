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

import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';

const Messages = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch Messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentUser?.uid) {
                try {
                    const allMsgs = await DB.messages.getAllForUser(currentUser.uid);

                    // Group by other user
                    const groups = {};
                    allMsgs.forEach(msg => {
                        const otherId = msg.senderId === currentUser.uid ? msg.receiverId : msg.senderId;
                        if (!groups[otherId]) groups[otherId] = [];
                        groups[otherId].push(msg);
                    });

                    // Fetch user details for each group
                    const otherUserIds = Object.keys(groups);
                    const userPromises = otherUserIds.map(uid => DB.users.get(uid));
                    const userDocs = await Promise.all(userPromises);
                    const userMap = new Map(userDocs.map(u => [u.uid, u]));

                    const convoList = otherUserIds.map(uid => {
                        const user = userMap.get(uid) || { displayName: 'Unknown', photoURL: null, role: 'User' };
                        const msgs = groups[uid];
                        const lastMsg = msgs[msgs.length - 1]; // sorted in getAllForUser
                        const unreadCount = msgs.filter(m => m.receiverId === currentUser.uid && !m.read).length;

                        return {
                            id: uid, // Use User UID as conversation ID
                            name: user.displayName || 'Unknown',
                            role: user.role || 'User',
                            lastMessage: lastMsg.text,
                            time: new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            img: user.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                            unread: unreadCount,
                            status: 'offline', // No presence system yet
                            verified: false
                        };
                    });

                    setConversations(convoList);
                    setMessages(groups);

                    if (convoList.length > 0 && !activeChatId) {
                        setActiveChatId(convoList[0].id);
                        setActiveUser(convoList[0]);
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchMessages();
    }, [currentUser]); // Note: In real app, consider polling or snapshot

    useEffect(() => {
        if (activeChatId) {
            const convo = conversations.find(c => c.id === activeChatId);
            if (convo) setActiveUser(convo);
        }
    }, [activeChatId, conversations]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChatId]);

    const handleSelectConversation = (id) => {
        setActiveChatId(id);
        // Optimistically mark read in UI (would update DB in real app)
        setConversations(prev => prev.map(c =>
            c.id === id ? { ...c, unread: 0 } : c
        ));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChatId) return;

        try {
            const msgData = {
                senderId: currentUser.uid,
                receiverId: activeChatId,
                text: newMessage,
                read: false,
                createdAt: new Date().toISOString()
            };

            await DB.messages.send(msgData);

            // Optimistic Update
            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => ({
                ...prev,
                [activeChatId]: [
                    ...(prev[activeChatId] || []),
                    { ...msgData, id: Date.now().toString(), time: timeString } // temporary ID
                ]
            }));

            // Update last message in conversation list
            setConversations(prev => prev.map(c =>
                c.id === activeChatId ? { ...c, lastMessage: newMessage, time: 'Just now' } : c
            ));

            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

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
                                <h3>{activeUser?.name}</h3>
                                <div className="chat-user-status">
                                    <span className="status-dot"></span>
                                    {activeUser?.role}
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
                            activeMessages.map((msg, index) => {
                                const isOutgoing = msg.senderId === currentUser?.uid;
                                return (
                                    <div key={msg.id || index} className={`message-group ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                                        {!isOutgoing && (
                                            <img
                                                src={activeUser?.img || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                                alt={activeUser?.name}
                                                className="message-avatar"
                                            />
                                        )}

                                        <div className="message-bubble-container">
                                            {!isOutgoing && (
                                                <div className="sender-name" style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '2px', marginLeft: '4px' }}>
                                                    {activeUser?.name}
                                                </div>
                                            )}
                                            <div className="message-bubble">
                                                {msg.text}
                                            </div>
                                            <div className="message-time">{msg.time}</div>
                                        </div>
                                    </div>
                                );
                            })
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
