import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    MapPin,
    Filter,
    Phone,
    Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './ShortlistedWorkers.css';

import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';

const ShortlistedWorkers = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShortlisted = async () => {
            if (currentUser?.uid) {
                try {
                    const allApps = await DB.applications.getByHirer(currentUser.uid);
                    // Filter for accepted/shortlisted applications
                    // Assuming 'accepted' means shortlisted/hired for now. 
                    // If we have a distinct 'shortlisted' status, we should use that.
                    // Based on schema, we have 'pending', 'accepted', 'rejected', 'completed'.
                    // 'accepted' seems to fit "Shortlisted/Hired".
                    const shortlisted = allApps.filter(app => app.status === 'accepted');

                    // We might need to fetch worker details if not fully denormalized
                    // ApplicationSchema has workerName, workerPic.
                    // If we need more (rating, skills), we might need to fetch User.
                    // For now, let's Map what we have in ApplicationSchema.

                    // To get Rating and Skills, we SHOULD fetch the worker profile.
                    // Let's do a follow-up fetch for unique worker IDs.
                    const workerIds = [...new Set(shortlisted.map(a => a.workerId))];
                    const workerPromises = workerIds.map(uid => DB.users.get(uid));
                    const workerDocs = await Promise.all(workerPromises);
                    const workerMap = new Map(workerDocs.map(u => [u.uid, u]));

                    const combinedData = shortlisted.map(app => {
                        const workerProfile = workerMap.get(app.workerId);
                        return {
                            id: app.id,
                            appId: app.id,
                            ...workerProfile, // spread user data (skills, cleaning rating etc)
                            // prioritize app specific data if any
                            status: app.status,
                            jobTitle: app.jobTitle,
                            wage: 0 // We might need to fetch Job to get wage, or store it in App
                        };
                    });

                    setWorkers(combinedData);
                } catch (error) {
                    console.error("Error fetching shortlisted:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchShortlisted();
    }, [currentUser]);

    const handleAssign = (name) => {
        // In a real app, this would update DB to 'hired' or move to another collection
        // Simulating "hired" by removing from shortlist
        setWorkers(prev => prev.filter(w => w.displayName !== name));
        toast.success(`Job assigned to ${name} successfully! Check "Ongoing Jobs" for updates.`);
    };

    const handleRemove = async (id, name) => {
        try {
            await DB.applications.updateStatus(id, 'rejected');
            setWorkers(prev => prev.filter(w => w.id !== id));
            toast.success(`Removed ${name} from shortlisted candidates.`);
        } catch (error) {
            console.error("Error removing worker:", error);
            toast.error("Failed to remove worker.");
        }
    };

    const handleContact = (name) => {
        // In a real app, this would select the conversation with this user
        // For now, simple navigation to messages
        navigate('/hire-dashboard/messages');
    };

    // Helper to get skill badge color
    const getSkillColor = (index) => {
        const colors = ['orange', 'blue', 'green', 'purple'];
        return colors[index % colors.length];
    };

    return (
        <main className="center-content-scrollable">
            {/* Breadcrumbs */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Shortlisted Workers</span>
            </div>

            {/* Header */}
            <div className="applicants-header-section" style={{ marginBottom: '24px' }}>
                <h1 className="page-title">Shortlisted Workers</h1>
                <p className="page-subtitle">Review and manage your shortlisted worker candidates.</p>
            </div>

            {/* Filter Bar */}
            <div className="shortlist-filter-bar">
                <select className="filter-select">
                    <option>All Skills</option>
                    <option>Masonry</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                </select>

                <select className="filter-select">
                    <option>All Locations</option>
                    <option>Pune</option>
                    <option>Mumbai</option>
                </select>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Min: ₹</span>
                    <input type="number" defaultValue={0} className="salary-input" />
                </div>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Max: ₹</span>
                    <input type="number" defaultValue={2000} className="salary-input" />
                </div>

                <div className="filter-actions">
                    <span className="clear-filters">Clear Filters</span>
                    <button className="btn-filter"> - Filter</button>
                </div>
            </div>

            {/* List */}
            <h2 className="shortlist-list-header">Shortlisted Workers ({workers.length})</h2>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : (
                <div className="shortlist-list">
                    {workers.map(worker => (
                        <div className="shortlist-card" key={worker.id}>
                            {/* 1. Image */}
                            <div className="shortlist-img-container">
                                <img
                                    src={worker.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                    alt={worker.displayName}
                                    className="shortlist-img"
                                />
                            </div>

                            {/* 2. Main Info */}
                            <div className="shortlist-info">
                                <h3 className="shortlist-name">{worker.displayName || "Worker"}</h3>
                                <p className="shortlist-role">{worker.jobTitle || worker.role || "Worker"}</p>
                                <div className="shortlist-location">
                                    <MapPin size={14} /> {worker.location || "Pune"}
                                </div>
                            </div>

                            {/* 3. Details */}
                            <div className="shortlist-details">
                                <div className="shortlist-rating">
                                    <span className="stars-gold">{'★'.repeat(Math.round(worker.rating || 0))}</span>
                                    <span style={{ marginLeft: '4px' }}>{/* spacing */}</span>
                                    <span>{worker.rating || 0}</span>
                                </div>
                                <div className="shortlist-exp-wage">
                                    <strong>₹{worker.wage || 0}/day</strong>
                                    <span style={{ color: '#ccc' }}>|</span>
                                    <span>{worker.experience || 0} Years Experience</span>
                                </div>
                                <div className="shortlist-skills">
                                    {(worker.skills || ['General']).map((skill, idx) => (
                                        <span key={idx} className={`skill-badge ${getSkillColor(idx)}`}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Actions */}
                            <div className="shortlist-actions">
                                <button className="btn-action btn-assign" onClick={() => handleAssign(worker.displayName)}>Assign Job</button>
                                <button className="btn-action btn-remove" onClick={() => handleRemove(worker.id, worker.displayName)}>Remove</button>
                                <button className="btn-action btn-contact" onClick={() => handleContact(worker.displayName)}>Contact</button>

                                <div className="icon-phone-call" title="Call Worker">
                                    <Phone size={18} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {workers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            No shortlisted workers found.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {workers.length > 0 && (
                <div className="pagination">
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn">4</button>
                    <button className="page-btn">5</button>
                    <button className="page-btn">6</button>
                    <button className="page-btn"><ChevronRight size={16} /></button>
                </div>
            )}
        </main>
    );
};

export default ShortlistedWorkers;
