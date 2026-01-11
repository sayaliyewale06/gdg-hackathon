import React, { useState, useEffect } from 'react';
import './WorkerDashboard.css';
import { DB } from './lib/db';
import { seedDatabase } from './lib/seed';
import { FaChevronDown, FaSearch, FaBriefcase, FaTruck, FaBolt, FaCar, FaMapMarkerAlt, FaStar, FaUserFriends, FaClock, FaCheckCircle, FaPaintRoller, FaHammer, FaWrench } from 'react-icons/fa';

const WorkerActiveJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const fetchedJobs = await DB.jobs.getAll();
                setJobs(fetchedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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
                <button className="aj-filter-btn dark">All <FaChevronDown size={10} /></button>
                <div className="aj-divider"></div>
                <button className="aj-filter-btn">All Locations <FaChevronDown size={10} /></button>
                <div className="aj-divider"></div>
                <button className="aj-filter-btn">All Locations <FaChevronDown size={10} /></button>
                <div className="aj-divider"></div>
                <button className="aj-filter-btn">Sort by <span style={{ color: '#333', fontWeight: 600 }}>Newest</span> <FaChevronDown size={10} /></button>

                <div className="aj-search-wrapper">
                    <FaSearch color="#999" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>

            {/* Job List */}
            <div className="aj-jobs-list">
                {loading ? (
                    <div style={{ color: 'white', padding: '20px' }}>Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div style={{ color: '#ccc', padding: '20px' }}>No active jobs found.</div>
                ) : (
                    jobs.map((job) => (
                        <div className="aj-job-card" key={job.id}>
                            {/* Left: Icon & Title */}
                            <div className="aj-job-main">
                                <div className="aj-icon-box">
                                    {getCategoryIcon(job.category)}
                                </div>
                                <div className="aj-job-info">
                                    <h3 className="aj-title">
                                        {job.title} {job.isUrgent && <span className="aj-urgent-tag">Urgent</span>}
                                    </h3>
                                    <div className="aj-loc-row">
                                        <FaMapMarkerAlt size={12} /> {job.location}
                                    </div>
                                    {job.description && <div className="aj-sub-loc" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.description}</div>}
                                </div>
                            </div>

                            {/* Middle: Price & Status */}
                            <div className="aj-job-mid">
                                <div className="aj-price"><strong>₹{job.wage}</strong>/day</div>
                                {job.status === 'in_progress' ? (
                                    <div className="aj-duration">In Progress</div>
                                ) : (
                                    <div className="aj-dummy-spacer"></div>
                                )}
                            </div>

                            <div className="aj-job-status-col">
                                {job.status === 'in_progress' ? (
                                    <>
                                        <div className="aj-status-pill progress">In Progress</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="aj-posted-row">Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                                        <div className="aj-applicants-row"><FaUserFriends size={12} /> {job.applicantsCount} Applicants</div>
                                    </>
                                )}
                            </div>

                            {/* Right: Employer & Action */}
                            <div className="aj-employer-col">
                                <img src={job.hirerPic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} className="aj-emp-pic" alt={job.hirerName} />
                                <div className="aj-emp-details">
                                    <div className="aj-emp-name">{job.hirerName || 'Unknown'}</div>
                                    <div className="aj-emp-rating">
                                        <FaStar color="#F4B400" size={10} /> {job.hirerRating ? job.hirerRating.toFixed(1) : 'New'}
                                    </div>
                                </div>
                            </div>

                            <div className="aj-action-col">
                                {job.status === 'in_progress' ? (
                                    <button className="aj-action-btn message">Message</button>
                                ) : (
                                    <button className="aj-action-btn applied">Apply</button>
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
