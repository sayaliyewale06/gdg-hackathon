import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';
import './HirerDashboard.css';

const RecentHiresSidebar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [recentHires, setRecentHires] = useState([]);

    useEffect(() => {
        const fetchHires = async () => {
            if (currentUser?.uid) {
                try {
                    // Fetch applications where status is 'accepted' or 'completed'
                    const applications = await DB.applications.getByHirer(currentUser.uid);
                    const hired = applications.filter(app => ['accepted', 'completed'].includes(app.status));

                    // We need to map this to the UI view. 
                    // Ideally we fetch the worker details too, but we might have denormalized basic info
                    setRecentHires(hired);
                } catch (error) {
                    console.error("Error fetching recent hires:", error);
                }
            }
        };
        fetchHires();
    }, [currentUser]);

    return (
        <aside className="right-sidebar-scrollable">
            <h3 className="right-sidebar-title">Recent Hires</h3>
            <div className="recent-hires-list">
                {recentHires.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        No recent hires yet.
                    </div>
                ) : (
                    recentHires.map(hire => (
                        <div className="worker-card-compact" key={hire.id}>
                            <div className="worker-card-top">
                                <img
                                    src={hire.workerPic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                    alt={hire.workerName}
                                    className="worker-avatar-small"
                                />
                                <div className="worker-info-compact">
                                    <h4>{hire.workerName || "Worker"}</h4>
                                    <div className="worker-role">{hire.jobTitle || "Job"} <span className="star">⭐</span></div>
                                    <div className="worker-phone">Status: {hire.status}</div>
                                </div>
                                <button className="view-profile-btn">View</button>
                            </div>
                            <div className="worker-card-bottom">
                                <a href="#" className="contact-link">• Contact</a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
};

export default RecentHiresSidebar;
