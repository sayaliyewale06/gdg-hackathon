import React from 'react';
import './HirerDashboard.css';

const RecentHiresSidebar = () => {
    // Dummy data for Recent Hires
    const recentHires = [
        { id: 1, name: 'Ramesh Yadav', role: 'Electrician', rating: 4.5, phone: '+91 9067 65****', pic: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 2, name: 'Suresh Kumar', role: 'Plumber', rating: 5.0, phone: '+91 9125 45****', pic: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { id: 3, name: 'Mohan Das', role: 'Electrician', rating: 4.8, phone: '+91 9665 32****', pic: 'https://randomuser.me/api/portraits/men/62.jpg' },
        { id: 4, name: 'Vinod Patel', role: 'Mason', rating: 4.5, phone: '+91 9876 54****', pic: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { id: 5, name: 'Raju Singh', role: 'Painter', rating: 4.2, phone: '+91 8888 12****', pic: 'https://randomuser.me/api/portraits/men/22.jpg' },
        { id: 6, name: 'Anita Desai', role: 'Cleaner', rating: 4.9, phone: '+91 7777 99****', pic: 'https://randomuser.me/api/portraits/women/44.jpg' },
    ];

    return (
        <aside className="right-sidebar-scrollable">
            <h3 className="right-sidebar-title">Recent Hires</h3>
            <div className="recent-hires-list">
                {recentHires.map(worker => (
                    <div className="worker-card-compact" key={worker.id}>
                        <div className="worker-card-top">
                            <img src={worker.pic} alt={worker.name} className="worker-avatar-small" />
                            <div className="worker-info-compact">
                                <h4>{worker.name}</h4>
                                <div className="worker-role">{worker.role} <span className="star">⭐</span></div>
                                <div className="worker-phone">{worker.phone}</div>
                            </div>
                            <button className="view-profile-btn">View Profile</button>
                        </div>
                        <div className="worker-card-bottom">
                            <a href="#" className="contact-link">• Contact</a>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default RecentHiresSidebar;
