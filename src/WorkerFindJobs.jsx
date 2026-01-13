import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';
import './WorkerDashboard.css';
import './WorkerFindJobs.css';
import {
    FaSearch,
    FaBriefcase,
    FaMapMarkerAlt,
    FaChevronDown,
    FaStar,
    FaCheckCircle,
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa';

const WorkerFindJobs = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    // const [applyingId, setApplyingId] = useState(null); // Unused or can be removed if strictly following plan
    // const [selectedJob, setSelectedJob] = useState(null); // Removed

    // Filters
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterWage, setFilterWage] = useState('All');

    useEffect(() => {
        const fetchJobsAndApplications = async () => {
            if (currentUser?.uid) {
                try {
                    const [allJobs, myApplications] = await Promise.all([
                        DB.jobs.getAll(),
                        DB.applications.getByWorker(currentUser.uid)
                    ]);

                    const appliedIds = new Set(myApplications.map(a => a.jobId));
                    setAppliedJobIds(appliedIds);

                    // Filter out closed jobs or jobs created by self (if logic permits, though workers usually don't post)
                    // Also sort by newest
                    const openJobs = allJobs
                        .filter(j => j.status === 'open')
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    setJobs(openJobs);
                    setFilteredJobs(openJobs);

                } catch (error) {
                    console.error("Error fetching jobs:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchJobsAndApplications();
    }, [currentUser]);

    // Apply Filters
    useEffect(() => {
        let result = jobs;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(j =>
                j.title.toLowerCase().includes(query) ||
                j.location.toLowerCase().includes(query) ||
                (j.category && j.category.toLowerCase().includes(query))
            );
        }

        if (filterCategory !== 'All') {
            result = result.filter(j => j.category === filterCategory);
        }

        // Wage filter mock logic (needs robust logic or simple buckets)
        // For now, simple demonstration
        if (filterWage === 'High (>800)') {
            result = result.filter(j => Number(j.wage) > 800);
        }

        setFilteredJobs(result);

    }, [searchQuery, filterCategory, filterWage, jobs]);

    const handleApplyClick = (job) => {
        if (!currentUser || appliedJobIds.has(job.id)) return;
        navigate(`/apply-job/${job.id}`, { state: { job } });
    };

    const getTimeAgo = (dateStr) => {
        if (!dateStr) return 'Recently';
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        let interval = seconds / 3600;
        if (interval > 24) return Math.floor(interval / 24) + " days ago";
        if (interval > 1) return Math.floor(interval) + " hrs ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return "Just now";
    };

    return (
        <div className="worker-find-jobs-container">
            {/* Page Header */}
            <div className="section-heading-row" style={{ marginBottom: '8px' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Find Jobs</h1>
            </div>
            <p className="page-subtitle" style={{ color: 'var(--secondary-text)', marginTop: 0, marginBottom: '24px' }}>
                Search and apply for daily-wage job opportunities in your area.
            </p>

            {/* Filter Section */}
            <div className="jobs-filter-section">
                <div className="filter-row top">
                    <div className="filter-input-wrapper dropdown">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                        >
                            <option value="All">All Categories</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Plumber">Plumber</option>
                            <option value="Mason">Mason</option>
                            <option value="Driver">Driver</option>
                            <option value="Labor">Labor</option>
                        </select>
                    </div>
                    <div className="filter-input-wrapper dropdown wage-dropdown">
                        <select
                            value={filterWage}
                            onChange={(e) => setFilterWage(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }}
                        >
                            <option value="All">All Wages</option>
                            <option value="High (>800)">High ({'>'} ₹800)</option>
                        </select>
                    </div>
                    <div className="filter-input-wrapper" style={{ flex: 1, padding: '8px 12px' }}>
                        <input
                            type="text"
                            placeholder="Search by keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }}
                        />
                    </div>
                </div>
                <div className="filter-row bottom">
                    <div className="filter-input-wrapper dropdown small">
                        <span>Filters: All</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                    <div className="filter-input-wrapper dropdown location-dropdown">
                        <span>Within 5 km</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                    <button className="search-btn-orange">Search</button>
                </div>
            </div>

            {/* Results Header */}
            <div className="results-count-header">
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {loading ? 'Loading...' : `${filteredJobs.length} Jobs Found`}
                </span>
            </div>

            <div className="job-lists-grid-layout">
                {/* Main Job List */}
                <div className="jobs-main-col">

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Loading jobs...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>
                            No jobs matches your criteria.
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div className={`job-card-large ${job.isUrgent ? 'featured' : 'recent'}`} key={job.id}>
                                <div className="job-card-top">
                                    <div className="job-icon-box orange">
                                        <FaBriefcase />
                                    </div>
                                    <div className="job-info-main">
                                        <div className="job-title-row">
                                            <h3>{job.title}</h3>
                                            <span className="wage-tag">₹{job.wage}/day</span>
                                            {job.isUrgent && <span className="urgent-badge">Urgent</span>}
                                            <button
                                                className={`apply-btn-blue ${appliedJobIds.has(job.id) ? 'applied' : ''}`}
                                                onClick={() => handleApplyClick(job)}
                                                disabled={appliedJobIds.has(job.id)}
                                                style={appliedJobIds.has(job.id) ? { backgroundColor: '#4CAF50', cursor: 'default' } : {}}
                                            >
                                                {appliedJobIds.has(job.id) ? 'Applied' : 'Apply'}
                                            </button>
                                        </div>
                                        <div className="job-loc-row">
                                            <span className="loc">{job.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="job-skills-row">
                                    <span className="skill-label">Category:</span>
                                    <span className="skill-tag">{job.category}</span>
                                </div>

                                <div className="job-recruiter-row">
                                    <div className="recruiter-info">
                                        <img src={job.hirerPic || "https://randomuser.me/api/portraits/men/85.jpg"} alt="Recruiter" className="recruiter-pic" />
                                        <div>
                                            <div className="recruiter-name">
                                                {job.hirerName || 'Hirer'}
                                                {/* <span className="recruiter-phone">{jobs[0].recruiter.phone}</span> */}
                                            </div>
                                            <div className="recruiter-meta">
                                                Recruiter
                                                <span className="stars">
                                                    {job.hirerRating ? `• ${job.hirerRating} ★` : ''}
                                                </span>
                                                <span className="posted-time" style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#888' }}>
                                                    • Posted {getTimeAgo(job.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination */}
                    <div className="pagination-wrapper">
                        <div className="page-numbers">
                            <span className="page-num">1</span>
                            <span className="page-num active">2</span>
                            <span className="page-num">3</span>
                            <span className="page-num">4</span>
                            <span className="page-num">5</span>
                        </div>
                        <div className="page-controls">
                            <span>{'<'} 1 2 3 4 5 Next {'>'}</span>
                        </div>
                    </div>

                </div>

                {/* Right Sidebar Tips */}
                <aside className="jobs-right-sidebar">
                    <div className="tips-card">
                        <h3>Tip for Finding Jobs</h3>
                        <ul className="tips-list">
                            <li>
                                <span className="tip-icon">📄</span>
                                Use specific job type to narrow down search
                            </li>
                            <li>
                                <span className="tip-icon">💰</span>
                                Adjust wage and distance filters to find suitable jobs
                            </li>
                            <li>
                                <span className="tip-icon">⭐</span>
                                Review job details and ratings before applying
                            </li>
                        </ul>
                    </div>



                    <div className="people-also-apply-list">
                        <h3>People Also Apply For</h3>
                        {jobs.length > 0 ? (
                            jobs.slice(0, 3).map(job => (
                                <div className="mini-job-row" key={'sidebar-' + job.id}>
                                    <div className="mini-job-icon"><FaBriefcase /></div>
                                    <div className="mini-job-info">
                                        <h4>{job.title}</h4>
                                        <span>{job.location} • {getTimeAgo(job.createdAt)}</span>
                                    </div>
                                    <button
                                        className="mini-apply-btn"
                                        onClick={() => handleApplyClick(job)}
                                        disabled={appliedJobIds.has(job.id)}
                                        style={appliedJobIds.has(job.id) ? { backgroundColor: '#4CAF50', cursor: 'default' } : {}}
                                    >
                                        {appliedJobIds.has(job.id) ? '✓' : 'Apply'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#888', fontSize: '0.9rem' }}>No recommendations yet.</div>
                        )}
                    </div>
                </aside>
            </div >
        </div >
    );
};

export default WorkerFindJobs;
