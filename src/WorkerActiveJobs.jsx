import React from 'react';
import './WorkerDashboard.css';
import { FaChevronDown, FaSearch, FaBriefcase, FaTruck, FaBolt, FaCar, FaMapMarkerAlt, FaStar, FaUserFriends, FaClock, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const WorkerActiveJobs = () => {

    const jobs = [
        {
            type: 'mason',
            icon: <FaBriefcase />,
            title: 'Masonry Work',
            location: 'Pune',
            price: '₹950',
            duration_label: '3 Days Left',
            status: 'inprogress',
            progress_time: '3 Now Left',
            employer: { name: 'Rahul Agrawal', rating: 4.8, reviews: 105, pic: 'https://randomuser.me/api/portraits/men/44.jpg' }
        },
        {
            type: 'loading',
            icon: <FaCar />, // Using Car for generic transport/loading 
            title: 'Loading Help',
            location: 'Pune',
            price: '₹700',
            duration_label: '1 Day Left',
            status: 'inprogress',
            progress_time: '1 Day Left',
            employer: { name: 'Vikram Singh', rating: 5.0, reviews: 95, pic: 'https://randomuser.me/api/portraits/men/32.jpg' }
        },
        {
            type: 'electrician',
            icon: <FaBolt />,
            title: 'Electrician Needed',
            isUrgent: true,
            location: 'Pune',
            subLoc: 'Electric Repair work',
            price: '₹800',
            status: 'applied',
            posted: '2 days ago',
            applicants: 7,
            employer: { name: 'Akash Patel', rating: 4.5, reviews: 20, pic: 'https://randomuser.me/api/portraits/men/85.jpg' }
        },
        {
            type: 'driver',
            icon: <FaCar />,
            title: 'Driver Required',
            location: 'Pune',
            subLoc: '3 new applicants',
            price: '₹700',
            status: 'applied',
            posted: '3 days ago',
            applicants: 3,
            employer: { name: 'Vikram Sanap', rating: 4.2, reviews: 12, pic: 'https://randomuser.me/api/portraits/men/11.jpg' }
        },
        {
            type: 'driver',
            icon: <FaCar />,
            title: 'Driver Required',
            location: 'Pune',
            subLoc: '3 new applicants',
            price: '₹700',
            status: 'applied',
            posted: '3 days ago',
            applicants: 6,
            employer: { name: 'Vikram Sanap', rating: 4.2, reviews: 12, pic: 'https://randomuser.me/api/portraits/men/11.jpg' }
        },
        {
            type: 'driver',
            icon: <FaCar />,
            title: 'Driver Required',
            location: 'Pune',
            subLoc: '',
            price: '₹700',
            status: 'applied',
            posted: '3 days ago',
            applicants: 6,
            employer: { name: 'Vikram Sanap', rating: 4.2, reviews: 12, pic: 'https://randomuser.me/api/portraits/men/11.jpg' }
        }
    ];

    return (
        <div className="earnings-container">
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>Active Jobs</h5>
                </div>
            </div>

            <div className="section-heading-row" style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0 }}>Active Jobs</h1>
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
                {jobs.map((job, idx) => (
                    <div className="aj-job-card" key={idx}>
                        <div className="aj-card-header">
                            <div className="aj-icon-box">
                                {job.icon}
                            </div>
                            <div className="aj-header-info">
                                <h3 className="aj-title">{job.title}</h3>
                                <div className="aj-loc-row">
                                    <FaMapMarkerAlt size={12} /> {job.location}
                                </div>
                            </div>
                            <div className="aj-price-badge">
                                {job.price}<span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/day</span>
                            </div>
                        </div>

                        <div className="aj-card-body">
                            <div className="aj-status-row">
                                <span className={`aj-status-badge ${job.status}`}>
                                    {job.status === 'inprogress' ? 'In Progress' : 'Applied'}
                                </span>
                                {job.status === 'inprogress' && (
                                    <span className="aj-countdown">{job.duration_label}</span>
                                )}
                            </div>

                            {job.status === 'inprogress' ? (
                                <div className="aj-info-row">
                                    <FaInfoCircle size={12} style={{ marginRight: '6px' }} /> {job.progress_time}
                                </div>
                            ) : (
                                <div className="aj-info-row">
                                    <FaUserFriends size={12} style={{ marginRight: '6px' }} /> {job.applicants} Applicants
                                </div>
                            )}
                        </div>

                        <div className="aj-card-footer">
                            <div className="aj-employer-info">
                                <img src={job.employer.pic} alt={job.employer.name} />
                                <div className="aj-emp-text">
                                    <div className="aj-emp-name">{job.employer.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerActiveJobs;
