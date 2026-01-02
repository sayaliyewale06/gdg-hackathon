import React from 'react';
import './WorkerDashboard.css';
import { FaChevronDown, FaSearch, FaBriefcase, FaTruck, FaBolt, FaCar, FaMapMarkerAlt, FaStar, FaUserFriends, FaClock, FaCheckCircle } from 'react-icons/fa';

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
                {jobs.map((job, idx) => (
                    <div className="aj-job-card" key={idx}>
                        {/* Left: Icon & Title */}
                        <div className="aj-job-main">
                            <div className="aj-icon-box">
                                {job.icon}
                            </div>
                            <div className="aj-job-info">
                                <h3 className="aj-title">
                                    {job.title} {job.isUrgent && <span className="aj-urgent-tag">Urgent</span>}
                                </h3>
                                <div className="aj-loc-row">
                                    <FaMapMarkerAlt size={12} /> {job.location}
                                </div>
                                {job.subLoc && <div className="aj-sub-loc">{job.subLoc}</div>}
                            </div>
                        </div>

                        {/* Middle: Price & Status */}
                        <div className="aj-job-mid">
                            <div className="aj-price"><strong>{job.price}</strong>/day</div>
                            {job.status === 'inprogress' ? (
                                <div className="aj-duration">{job.duration_label}</div>
                            ) : (
                                <div className="aj-dummy-spacer"></div>
                            )}
                        </div>

                        <div className="aj-job-status-col">
                            {job.status === 'inprogress' ? (
                                <>
                                    <div className="aj-status-pill progress">In Progress</div>
                                    <div className="aj-timer"><FaClock size={10} /> {job.progress_time}</div>
                                </>
                            ) : (
                                <>
                                    <div className="aj-posted-row">Posted {job.posted}</div>
                                    <div className="aj-applicants-row"><FaUserFriends size={12} /> {job.applicants} New applicants</div>
                                </>
                            )}
                        </div>

                        {/* Right: Employer & Action */}
                        <div className="aj-employer-col">
                            <img src={job.employer.pic} className="aj-emp-pic" alt={job.employer.name} />
                            <div className="aj-emp-details">
                                <div className="aj-emp-name">{job.employer.name}</div>
                                <div className="aj-emp-rating">
                                    <FaStar color="#F4B400" size={10} /> <FaStar color="#F4B400" size={10} /> <FaStar color="#F4B400" size={10} /> <FaStar color="#F4B400" size={10} />
                                    {job.status === 'inprogress' && <span style={{ marginLeft: '4px', color: '#777', fontSize: '0.75rem' }}>{job.employer.reviews} Reviews</span>}
                                </div>
                            </div>
                        </div>

                        <div className="aj-action-col">
                            {job.status === 'inprogress' ? (
                                <button className="aj-action-btn message">Message</button>
                            ) : (
                                <button className="aj-action-btn applied">Applied</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerActiveJobs;
