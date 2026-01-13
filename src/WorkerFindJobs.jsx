import React, { useState } from 'react';
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
    const [searchQuery, setSearchQuery] = useState('');

    const jobs = [
        {
            id: 1,
            title: 'Electrician Needed',
            location: 'Sector 21, Noida',
            wage: '₹800',
            isUrgent: true,
            skills: ['Wiring', 'Electrical', 'Circuit Breakers'],
            recruiter: {
                name: 'Ajay Patil',
                rating: 4.6,
                reviews: 98,
                verified: true,
                phone: '+91 99930 19***',
                pic: 'https://randomuser.me/api/portraits/men/85.jpg'
            },
            type: 'featured'
        },
        {
            id: 2,
            title: 'Electrician Needed',
            location: 'Sector 21, Noida',
            wage: '₹600',
            isUrgent: true,
            skills: ['Skills', 'Wiring', 'Eletrical Repair', 'Circuit Breakers'],
            recruiter: {
                name: 'Ajay Kapoor',
                rating: 5.0,
                reviews: 12,
                verified: false,
                phone: '+91 98765 43***',
                pic: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            postedTime: '2 hrs ago',
            duration: '2 hours ago',
            type: 'recent'
        },
        // Adding more dummy data to fill the list
        {
            id: 3,
            title: 'Plumber Required',
            location: 'Gurgaon',
            wage: '₹750',
            isUrgent: false,
            skills: ['Pipe Fitting', 'Repair', 'Installation'],
            recruiter: {
                name: 'Rohan Singh',
                rating: 4.2,
                reviews: 45,
                verified: true,
                phone: '+91 98123 45***',
                pic: 'https://randomuser.me/api/portraits/men/44.jpg'
            },
            postedTime: '5 hrs ago',
            type: 'recent'
        }
    ];

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
                        <span>Electrician</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                    <div className="filter-input-wrapper dropdown wage-dropdown">
                        <span>₹600-₹1,100</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                    <div className="filter-input-wrapper dropdown wage-dropdown-small">
                        <span>₹1,00</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                </div>
                <div className="filter-row bottom">
                    <div className="filter-input-wrapper dropdown small">
                        <span>Filters: All</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                    <div className="filter-input-wrapper dropdown location-dropdown">
                        <span>Within 5 km of Sector 21, Noida</span>
                        <FaChevronDown className="filter-chevron" />
                    </div>
                    <button className="search-btn-orange">Search</button>
                </div>
            </div>

            {/* Results Header */}
            <div className="results-count-header">
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {'<'} 50 Jobs Found
                </span>
            </div>

            <div className="job-lists-grid-layout">
                {/* Main Job List */}
                <div className="jobs-main-col">

                    {/* Featured/Urgent Card */}
                    <div className="job-card-large featured">
                        <div className="job-card-top">
                            <div className="job-icon-box orange">
                                <FaBriefcase />
                            </div>
                            <div className="job-info-main">
                                <div className="job-title-row">
                                    <h3>{jobs[0].title}</h3>
                                    <span className="wage-tag">{jobs[0].wage}/day</span>
                                    {jobs[0].isUrgent && <span className="urgent-badge">Urgent</span>}
                                    <button className="apply-btn-blue">Apply</button>
                                </div>
                                <div className="job-loc-row">
                                    <span className="loc">{jobs[0].location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="job-skills-row">
                            <span className="skill-label">Pro Skills:</span>
                            {jobs[0].skills.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                            ))}
                        </div>

                        <div className="job-recruiter-row">
                            <div className="recruiter-info">
                                <img src={jobs[0].recruiter.pic} alt="Recruiter" className="recruiter-pic" />
                                <div>
                                    <div className="recruiter-name">
                                        {jobs[0].recruiter.name}
                                        <span className="recruiter-phone">{jobs[0].recruiter.phone}</span>
                                    </div>
                                    <div className="recruiter-meta">
                                        Recruiter
                                        <span className="stars">
                                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar className="half" /> {jobs[0].recruiter.rating}
                                        </span>
                                        <span className="verified-badge">
                                            <FaCheckCircle className="check-icon" /> Phone Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Removed duplicate Apply button */}

                        </div>
                    </div>

                    <h3 className="section-subtitle">Recent Job Found</h3>

                    {/* Recent Jobs Map */}
                    {jobs.slice(1).map(job => (
                        <div className="job-card-large recent" key={job.id}>
                            <div className="job-card-top">
                                <div className="job-icon-box orange">
                                    <FaBriefcase />
                                </div>
                                <div className="job-info-main">
                                    <div className="job-title-row">
                                        <h3>{job.title}</h3>
                                        <span className="wage-tag">{job.wage}/day</span>
                                        {job.isUrgent && <span className="urgent-badge">Urgent</span>}
                                        <button className="apply-btn-blue">Apply</button>
                                    </div>
                                    <div className="job-loc-row">
                                        <span className="loc">{job.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="job-skills-row">
                                <span className="skill-label">Pro Skills:</span>
                                {job.skills.map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill}</span>
                                ))}
                            </div>

                            <div className="job-meta-row">
                                <span>Posted {job.postedTime}</span>
                                {job.duration && <span> • {job.duration}</span>}
                            </div>

                            <div className="job-recruiter-row">
                                <div className="recruiter-info">
                                    <img src={job.recruiter.pic} alt="Recruiter" className="recruiter-pic" />
                                    <div>
                                        <div className="recruiter-name">
                                            {job.recruiter.name}
                                        </div>
                                        <div className="recruiter-meta">
                                            Recruiter
                                            {job.recruiter.rating && (
                                                <span className="stars"> • {job.recruiter.rating} stars</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Removed duplicate Apply button */}

                            </div>
                        </div>
                    ))}

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

                    <div className="tips-card">
                        <h3>People Also Apply For</h3>
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
                        <div className="mini-job-row">
                            <div className="mini-job-icon"><FaBriefcase /></div>
                            <div className="mini-job-info">
                                <h4>Plumber Needed</h4>
                                <span>Gurgaon • 21 ** ago</span>
                            </div>
                            <button className="mini-apply-btn">Apply</button>
                        </div>
                        <div className="mini-job-row">
                            <div className="mini-job-icon"><FaBriefcase /></div>
                            <div className="mini-job-info">
                                <h4>Helper Required</h4>
                                <span>Baner • 5 hrs ago</span>
                            </div>
                            <button className="mini-apply-btn">Apply</button>
                        </div>
                        <div className="mini-job-row">
                            <div className="mini-job-icon"><FaBriefcase /></div>
                            <div className="mini-job-info">
                                <h4>Mason Job</h4>
                                <span>Construction Work</span>
                            </div>
                            <button className="mini-apply-btn">Apply</button>
                        </div>
                    </div>
                </aside>
            </div >
        </div >
    );
};

export default WorkerFindJobs;
