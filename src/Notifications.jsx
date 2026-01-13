import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    AlertCircle,
    CheckCircle,
    FileText,
    MoreHorizontal
} from 'lucide-react';
import './Notifications.css';

import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';

const Notifications = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (currentUser?.uid) {
                try {
                    const data = await DB.notifications.getByUser(currentUser.uid);
                    // Map generic data to UI format
                    const formatted = data.map(n => ({
                        id: n.id,
                        type: n.type,
                        title: n.title,
                        description: n.subtitle, // Using subtitle as description
                        time: new Date(n.createdAt).toLocaleDateString(), // Simple date for now
                        unread: !n.read,
                        // Determine icon based on type
                        icon: getIconForType(n.type),
                        iconClass: `icon-${n.type}`,
                        badge: n.type === 'urgent' ? 'URGENT' : null,
                        img: n.data?.senderPic || null // if we store senderPic in data
                    }));
                    setNotifications(formatted);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchNotifications();
    }, [currentUser]);

    const getIconForType = (type) => {
        switch (type) {
            case 'urgent': return <AlertCircle size={24} />;
            case 'completed': return <CheckCircle size={24} />;
            case 'application': return <FileText size={24} />;
            default: return <FileText size={24} />;
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await DB.notifications.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, unread: false } : n
            ));
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };

    const handleClearAll = async () => {
        if (currentUser?.uid) {
            try {
                await DB.notifications.markAllRead(currentUser.uid);
                setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            } catch (error) {
                console.error("Error clearing all:", error);
            }
        }
    };

    return (
        <main className="center-content-scrollable">
            {/* Breadcrumbs */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Notifications</span>
            </div>

            {/* Header */}
            <div className="notifications-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                </div>
                <button className="btn-secondary" onClick={handleClearAll} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                    Clear All
                </button>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading notifications...</div>
                ) : (
                    <>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No notifications found.</div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-card ${notification.unread ? 'unread' : ''}`}
                                >
                                    {/* Icon/Image */}
                                    <div className={`notification-icon-container ${notification.iconClass || ''}`}>
                                        {notification.img ? (
                                            <img src={notification.img} alt="Profile" className="notification-img" />
                                        ) : (
                                            notification.icon
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="notification-content">
                                        <div className="notification-header-row">
                                            <h3 className="notification-title">
                                                {notification.badge && (
                                                    <span className="badge-urgent"><AlertCircle size={12} /> {notification.badge}</span>
                                                )}
                                                {notification.title}
                                            </h3>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="notification-time">{notification.time}</span>
                                                <button className="menu-trigger"><MoreHorizontal size={18} /></button>
                                            </div>
                                        </div>

                                        <p className="notification-description">{notification.description}</p>

                                        {notification.unread && (
                                            <div className="notification-actions">
                                                <button
                                                    className="btn-mark-read"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    Mark as Read
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">4</button>
                <button className="page-btn">5</button>
                <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
        </main>
    );
};

export default Notifications;
