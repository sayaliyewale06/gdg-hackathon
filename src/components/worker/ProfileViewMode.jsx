import React from 'react';
import './ProfileDetails.css';

const ProfileViewMode = ({ profileData, onEdit }) => {
    return (
        <div className="profile-view-page">
            <div className="profile-header">
                <h1>Profile Details</h1>
                <button onClick={onEdit} className="edit-profile-btn">
                    ✏️ Edit Profile
                </button>
            </div>

            <div className="profile-content">
                {/* Left Column - Profile Card */}
                <div className="profile-card">
                    <div className="profile-photo">
                        {profileData.profilePhoto ? (
                            <img src={profileData.profilePhoto} alt={profileData.name} />
                        ) : (
                            <div className="placeholder-avatar">
                                {profileData.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <h2>{profileData.name}</h2>
                    <p className="role">{profileData.role}</p>
                    <div className="rating">
                        ⭐⭐⭐⭐⭐ <span>(88 Reviews)</span>
                    </div>

                    <div className="contact-info">
                        <div className="info-item">
                            <span className="icon">📞</span>
                            <span>{profileData.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="icon">✉️</span>
                            <span>{profileData.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="icon">📍</span>
                            <span>{profileData.location}</span>
                        </div>
                        <div className="info-item">
                            <span className="icon">🟢</span>
                            <span>{profileData.availability}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="profile-details">
                    {/* About Section */}
                    <div className="detail-section">
                        <h3>About</h3>
                        <p>{profileData.about}</p>
                    </div>

                    {/* Skills & Experience */}
                    <div className="detail-section">
                        <h3>Skills & Experience</h3>
                        <div className="experience-badge">
                            {profileData.experience}
                        </div>
                        <div className="skills-list">
                            {profileData.skills.map(skill => (
                                <span key={skill} className="skill-tag">
                                    ✓ {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Employment History */}
                    <div className="detail-section">
                        <h3>Employment History</h3>
                        {/* This will be populated from actual job data */}
                        <div className="employment-list">
                            <p className="empty-state">
                                Your completed jobs will appear here
                            </p>
                        </div>
                    </div>

                    {/* Top Reviews */}
                    <div className="detail-section">
                        <h3>Top Reviews</h3>
                        <button className="view-all-reviews-btn">
                            View All Reviews →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileViewMode;
