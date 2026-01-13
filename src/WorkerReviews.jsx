import React, { useState, useEffect } from 'react';
import './WorkerDashboard.css';
import { DB } from './lib/db';
import { useAuth } from './context/AuthContext';
import { FaSearch, FaStar, FaChevronDown, FaQuoteLeft } from 'react-icons/fa';

const WorkerReviews = () => {
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (currentUser?.uid) {
                try {
                    const myReviews = await DB.reviews.getByTargetUser(currentUser.uid);

                    // Sort by newest
                    const sorted = myReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setReviews(sorted);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchReviews();
    }, [currentUser]);

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
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', color: '#888' }}>
                        No reviews received yet.
                    </div>
                ) : (
                    reviews.map((rev, index) => (
                        <div className="review-card-wide" key={rev.id || index}>
                            <div className="review-card-left">
                                <img src={rev.reviewerPic || "https://randomuser.me/api/portraits/men/99.jpg"} alt={rev.reviewerName} className="review-avatar-lg" />
                            </div>

                            <div className="review-card-right">
                                <div className="rc-header">
                                    <h4 className="rc-name">{rev.reviewerName || 'Hirer'}</h4>
                                </div>

                                <div className="worker-stars" style={{ fontSize: '0.9rem', margin: '4px 0' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < Math.floor(rev.rating) ? "#F4B400" : "#D1C7BD"} />
                                    ))}
                                </div>

                                <p className="rc-text"><FaQuoteLeft size={10} color="#ccc" style={{ marginRight: '5px' }} /> {rev.comment}</p>

                                <div className="rc-footer">
                                    <span className="rc-time">{rev.createdAt ? getTimeAgo(rev.createdAt) : 'Recently'}</span>
                                    {/* <a href="#" className="read-details-link">Read Job Details &gt;</a> */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <button className="view-more-btn">View More</button>
            </div>
        </div>
    );
};

export default WorkerReviews;
