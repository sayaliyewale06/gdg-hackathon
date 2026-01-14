import React from 'react';
import './ProfileDetails.css';

const ProfileDetailsContent = ({ profileData, onEdit }) => {
    return (
        <div className="profile-details-content">
            <div className="profile-header">
                <h1>Profile Details</h1>
                {onEdit && (
                    <button onClick={onEdit} className="edit-btn">
                        ✏️ Edit Profile
                    </button>
                )}
            </div>

            {/* About Section */}
            <section className="content-section">
                <h3>About</h3>
                <p className="about-text">
                    {profileData.about || 'No description provided.'}
                </p>
            </section>

            {/* Skills & Experience */}
            <section className="content-section">
                <h3>Skills & Experience</h3>
                <div className="experience-badge">
                    {profileData.experience || 'No experience info added'}
                </div>
                <div className="skills-list">
                    {profileData.skills && profileData.skills.length > 0 ? (
                        profileData.skills.map(skill => (
                            <span key={skill} className="skill-tag">
                                ✓ {skill}
                            </span>
                        ))
                    ) : (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>No skills selected</p>
                    )}
                </div>
            </section>

            {/* Employment History - Coming Soon */}
            {/* 
            <section className="content-section">
                <h3>Employment History</h3>
                <p style={{color: '#999'}}>No employment history yet.</p>
            </section>
            */}

            {/* Top Reviews - Coming Soon */}
            {/*
            <section className="content-section">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3>Top Reviews</h3>
                </div>
                <p style={{color: '#999'}}>No reviews yet.</p>
            </section> 
            */}
        </div>
    );
};

export default ProfileDetailsContent;
