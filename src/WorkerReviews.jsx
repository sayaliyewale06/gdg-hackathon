import React, { useState } from 'react';
import './WorkerDashboard.css';
import { FaSearch, FaStar, FaChevronDown } from 'react-icons/fa';

const WorkerReviews = () => {
    const reviews = [
        {
            name: 'Anita Sharma',
            review: 'Great work, very reliable!',
            time: '2 days ago',
            rating: 5,
            pic: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Vikram Singh',
            review: 'Punctual and skilled',
            time: '3 days ago',
            rating: 5,
            pic: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            name: 'Sumit Roy',
            review: 'Hardworking and punctual',
            time: '6 days ago',
            rating: 5,
            pic: 'https://randomuser.me/api/portraits/men/85.jpg'
        },
        {
            name: 'Ishita Patel',
            review: 'Good worker. On time and professional',
            time: '2 weeks ago',
            rating: 4.5,
            pic: 'https://randomuser.me/api/portraits/women/65.jpg'
        }
    ];

    return (
        <div className="earnings-container">
            <div className="section-heading-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ margin: 0, color: 'var(--secondary-text)', fontWeight: '400' }}>Dashboard / </h5>
                    <h5 style={{ margin: 0, color: '#5D7E85' }}>Worker Reviews</h5>
                </div>
            </div>
            <div className="section-heading-row" style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0 }}>Worker Reviews</h1>
            </div>

            {/* Filter & Search Bar */}
            {/* Filter & Search Bar */}
            <div className="reviews-filter-bar">
                <div className="filter-group">
                    <label>All Reviews</label>
                    <FaChevronDown size={12} />
                </div>
                <div className="search-box">
                    <FaSearch />
                    <input type="text" placeholder="Search" />
                </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-text)' }}>Recent Job Reviews</h3>

            <div className="reviews-list">
                {reviews.map((rev, index) => (
                    <div className="review-card-wide" key={index}>
                        <div className="review-card-left">
                            <img src={rev.pic} alt={rev.name} className="review-avatar-lg" />
                        </div>

                        <div className="review-card-right">
                            <div className="rc-header">
                                <h4 className="rc-name">{rev.name}</h4>
                            </div>

                            <div className="worker-stars" style={{ fontSize: '0.9rem', margin: '4px 0' }}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} color={i < Math.floor(rev.rating) ? "#F4B400" : "#D1C7BD"} />
                                ))}
                            </div>

                            <p className="rc-text">{rev.review}</p>

                            <div className="rc-footer">
                                <span className="rc-time">{rev.time}</span>
                                <a href="#" className="read-details-link">Read Job Details &gt;</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <button className="view-more-btn">View More</button>
            </div>
        </div>
    );
};

export default WorkerReviews;
