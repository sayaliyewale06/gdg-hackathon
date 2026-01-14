import React, { useState } from 'react';
import './ProfileDetails.css';

const ProfileEditForm = ({ profileData, setProfileData, onSave, onCancel, isNewProfile }) => {
    const [selectedSkills, setSelectedSkills] = useState(profileData.skills || []);

    const availableSkills = [
        'Electrical Wiring',
        'Switch and Socket Repair',
        'Circuit Breaker Installation',
        'Electrical Maintenance',
        'Plumbing',
        'Painting',
        'Carpentry',
        'Masonry',
        'Welding'
    ];

    const handleSkillToggle = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
            setProfileData({ ...profileData, skills: selectedSkills.filter(s => s !== skill) });
        } else {
            setSelectedSkills([...selectedSkills, skill]);
            setProfileData({ ...profileData, skills: [...selectedSkills, skill] });
        }
    };

    return (
        <div className="profile-edit-page">
            <div className="profile-header">
                <h1>{isNewProfile ? 'Complete Your Profile' : 'Edit Profile'}</h1>
                <p>Fill in your details to get started with job opportunities</p>
            </div>

            <form onSubmit={onSave} className="profile-form">
                {/* Profile Photo */}
                <div className="form-section">
                    <label>Profile Photo</label>
                    <div className="photo-upload">
                        <div className="photo-preview">
                            {profileData.profilePhoto ? (
                                <img src={profileData.profilePhoto} alt="Profile" />
                            ) : (
                                <div className="placeholder-photo">
                                    <span>📷</span>
                                    <span>Upload Photo</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                // Handle image upload
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProfileData({ ...profileData, profilePhoto: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Basic Information */}
                <div className="form-row">
                    <div className="form-section">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label>Role/Profession *</label>
                        <input
                            type="text"
                            value={profileData.role}
                            onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                            placeholder="e.g., Electrician, Plumber"
                            required
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="form-row">
                    <div className="form-section">
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="+91 9876543210"
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label>Email Address *</label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="form-section">
                    <label>Location *</label>
                    <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="City, State, Country"
                        required
                    />
                </div>

                {/* Availability */}
                <div className="form-section">
                    <label>Availability Status</label>
                    <select
                        value={profileData.availability}
                        onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                    >
                        <option value="Available for work">Available for work</option>
                        <option value="Busy">Currently busy</option>
                        <option value="Available in 2-3 days">Available in 2-3 days</option>
                        <option value="Available next week">Available next week</option>
                    </select>
                </div>

                {/* Skills */}
                <div className="form-section">
                    <label>Skills & Experience *</label>
                    <div className="skills-grid">
                        {availableSkills.map(skill => (
                            <label key={skill} className="skill-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedSkills.includes(skill)}
                                    onChange={() => handleSkillToggle(skill)}
                                />
                                <span>{skill}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Years of Experience */}
                <div className="form-section">
                    <label>Years of Experience *</label>
                    <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                        placeholder="e.g., 5+ Years of Experience as an Electrician"
                        required
                    />
                </div>

                {/* About */}
                <div className="form-section">
                    <label>About You *</label>
                    <textarea
                        value={profileData.about}
                        onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                        placeholder="Tell employers about yourself, your experience, and why you're great at what you do..."
                        rows={6}
                        required
                    />
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    {!isNewProfile && (
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="save-btn">
                        {isNewProfile ? 'Create Profile' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditForm;
