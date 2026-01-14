import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkerDashboard.css'; // Reuse existing styles + new ones
import { DB } from './lib/db';
import { useAuth } from './context/AuthContext';
import { FaSearch, FaBriefcase, FaMapMarkerAlt, FaCheckCircle, FaStar, FaCar, FaWalking, FaBox, FaHardHat, FaClock, FaTimesCircle } from 'react-icons/fa';

import { toast } from 'react-hot-toast';

const WorkerMyJobs = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Time');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.hirerName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
        const matchesLocation = filterLocation === 'All' || job.jobLocation?.includes(filterLocation);

        let matchesTime = true;
        const jobDate = new Date(job.createdAt);
        const now = new Date();

        if (activeTab === 'This Week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            matchesTime = jobDate >= oneWeekAgo;
        } else if (activeTab === 'This Month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(now.getDate() - 30);
            matchesTime = jobDate >= oneMonthAgo;
        }

        return matchesSearch && matchesTime && matchesCategory && matchesLocation;
    });

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterCategory('All');
        setFilterLocation('All');
        setActiveTab('All Time');
    };

    // ... useEffect ... (unchanged)

    // ... getStatusBadge ... (unchanged)

    return (
        <div className="earnings-container"> {/* Reuse container for padding/layout */}
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>My Recent Jobs</h5>
                </div>
            </div>
            <div className="section-heading-row" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>My Recent Jobs <span style={{ fontSize: '1rem', color: '#666' }}>({filteredJobs.length})</span></h1>
                <button
                    onClick={handleClearFilters}
                    style={{ background: 'white', border: '1px solid #EF5B5B', color: '#EF5B5B', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px' }}
                >
                    Clear Filters
                </button>
            </div>

            {/* Filter Bar */}
            <div className="jobs-filter-bar" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {/* Category Filter */}
                <div className="filter-input-wrapper dropdown" style={{ width: '150px', background: '#f5f5f5', borderRadius: '4px', padding: '8px' }}>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                    >
                        <option value="All">Category: All</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Plumber">Plumber</option>
                        <option value="Mason">Mason</option>
                        <option value="Driver">Driver</option>
                        <option value="Labor">Labor</option>
                    </select>
                </div>

                {/* Location Filter */}
                <div className="filter-input-wrapper dropdown" style={{ width: '150px', background: '#f5f5f5', borderRadius: '4px', padding: '8px' }}>
                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                    >
                        <option value="All">Location: All</option>
                        <option value="Pune">Pune</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                    </select>
                </div>

                <div className="filter-tabs" style={{ marginLeft: 'auto' }}>
                    <button
                        className={`filter-tab ${activeTab === 'This Week' ? 'active' : ''}`}
                        onClick={() => setActiveTab('This Week')}
                    >
                        This Week
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'This Month' ? 'active' : ''}`}
                        onClick={() => setActiveTab('This Month')}
                    >
                        This Month
                    </button>
                    <button
                        className={`filter-tab ${activeTab === 'All Time' ? 'active' : ''}`}
                        onClick={() => setActiveTab('All Time')}
                    >
                        All Time
                    </button>
                </div>
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-text)' }}>Recent Job History</h3>

            {/* Header Row */}
            <div className="job-history-table-header">
                <div>Date</div>
                <div>Job</div>
                <div>Earnings</div>
                <div>Employer</div>
            </div>

            {/* Job Rows */}
            {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading history...</div>
            ) : filteredJobs.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No job history found.</div>
            ) : (
                filteredJobs.map((job) => {
                    const statusInfo = getStatusBadge(job.status);
                    const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                        <div className="job-row" key={job.id}>
                            {/* LEFT SECTION: Date, Icon, Details */}
                            <div className="job-section-left">
                                <div className="jr-date">{formattedDate}</div>
                                <div className="jr-icon-box">
                                    <FaBriefcase />
                                </div>
                                <div className="jr-details">
                                    <h4>{job.jobTitle}</h4>
                                    <div className="jr-location">
                                        <FaMapMarkerAlt style={{ fontSize: '0.7em' }} /> {job.jobLocation}
                                    </div>
                                </div>
                            </div>

                            {/* CENTER SECTION: Price, Earned Badge */}
                            <div className="job-section-center">
                                <span className="jr-amount">₹{job.jobWage}</span>
                                <div className="status-badge" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                                    <span>{statusInfo.text}</span>
                                </div>
                            </div>

                            {/* RIGHT SECTION: Status, Profile, Message */}
                            <div className="job-section-right">
                                <div className="status-text" style={{ color: statusInfo.color }}>
                                    {statusInfo.icon} {statusInfo.text}
                                </div>
                                <div className="emp-profile">
                                    <img src={job.hirerPic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt={job.hirerName} />
                                    <div className="emp-name">
                                        <h5>{job.hirerName}</h5>
                                        <div className="worker-stars" style={{ fontSize: '0.7rem' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    color={i < (job.hirerRating || 0) ? "#F4B400" : "#E0E0E0"}
                                                />
                                            ))}
                                            <span style={{ color: '#888', fontWeight: '400', marginLeft: '4px' }}>
                                                {job.hirerRating ? job.hirerRating.toFixed(1) : 'New'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="message-btn"
                                    onClick={() => {
                                        if (!job.hirerId) {
                                            toast.error("Cannot message: This job record is missing employer details.");
                                            return;
                                        }
                                        navigate('/worker-dashboard', {
                                            state: {
                                                view: 'messages',
                                                selectedConversation: job.hirerId,
                                                employerName: job.hirerName,
                                                employerPic: job.hirerPic
                                            }
                                        });
                                    }}
                                >
                                    Message
                                </button>
                                <button
                                    className="message-btn"
                                    style={{ backgroundColor: '#fff', color: '#be123c', border: '1px solid #be123c', marginLeft: '8px' }}
                                    onClick={async () => {
                                        // window.confirm removed for snappy UI as requested
                                        try {
                                            await DB.applications.delete(job.id);
                                            // Optimistic update
                                            setJobs(prev => prev.filter(j => j.id !== job.id));
                                            toast.success("Application withdrawn successfully");
                                        } catch (err) {
                                            console.error("Failed to withdraw:", err);
                                            toast.error("Failed to withdraw application.");
                                        }
                                    }}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

        </div>
    );
};

export default WorkerMyJobs;
