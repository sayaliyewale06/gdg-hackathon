import React, { useState, useEffect } from 'react';
import './WorkerDashboard.css';
import { DB } from './lib/db';
import { seedDatabase } from './lib/seed';
import { useAuth } from './context/AuthContext';
import { FaChevronDown, FaSearch, FaBriefcase, FaTruck, FaBolt, FaCar, FaMapMarkerAlt, FaStar, FaUserFriends, FaClock, FaCheckCircle, FaPaintRoller, FaHammer, FaWrench } from 'react-icons/fa';

const WorkerActiveJobs = () => {
    const { currentUser } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveJobs = async () => {
            if (currentUser?.uid) {
                try {
                    // Fetch applications where worker is current user
                    const myApplications = await DB.applications.getByWorker(currentUser.uid);

                    // Filter for 'accepted' or 'in_progress' or 'completed'
                    const activeApps = myApplications.filter(a =>
                        ['accepted', 'in_progress', 'completed'].includes(a.status)
                    );

                    // Fetch job details for each active application
                    // TODO: Optimize by fetching only needed jobs or using a map from prev context
                    // For now, simple parallel fetch
                    const jobPromises = activeApps.map(async (app) => {
                        const job = await DB.jobs.get(app.jobId);
                        return { ...job, applicationStatus: app.status, applicationId: app.id };
                    });

                    const activeJobsData = await Promise.all(jobPromises);

                    // Sort: In Progress first, then Accepted, then Completed
                    const sortedJobs = activeJobsData.sort((a, b) => {
                        const statusOrder = { 'in_progress': 0, 'accepted': 1, 'completed': 2 };
                        return statusOrder[a.applicationStatus] - statusOrder[b.applicationStatus];
                    });

                    setJobs(sortedJobs);

                } catch (error) {
                    console.error("Error fetching active jobs:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchActiveJobs();
    }, [currentUser]);

    // Helper to get icon based on category
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'driver': return <FaCar />;
            case 'electrician': return <FaBolt />;
            case 'plumber': return <FaWrench />;
            case 'mason': return <FaHammer />;
            case 'painter': return <FaPaintRoller />;
            default: return <FaBriefcase />;
        }
    };

    return (
        <div className="earnings-container">
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>Active Jobs</h5>
                </div>
            </div>

            <div className="section-heading-row" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>Active Jobs</h1>
                {jobs.length === 0 && !loading && (
                    <button
                        onClick={seedDatabase}
                        style={{
                            background: '#d98347',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Seed Dummy Data
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="aj-filter-bar">
                <div className="aj-filter-group">
                    <label>All</label>
                    <FaChevronDown size={10} />
                </div>
                <div className="aj-separator"></div>
                <div className="aj-filter-group">
                    <label>All Locations</label>
                    <FaChevronDown size={10} />
                </div>
                <div className="aj-separator"></div>
                <div className="aj-filter-group">
                    <label>Sort by <strong>Newest</strong></label>
                    <FaChevronDown size={10} />
                </div>
                <div className="aj-search-wrapper">
                    <FaSearch color="#999" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>

            {/* Job List */}
            <div className="aj-jobs-list">
                {loading ? (
                    <div style={{ color: '#555', padding: '20px' }}>Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div style={{ color: '#888', padding: '20px' }}>No active jobs found.</div>
                ) : (
                    jobs.map((job) => (
                        <div className="aj-job-row" key={job.id}>
                            {/* Left Section: Icon + Details */}
                            <div className="aj-row-left">
                                <div className="aj-icon-large">
                                    {getCategoryIcon(job.category)}
                                </div>
                                <div className="aj-details-col">
                                    <h3 className="aj-row-title">{job.title}</h3>
                                    <div className="aj-row-loc">
                                        <FaMapMarkerAlt size={12} /> {job.location}
                                    </div>
                                    <div className="aj-row-desc">
                                        {job.description || "General Helper work required"}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section: Price + Status */}
                            <div className="aj-row-mid">
                                <div className="aj-wage-text">₹{job.wage}<span className="per-day">/day</span></div>
                                <div className="aj-status-group">
                                    {job.applicationStatus === 'in_progress' ? (
                                        <span className="aj-badge progress">In Progress</span>
                                    ) : job.applicationStatus === 'completed' ? (
                                        <span className="aj-badge completed" style={{ backgroundColor: '#e6fffa', color: '#047857' }}>Completed</span>
                                    ) : (
                                        <span className="aj-badge urgent" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>Accepted</span>
                                    )}
                                </div>
                                <div className="aj-meta-info">
                                    {job.applicationStatus === 'in_progress' ? (
                                        <span><FaClock size={10} /> Active Now</span>
                                    ) : (
                                        <span><FaCheckCircle size={10} /> {job.applicationStatus === 'accepted' ? 'Ready to Start' : 'Job Done'}</span>
                                    )}
                                </div>
                            </div>

                            {/* Right Section: Recruiter + Action */}
                            <div className="aj-row-right">
                                <div className="aj-recruiter-profile">
                                    <img src={job.hirerPic || "https://randomuser.me/api/portraits/men/32.jpg"} alt={job.hirerName} className="aj-recruiter-pic" />
                                    <div className="aj-recruiter-info">
                                        <div className="aj-recruiter-name">{job.hirerName || 'Unknown'}</div>
                                        <div className="aj-recruiter-rating">
                                            <FaStar color="#F4B400" size={10} /> {job.hirerRating ? job.hirerRating.toFixed(1) : 'New'}
                                        </div>
                                    </div>
                                </div>
                                {job.status === 'in_progress' ? (
                                    <button className="aj-btn message">Message</button>
                                ) : (
                                    <button className="aj-btn applied">Applied</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkerActiveJobs;
