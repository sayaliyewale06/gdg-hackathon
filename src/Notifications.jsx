import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    AlertCircle,
    CheckCircle,
    FileText,
    MoreHorizontal
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    const navigate = useNavigate();

    // Mock Data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'urgent',
            title: 'Two Jobs Need Your Urgent Attention',
            description: '2 active jobs have been marked as urgent by the worker.',
            time: '5 days ago',
            unread: true,
            icon: <AlertCircle size={24} />,
            iconClass: 'icon-urgent',
            badge: 'URGENT'
        },
        {
            id: 2,
            type: 'completed',
            title: 'Mohan Das completed his assignment',
            description: 'Electrical Repair Work in Noida has been completed and is ready for review.',
            time: '1 week ago',
            unread: true,
            icon: <CheckCircle size={24} />,
            iconClass: 'icon-completed'
        },
        {
            id: 3,
            type: 'new_applicants',
            title: 'New Applicants For Driver Job',
            description: '4 new applicants have applied for the Packing & Movers job in Wakad, Pune.',
            time: '2 weeks ago',
            unread: true,
            icon: <FileText size={24} />,
            iconClass: 'icon-new-applicant'
        },
        {
            id: 4,
            type: 'urgent_req',
            title: 'Urgent Requirement in Karol Bagh, Delhi',
            description: 'A Helper job in Karol Bagh, Delhi is listed as urgent.',
            time: '3 weeks ago',
            unread: false,
            img: 'https://randomuser.me/api/portraits/men/11.jpg' // Vinod Patel mock
        },
        {
            id: 5,
            type: 'shortlisted',
            title: 'Arjun Verma Shortlisted',
            description: 'Auto Driver Arjun Verma has been added to shortlisted workers list.',
            time: '1 month ago',
            unread: false,
            img: 'https://randomuser.me/api/portraits/men/33.jpg'
        },
        {
            id: 6,
            type: 'generic',
            title: 'Deepals Yadav',
            description: 'Auto Driver Arjun Verma has been added to shortlisted workers list.', // Copy from prompt
            time: '1 month ago',
            unread: false,
            img: 'https://randomuser.me/api/portraits/men/52.jpg'
        }
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const handleClearAll = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
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
                    {/* Prompt doesn't specify a subtitle for this page, but consistent with others looks good. Omitted to match prompt exactly though. */}
                </div>
                <button className="btn-secondary" onClick={handleClearAll} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                    Clear All
                </button>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
                {notifications.map(notification => (
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
                ))}
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
