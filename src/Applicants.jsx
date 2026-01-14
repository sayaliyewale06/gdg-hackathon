import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
    MapPin,
    ChevronRight,
    Star,
    Phone,
    MessageCircle, // Using MessageCircle for WhatsApp/Message
    Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Applicants.css';

import { DB } from './lib/db';

const Applicants = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            if (currentUser?.uid) {
                try {
                    // Fetch applications received by this hirer
                    const apps = await DB.applications.getByHirer(currentUser.uid);

                    // Hydrate with worker details and job details
                    const fullApps = await Promise.all(apps.map(async (app) => {
                        const [worker, job] = await Promise.all([
                            DB.users.get(app.workerId),
                            DB.jobs.get(app.jobId)
                        ]);
                        return {
                            ...app,
                            workerName: worker?.displayName || 'Unknown Worker',
                            workerPic: worker?.photoURL,
                            workerRole: worker?.role,
                            workerLocation: worker?.location,
                            workerRating: worker?.rating,
                            workerPhone: worker?.phone,
                            jobTitle: job?.title || 'Unknown Job',
                            jobWage: job?.wage
                        };
                    }));

                    setApplications(fullApps);
                } catch (error) {
                    console.error("Error fetching applications:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchApplications();
    }, [currentUser]);

    const handleAccept = async (appId) => {
        try {
            await DB.applications.updateStatus(appId, 'accepted');
            // Optimistic Update
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'accepted' } : a));
            toast.success("Worker accepted!");
        } catch (error) {
            console.error("Error accepting worker:", error);
            toast.error("Failed to accept worker.");
        }
    };

    const handleReject = async (appId) => {
        const confirmReject = window.confirm("Are you sure you want to reject this applicant?");
        if (!confirmReject) return;

        try {
            await DB.applications.updateStatus(appId, 'rejected');
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
            toast.success("Worker rejected.");
        } catch (error) {
            console.error("Error rejecting worker:", error);
            toast.error("Failed to reject worker.");
        }
    };

    const [filters, setFilters] = useState({
        skill: 'All Skills',
        location: 'All Locations',
        minSalary: 0,
        maxSalary: 5000 // Increased default max range
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Derived state for filtered applications
    const filteredApplications = applications.filter(app => {
        // 1. Skill Filter (checks Job Title or Worker Role)
        if (filters.skill !== 'All Skills') {
            const skill = filters.skill.toLowerCase();
            const titleMatches = app.jobTitle?.toLowerCase().includes(skill);
            const roleMatches = app.workerRole?.toLowerCase().includes(skill);
            if (!titleMatches && !roleMatches) return false;
        }

        // 2. Location Filter
        if (filters.location !== 'All Locations') {
            const loc = filters.location.toLowerCase();
            const workerLoc = app.workerLocation?.toLowerCase() || '';
            if (!workerLoc.includes(loc)) return false;
        }

        // 3. Salary/Wage Filter
        const wage = parseInt(app.jobWage) || 0;
        const min = parseInt(filters.minSalary) || 0;
        const max = parseInt(filters.maxSalary) || 999999;

        if (wage < min || wage > max) return false;

        return true;
    });

    const clearFilters = () => {
        setFilters({
            skill: 'All Skills',
            location: 'All Locations',
            minSalary: 0,
            maxSalary: 5000
        });
    };

    return (
        <main className="center-content-scrollable">
            {/* Breadcrumbs */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Applicants</span>
            </div>

            {/* Header */}
            <div className="applicants-header-section">
                <h1 className="page-title">Applicants</h1>
                <p className="page-subtitle">Review and shortlist applicants for your job posts.</p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <select
                    name="skill"
                    className="filter-select"
                    value={filters.skill}
                    onChange={handleFilterChange}
                >
                    <option>All Skills</option>
                    <option>Masonry</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Carpentry</option>
                    <option>Painting</option>
                </select>

                <select
                    name="location"
                    className="filter-select"
                    value={filters.location}
                    onChange={handleFilterChange}
                >
                    <option>All Locations</option>
                    <option>Pune</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Bangalore</option>
                </select>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Min: ₹</span>
                    <input
                        type="number"
                        name="minSalary"
                        className="salary-input"
                        value={filters.minSalary}
                        onChange={handleFilterChange}
                        placeholder="0"
                    />
                </div>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Max: ₹</span>
                    <input
                        type="number"
                        name="maxSalary"
                        className="salary-input"
                        value={filters.maxSalary}
                        onChange={handleFilterChange}
                        placeholder="Max"
                    />
                </div>

                <div className="filter-actions">
                    <span className="clear-filters" onClick={clearFilters} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        Clear Filters
                    </span>
                    <button className="btn-filter" style={{ opacity: 0.7, cursor: 'default' }}>Filter</button>
                </div>
            </div>

            {/* List */}
            <h2 className="applicants-list-header">Applications ({filteredApplications.length})</h2>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading applications...</div>
            ) : (
                <div className="applicants-list">
                    {filteredApplications.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                            {applications.length > 0 ? 'No applicants match your filters.' : 'No applications received yet.'}
                        </div>
                    ) : (
                        filteredApplications.map(app => (
                            <div className="applicant-card" key={app.id} style={{ borderLeft: app.status === 'accepted' ? '4px solid #4CAF50' : 'none' }}>
                                {/* 1. Image */}
                                <div className="applicant-img-container">
                                    <img
                                        src={app.workerPic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                        alt={app.workerName}
                                        className="applicant-img"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/worker-profile/${app.workerId}`)}
                                    />
                                </div>

                                {/* 2. Main Info */}
                                <div className="applicant-main-info">
                                    <h3
                                        className="applicant-name"
                                        style={{ cursor: 'pointer', color: '#5a8a8f' }} // Add color to indicate clickability
                                        onClick={() => navigate(`/worker-profile/${app.workerId}`)}
                                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                    >
                                        {app.workerName}
                                    </h3>
                                    <p className="applicant-role">Applied for: <strong>{app.jobTitle}</strong></p>
                                    <div className="applicant-location">
                                        <MapPin size={14} /> {app.workerLocation || "Unknown"}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* 3. Details (Rating) */}
                                <div className="applicant-details">
                                    <div className="rating-row">
                                        <span className="stars">{'★'.repeat(Math.round(app.workerRating || 0))}</span>
                                        <span style={{ color: '#444' }}>{app.workerRating || 'New'}</span>
                                    </div>
                                    <div className="status-badge" style={{
                                        marginTop: '10px',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: app.status === 'accepted' ? '#e8f5e9' : '#fff3e0',
                                        color: app.status === 'accepted' ? '#2e7d32' : '#e65100',
                                        fontSize: '0.8rem',
                                        display: 'inline-block'
                                    }}>
                                        Status: {app.status || 'Pending'}
                                    </div>
                                </div>

                                {/* 4. Wages & Contact */}
                                <div className="applicant-wages-contact">
                                    <div className="wage-row">
                                        Asking: ₹{app.jobWage || 'NA'}<span className="wage-unit">/day</span>
                                    </div>
                                    <div className="contact-row">
                                        <Phone size={16} />
                                        <span>{app.workerPhone || "No Phone"}</span>
                                    </div>
                                </div>

                                {/* 5. Action */}
                                <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                    <button
                                        className="btn-shortlist"
                                        style={{ background: '#5a8a8f', color: 'white', border: 'none', marginBottom: '4px' }}
                                        onClick={() => navigate(`/worker-profile/${app.workerId}`)}
                                    >
                                        View Profile
                                    </button>

                                    {app.status !== 'accepted' && (
                                        <button
                                            className="btn-shortlist"
                                            style={{ background: '#4CAF50', color: 'white', border: 'none' }}
                                            onClick={() => handleAccept(app.id)}
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {app.status !== 'rejected' && app.status !== 'accepted' && (
                                        <button
                                            className="btn-shortlist"
                                            style={{ background: '#FF5252', color: 'white', border: 'none' }}
                                            onClick={() => handleReject(app.id)}
                                        >
                                            Reject
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

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

export default Applicants;
