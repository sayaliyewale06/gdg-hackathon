import React from 'react';
import './ProfileDetails.css';

const ProfileCard = ({ profileData }) => {
    return (
        <div className="profile-card-sidebar">
            {/* Profile Photo */}
            <div className="profile-photo-large">
                {profileData.profilePhoto ? (
                    <img src={profileData.profilePhoto} alt={profileData.name} />
                ) : (
                    <div className="avatar-placeholder">
                        {profileData.name?.charAt(0) || 'R'}
                    </div>
                )}
            </div>

            {/* Name and Role */}
            <div className="profile-identity">
                <h2>{profileData.name || 'Worker'}</h2>
                <p className="role-badge">{profileData.role || 'New Worker'}</p>
            </div>

            {/* Rating */}
            <div className="profile-rating">
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <span className="review-count">(88 Reviews)</span>
            </div>

            {/* Contact Information */}
            <div className="contact-details">
                <div className="contact-item">
                    <span className="icon">📞</span>
                    <div className="contact-text">
                        <span className="label">Phone</span>
                        <span className="value">{profileData.phone || '--'}</span>
                    </div>
                </div>

                <div className="contact-item">
                    <span className="icon">✉️</span>
                    <div className="contact-text">
                        <span className="label">Email</span>
                        <span className="value">{profileData.email || '--'}</span>
                    </div>
                </div>

                <div className="contact-item">
                    <span className="icon">📍</span>
                    <div className="contact-text">
                        <span className="label">Location</span>
                        <span className="value">{profileData.location || 'Location not set'}</span>
                    </div>
                </div>

                <div className="contact-item">
                    <span className="icon">🟢</span>
                    <div className="contact-text">
                        <span className="label">Status</span>
                        <span className="value">{profileData.availability || 'Available for work'}</span>
                    </div>
                </div>
            </div>



            {/* Total Earnings */}
            <div className="earnings-summary">
                <h4>Total Earnings</h4>
                <div className="earnings-amount">
                    ₹{profileData.totalEarnings?.toLocaleString() || '0'}
                </div>
                <div className="earnings-period">
                    This Week: ₹{profileData.weeklyEarnings?.toLocaleString() || '0'}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
