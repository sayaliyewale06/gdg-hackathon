import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Briefcase,
    Clock,
    AlertCircle,
    Info,
    DollarSign,
    Calendar,
    ChevronRight,
    Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import './HirerDashboard.css';
import './PostJob.css';
import { DB } from './lib/db';
import { useAuth } from './context/AuthContext';

const PostJob = () => {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        location: 'Sector 21, Noida',
        category: 'Electrician',
        wage: '800',
        duration: 4,
        urgent: false,
        description: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDurationChange = (increment) => {
        setFormData(prev => ({
            ...prev,
            duration: Math.max(1, prev.duration + increment)
        }));
    };

    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) return;

        try {
            await DB.jobs.create({
                ...formData,
                wage: Number(formData.wage),
                isUrgent: formData.urgent, // Map form field to schema field
                hirerId: currentUser.uid,
                hirerName: currentUser.displayName || 'Unknown Hirer',
                hirerPic: currentUser.photoURL || null,
                hirerRating: 4.5, // Default or fetch real rating
                status: 'open',
            });
            toast.success('Job Posted Successfully!');
            navigate('/hire-dashboard');
        } catch (error) {
            console.error("Error posting job:", error);
            // Alert specific Zod error if available, or general error message
            const errorMessage = error.issues
                ? error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')
                : error.message;
            toast.error(`Failed to post job: ${errorMessage}`);
        }
    };

    return (
        <>
            {/* MAIN CONTENT AREA */}
            <main className="center-content-scrollable">
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Post a Job</span>
                </div>

                <div className="welcome-banner">
                    <h1>Post a Job</h1>
                    <p>Fill in the details below to find the best workers.</p>
                </div>

                <form className="post-job-form" onSubmit={handleSubmit}>

                    {/* Job Title */}
                    <div className="form-group">
                        <label className="form-label">
                            Job Title <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Electrician Needed for Wiring"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-row">
                        {/* Location */}
                        <div className="form-group">
                            <label className="form-label">
                                Location <span className="required-star">*</span>
                            </label>
                            <div className="select-wrapper">
                                <MapPin size={18} className="input-icon" />
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="form-select input-with-icon"
                                >
                                    <option value="Sector 21, Noida">Sector 21, Noida</option>
                                    <option value="Sector 18, Noida">Sector 18, Noida</option>
                                    <option value="Sector 62, Noida">Sector 62, Noida</option>
                                </select>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label">
                                Category <span className="required-star">*</span>
                            </label>
                            <div className="select-wrapper">
                                <Briefcase size={18} className="input-icon" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-select input-with-icon"
                                >
                                    <option value="Electrician">Electrician</option>
                                    <option value="Plumber">Plumber</option>
                                    <option value="Carpenter">Carpenter</option>
                                    <option value="Mason">Mason</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Daily Wage */}
                        <div className="form-group">
                            <label className="form-label">
                                Daily Wage <span className="required-star">*</span>
                            </label>
                            <div className="input-wrapper">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    name="wage"
                                    value={formData.wage}
                                    onChange={handleChange}
                                    className="form-input currency-input"
                                />
                            </div>
                        </div>

                        {/* Job Duration */}
                        <div className="form-group">
                            <label className="form-label">
                                Job Duration
                            </label>
                            <div className="duration-urgent-wrapper">
                                <div className="duration-control">
                                    <button type="button" onClick={() => handleDurationChange(-1)} className="duration-btn">-</button>
                                    <span className="duration-display">{formData.duration} Days</span>
                                    <button type="button" onClick={() => handleDurationChange(1)} className="duration-btn">+</button>
                                </div>
                                <div className="urgent-toggle-wrapper">
                                    <span className={`urgent-label ${formData.urgent ? 'is-urgent' : ''}`}>URGENT</span>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="urgent"
                                            checked={formData.urgent}
                                            onChange={handleChange}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="form-group">
                        <label className="form-label">
                            Job Description
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Describe job requirements and expectations clearly..."
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                        ></textarea>
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            Post Job
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/hire-dashboard')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>

            {/* RIGHT SIDEBAR - TIPS */}
            <aside className="right-sidebar-scrollable">
                <h3 className="right-sidebar-title">Tip for Effective Posting</h3>
                <div className="tips-box">
                    <div className="tip-item">
                        <div className="tip-icon"><Info size={18} /></div>
                        <p className="tip-text">Provide clear and specific job titles</p>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon"><Star size={18} /></div>
                        <p className="tip-text">Describe job requirements and expectations clearly</p>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon"><DollarSign size={18} /></div>
                        <p className="tip-text">Set a fair daily wage matching market rates</p>
                    </div>
                    <div className="tip-item">
                        <div className="tip-icon"><AlertCircle size={18} /></div>
                        <p className="tip-text">Mark as urgent if the job is required immediately</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default PostJob;
