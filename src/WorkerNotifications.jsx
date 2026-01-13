import React, { useState } from 'react';
import './WorkerDashboard.css';
import {
    FaClipboardList,
    FaMoneyBillWave,
    FaCommentDots,
    FaCheckCircle,
    FaStar,
    FaBuilding,
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

const WorkerNotifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'application',
            title: 'Your job application for "Helper Required" has been accepted',
            subtitle: 'Job Status Update: Baner',
            time: '11 minutes ago',
            read: false,
            icon: <FaClipboardList />
        },
        {
            id: 2,
            type: 'earnings',
            title: '₹1,600 has been credited to your account for the Pipe Repair Job.',
            subtitle: 'Earnings Update: Hinjewadi',
            time: '24 minutes ago',
            read: false,
            icon: <FaMoneyBillWave />
        },
        {
            id: 3,
            type: 'message',
            title: 'Ajay Patil has messaged you regarding the Electrician Needed job.',
            subtitle: 'New Message: Sector 21, Noida',
            time: '1 hour ago',
            read: false,
            icon: <FaCommentDots />
        },
        {
            id: 4,
            type: 'completed',
            title: 'A Packing Helper job has been marked as completed.',
            subtitle: 'Job Status Update: Baner',
            time: '3 hours ago',
            read: true,
            icon: <FaCheckCircle />
        },
        {
            id: 5,
            type: 'review',
            title: 'You have received a new review from Nishant Joshi.',
            subtitle: 'New Review',
            time: '5 hours ago',
            read: true,
            icon: <FaStar />,
            rating: 5
        },
        {
            id: 6,
            type: 'update',
            title: 'The Mason Work job in Hinjewadi is now completed.',
            subtitle: 'Job Status Update: Hinjewadi',
            time: '7 hours ago',
            read: true,
            icon: <FaBuilding />
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'application': return '#F5A623'; // Orange
            case 'earnings': return '#7FB06F'; // Green
            case 'message': return '#5D7E85'; // Teal
            case 'completed': return '#4A90E2'; // Blue
            case 'review': return '#F8E71C'; // Yellow
            default: return '#999';
        }
    };

    const getTypeBg = (type) => {
        switch (type) {
            case 'application': return '#FEF3E6';
            case 'earnings': return '#E/F4E8';
            case 'message': return '#EBF2F3';
            case 'completed': return '#E8F1FC';
            case 'review': return '#FEFCE8';
            default: return '#F5F5F5';
        }
    };

    return (
        <div className="notifications-page">
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>Notifications</h5>
                </div>
            </div>

            <div className="notif-header-row">
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Notifications</h1>
                    <p style={{ color: 'var(--secondary-text)', marginTop: '8px' }}>
                        Stay up-to-date with the latest notifications about your jobs and earnings.
                    </p>
                </div>
                <div className="mark-all-check">
                    <input type="checkbox" id="markAll" onChange={markAllAsRead} />
                    <label htmlFor="markAll">Mark all as read</label>
                </div>
            </div>

            <div className="notif-layout-grid">
                {/* Left: Notification List */}
                <div className="notif-list-col">
                    <div className="notif-list-container">
                        {notifications.map((notif) => (
                            <div className={`notif-card ${!notif.read ? 'unread' : ''}`} key={notif.id}>
                                <div className="notif-icon-box" style={{
                                    background: getTypeBg(notif.type),
                                    color: getTypeColor(notif.type)
                                }}>
                                    {notif.icon}
                                </div>
                                <div className="notif-content">
                                    <div className="notif-title-row">
                                        <h3 className="notif-title">{notif.title}</h3>
                                        <div className="notif-time">{notif.time}</div>
                                    </div>
                                    <div className="notif-sub-row">
                                        <div className="notif-subtitle">
                                            {notif.subtitle}
                                            {notif.rating && (
                                                <span className="notif-stars">
                                                    {[...Array(notif.rating)].map((_, i) => <FaStar key={i} color="#F4B400" size={12} />)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="notif-action">
                                    <button className={`mark-read-btn ${notif.read ? 'read' : ''}`} onClick={() => markAsRead(notif.id)}>
                                        {notif.read ? 'Read' : 'Mark as read'} <FaChevronDown size={10} style={{ marginLeft: '6px' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination-row">
                        <button className="page-btn"><FaChevronLeft size={10} /></button>
                        <span className="page-num active">1</span>
                        <span className="page-num">2</span>
                        <span className="page-num">3</span>
                        <button className="page-btn"><FaChevronRight size={10} /></button>
                    </div>
                </div>

                {/* Right: Sidebar Tips */}
                <div className="notif-sidebar-col">
                    <div className="tips-card">
                        <h3>Tip for Notifications</h3>
                        <ul className="tips-list">
                            <li><span className="tip-icon">✨</span> Mark notifications as read to keep track</li>
                            <li><span className="tip-icon">🔔</span> Check for job updates and notifings</li>
                            <li><span className="tip-icon">💬</span> Respond to messages from recruiters</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerNotifications;
