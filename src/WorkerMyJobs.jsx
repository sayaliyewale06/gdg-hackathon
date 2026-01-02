import React, { useState } from 'react';
import './WorkerDashboard.css'; // Reuse existing styles + new ones
import { FaSearch, FaBriefcase, FaMapMarkerAlt, FaCheckCircle, FaStar, FaCar, FaWalking, FaBox, FaHardHat } from 'react-icons/fa';

const WorkerMyJobs = () => {
    const [activeTab, setActiveTab] = useState('This Week');

    const jobs = [
        {
            date: 'April 28',
            title: 'Packing Help',
            location: 'Baner',
            icon: <FaBox />,
            amount: '₹700',
            status: 'Shift Done',
            statusType: 'success', // or 'neutral'
            employer: 'Vikram Singh',
            rating: 4.8,
            reviews: 95,
            img: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            date: 'April 27',
            title: 'Masonry Work',
            location: 'Hinjewadi',
            icon: <FaBox />, // Using box as general placeholder if specific icon not available, or reuse FaBriefcase
            amount: '₹950',
            status: 'Completed',
            statusType: 'success',
            employer: 'Rahul Agrawal',
            rating: 4.2,
            reviews: 125,
            img: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
            date: 'April 26',
            title: 'Driving Job',
            location: 'Shivajinagar',
            icon: <FaCar />,
            amount: '₹800',
            status: 'Ride Complete',
            statusType: 'success',
            employer: 'Vishal More',
            rating: 5.0,
            reviews: 53,
            img: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        {
            date: 'April 25',
            title: 'Helper Job',
            location: 'Baner',
            icon: <FaWalking />,
            amount: '₹700',
            status: 'Help Done',
            statusType: 'success',
            employer: 'Akash Patel',
            rating: 4.5,
            reviews: 89,
            img: 'https://randomuser.me/api/portraits/men/64.jpg'
        },
        {
            date: 'April 24',
            title: 'Masonry Work',
            location: 'Shivajinagar',
            icon: <FaHardHat />,
            amount: '₹950',
            status: 'Completed',
            statusType: 'success',
            employer: 'Vikram Sanap',
            rating: 4.6,
            reviews: 61,
            img: 'https://randomuser.me/api/portraits/men/76.jpg'
        },
        {
            date: 'April 24',
            title: 'Masonry Work',
            location: 'Pune',
            icon: <FaHardHat />,
            amount: '₹700',
            status: 'Completed',
            statusType: 'success',
            employer: 'Vikram Sanap',
            rating: 4.6,
            reviews: 61,
            img: 'https://randomuser.me/api/portraits/men/76.jpg'
        }
    ];

    return (
        <div className="earnings-container"> {/* Reuse container for padding/layout */}
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>My Recent Jobs</h5>
                </div>
            </div>
            <div className="section-heading-row" style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0 }}>My Recent Jobs</h1>
            </div>

            {/* Filter Bar */}
            <div className="jobs-filter-bar">
                <div className="filter-tabs">
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
                    <button className="filter-tab filter-tab-dropdown">
                        All Time <span>▼</span>
                    </button>
                </div>
                <div className="search-box">
                    <FaSearch />
                    <input type="text" placeholder="Search" />
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
            {jobs.map((job, index) => (
                <div className="job-row" key={index}>
                    <div className="jr-date">{job.date}</div>

                    <div className="jr-job-info">
                        <div className="jr-icon-box">
                            {job.title.includes('Masonry') ? <FaHardHat /> : job.icon}
                        </div>
                        <div className="jr-details">
                            <h4>{job.title}</h4>
                            <div className="jr-location">
                                <FaMapMarkerAlt style={{ fontSize: '0.7em' }} /> {job.location}
                            </div>
                        </div>
                    </div>

                    <div className="jr-earnings">
                        <span className="jr-amount">{job.amount}</span>
                        <div className="status-badge status-completed">
                            <span>{job.amount} Earned</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaCheckCircle style={{ fontSize: '0.7rem' }} /> {job.status}
                        </div>
                    </div>

                    <div className="jr-employer">
                        <div className="emp-profile">
                            <img src={job.img} alt={job.employer} />
                            <div className="emp-name">
                                <h5>{job.employer}</h5>
                                <div className="worker-stars" style={{ fontSize: '0.7rem' }}>
                                    <FaStar /><FaStar /><FaStar /><FaStar />
                                    <span style={{ color: '#888', fontWeight: '400', marginLeft: '4px' }}>{job.reviews} Reviews</span>
                                </div>
                            </div>
                        </div>
                        <button className="message-btn">Message</button>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default WorkerMyJobs;
