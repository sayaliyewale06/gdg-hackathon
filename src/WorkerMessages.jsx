import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Search,
    MoreVertical,
    Phone,
    Paperclip,
    Image as ImageIcon,
    Smile,
    Mic,
    Send,
    Check
} from 'lucide-react';
import './WorkerMessages.css';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';

const WorkerMessages = () => {
    const { currentUser } = useAuth();
    const location = useLocation();
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

                    // Group by other user (Hirer)
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
                        const user = userMap.get(uid) || { displayName: 'Unknown', photoURL: null, role: 'Hirer' };
                        const msgs = groups[uid];
                        const lastMsg = msgs[msgs.length - 1];
                        const unreadCount = msgs.filter(m => m.receiverId === currentUser.uid && !m.read).length;

                        return {
                            id: uid,
                            name: user.displayName || 'Unknown Recruiter',
                            role: 'Recruiter', // Enforce role text
                            lastMessage: lastMsg.text,
                            time: new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            img: user.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                            unread: unreadCount,
                            status: 'online', // Mock status
                            phone: user.phone || '+91 99XXXXXXXX'
                        };
                    });

                    setConversations(convoList);
                    setMessages(groups);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchMessages();
    }, [currentUser]);

    // Handle deep linking / navigation state
    useEffect(() => {
        if (loading) return;

        if (location.state?.selectedConversation) {
            const targetId = location.state.selectedConversation;
            const existingConvo = conversations.find(c => c.id === targetId);

            if (existingConvo) {
                setActiveChatId(targetId);
                setActiveUser(existingConvo);
            } else {
                // Create temporary conversation object for new chat
                const newConvo = {
                    id: targetId,
                    name: location.state.employerName || 'Recruiter',
                    role: 'Recruiter',
                    lastMessage: 'Start a conversation',
                    time: 'Now',
                    img: location.state.employerPic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    unread: 0,
                    status: 'online',
                    phone: '+91 XXXXXXXX'
                };
                // Avoid duplicates if effect runs multiple times
                setConversations(prev => {
                    if (prev.find(c => c.id === targetId)) return prev;
                    return [newConvo, ...prev];
                });
                setActiveChatId(targetId);
                setActiveUser(newConvo);

                // Init empty messages
                setMessages(prev => ({ ...prev, [targetId]: [] }));
            }
        } else if (conversations.length > 0 && !activeChatId) {
            // Default selection if no state
            setActiveChatId(conversations[0].id);
            setActiveUser(conversations[0]);
        }
    }, [loading, location.state, conversations]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChatId]);

    const handleSelectConversation = (id) => {
        setActiveChatId(id);
        const convo = conversations.find(c => c.id === id);
        if (convo) setActiveUser(convo);

        // Optimistically mark read
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

            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => ({
                ...prev,
                [activeChatId]: [
                    ...(prev[activeChatId] || []),
                    { ...msgData, id: Date.now().toString(), time: timeString }
                ]
            }));

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
        <div className="worker-messages-layout">
            {/* Middle Column: Conversations List */}
            <div className="wm-conversations-list">
                <div className="wm-search-header">
                    <div className="wm-search-wrapper">
                        <Search size={18} className="wm-search-icon" />
                        <input type="text" placeholder="Search messages..." className="wm-search-input" />
                    </div>
                </div>

                <div className="wm-list-scroll">
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Loading...</div>
                    ) : (
                        conversations.map(convo => (
                            <div
                                key={convo.id}
                                className={`wm-convo-item ${activeChatId === convo.id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(convo.id)}
                            >
                                <div className="wm-convo-img-wrapper">
                                    <img src={convo.img} alt={convo.name} className="wm-convo-img" />
                                    {convo.status === 'online' && <span className="wm-status-dot"></span>}
                                </div>
                                <div className="wm-convo-info">
                                    <div className="wm-convo-top">
                                        <h4 className="wm-convo-name">{convo.name}</h4>
                                        <span className="wm-convo-time">{convo.time}</span>
                                    </div>
                                    <div className="wm-convo-bottom">
                                        <p className="wm-convo-preview">{convo.lastMessage}</p>
                                        {convo.unread > 0 && <span className="wm-unread-badge">{convo.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Chat Window */}
            <div className="wm-chat-window">
                {activeUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="wm-chat-header">
                            <div className="wm-chat-header-user">
                                <img src={activeUser.img} alt={activeUser.name} className="wm-header-avatar" />
                                <div>
                                    <h3 className="wm-header-name">{activeUser.name} <span className="wm-badge-online">Online</span></h3>
                                    <span className="wm-header-phone">{activeUser.phone}</span>
                                </div>
                            </div>
                            <div className="wm-header-actions">
                                <button className="wm-icon-btn"><Phone size={20} /></button>
                                <button className="wm-icon-btn"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="wm-messages-area">
                            {activeMessages.map((msg, idx) => (
                                <div key={idx} className={`wm-message-row ${msg.senderId === currentUser.uid ? 'outgoing' : 'incoming'}`}>
                                    <div className="wm-bubble">
                                        {msg.text}
                                        <span className="wm-bubble-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form className="wm-input-area" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                className="wm-input-field"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <div className="wm-input-actions">
                                <ImageIcon size={20} className="wm-action-icon" />
                                <Paperclip size={20} className="wm-action-icon" />
                                <Smile size={20} className="wm-action-icon" />
                            </div>
                            <button type="submit" className="wm-send-btn">
                                Send <Send size={16} style={{ marginLeft: '6px' }} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="wm-no-chat">
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>

            {/* Far Right: Tips Sidebar */}
            <div className="wm-tips-sidebar">
                <div className="wm-tips-card">
                    <h4 className="wm-tips-title">Tip for Messaging</h4>
                    <ul className="wm-tips-list">
                        <li>
                            <Check size={14} className="wm-check-icon" />
                            Respond to recruiter messages promptly
                        </li>
                        <li>
                            <Check size={14} className="wm-check-icon" />
                            Discuss job details clearly
                        </li>
                        <li>
                            <Check size={14} className="wm-check-icon" />
                            Keep communication professional
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WorkerMessages;
