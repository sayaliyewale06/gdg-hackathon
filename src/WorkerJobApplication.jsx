import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';
import './WorkerDashboard.css';
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const WorkerJobApplication = ({ job, onCancel, onApplicationSuccess }) => {
    const { currentUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        availability_confirmed: false,
        requirements_understood: false,
        safety_gear_agreed: false,
        pay_rate_accepted: false,
        message: `Hello ${job.hirerName || 'Recruiter'}, I would like to apply for the ${job.title} job. I am available and have experience with similar work. Please share the details of the job. Thank you!`
    });

    // All 4 checkboxes must be checked
    const isFormValid =
        formData.availability_confirmed &&
        formData.requirements_understood &&
        formData.safety_gear_agreed &&
        formData.pay_rate_accepted;

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validate all checkboxes
        if (!isFormValid) {
            alert('Please confirm all application requirements');
            return;
        }

        // Validate message
        if (formData.message.trim().length < 20) {
            alert('Please provide a detailed message (minimum 20 characters)');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await DB.applications.create({
                jobId: job.id,
                workerId: currentUser.uid,
                hirerId: job.hirerId,
                status: 'pending',
                workerName: currentUser.displayName,
                workerPic: currentUser.photoURL,
                jobTitle: job.title,

                // New Fields
                message: formData.message.trim(),
                availability_confirmed: formData.availability_confirmed,
                requirements_understood: formData.requirements_understood,
                safety_gear_agreed: formData.safety_gear_agreed,
                pay_rate_accepted: formData.pay_rate_accepted
            });

            // Notification
            await DB.notifications.create({
                userId: job.hirerId,
                type: 'application',
                title: 'New Job Application',
                subtitle: `${currentUser.displayName || 'A worker'} applied for ${job.title}`,
                data: { jobId: job.id, workerId: currentUser.uid }
            });

            // Show success message
            window.alert('Application submitted successfully!');
            onApplicationSuccess(job.id);

        } catch (err) {
            console.error("Application Error:", err);
            const errorMessage = err.message || "Failed to submit application. Please try again.";
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const getTimeAgo = (dateStr) => {
        if (!dateStr) return 'Recently';
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        let interval = seconds / 3600;
        if (interval > 24) return Math.floor(interval / 24) + " days ago";
        return "Just now";
    };

    return (
        <div className="worker-job-application-container">
            {/* Header */}
            <div className="app-header-row">
                <div className="breadcrumbs">
                    <span>Dashboard</span> / <span>Find Jobs</span> / <span className="current">Apply for Job</span>
                </div>
                <h1 className="page-title">Apply for Job</h1>
            </div>

            <div className="app-main-layout">
                {/* Left Column: Form */}
                <div className="app-form-column">

                    {/* Job Summary Card */}
                    <div className="app-job-summary-card">
                        <div className="ajs-header">
                            <h2>{job.title} <span className="ajs-wage">₹{job.wage}/day</span></h2>
                            <p className="ajs-loc">{job.location}</p>
                        </div>
                        <div className="ajs-recruiter">
                            <img src={job.hirerPic || "https://randomuser.me/api/portraits/men/99.jpg"} alt="Recruiter" className="ajs-recruiter-pic" />
                            <div className="ajs-recruiter-info">
                                <strong>{job.hirerName || "Recruiter"}</strong>
                                <span>Recruiter • {job.hirerRating || 4.5} ★ • Posted {getTimeAgo(job.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Application Details Form */}
                    <div className="app-form-section">
                        <h3>Application Details:</h3>

                        <div className="checkbox-group">
                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={formData.availability_confirmed}
                                    onChange={(e) => setFormData({ ...formData, availability_confirmed: e.target.checked })}
                                />
                                <span className="custom-checkbox-box"></span>
                                <span className="checkbox-label">I am available to work on the specified date(s)</span>
                            </label>

                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={formData.requirements_understood}
                                    onChange={(e) => setFormData({ ...formData, requirements_understood: e.target.checked })}
                                />
                                <span className="custom-checkbox-box"></span>
                                <span className="checkbox-label">I understand the job requirements and have done similar work before.</span>
                            </label>

                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={formData.safety_gear_agreed}
                                    onChange={(e) => setFormData({ ...formData, safety_gear_agreed: e.target.checked })}
                                />
                                <span className="custom-checkbox-box"></span>
                                <span className="checkbox-label">I agree to wear appropriate safety gear.</span>
                            </label>

                            <label className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={formData.pay_rate_accepted}
                                    onChange={(e) => setFormData({ ...formData, pay_rate_accepted: e.target.checked })}
                                />
                                <span className="custom-checkbox-box"></span>
                                <span className="checkbox-label">I accept the daily pay of ₹{job.wage} to this job.</span>
                            </label>
                        </div>

                        {!isFormValid && (
                            <div style={{ color: '#D98347', fontSize: '0.9rem', marginBottom: '16px', fontWeight: '500' }}>
                                <FaExclamationCircle style={{ marginRight: '6px', position: 'relative', top: '2px' }} />
                                Please check all boxes to proceed
                            </div>
                        )}

                        <div className="message-section">
                            <label>Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                            />
                        </div>

                        {error && <div className="error-message"><FaExclamationCircle /> {error}</div>}

                        <div className="form-actions-row">
                            <button className="cancel-btn" onClick={onCancel} disabled={submitting}>Cancel</button>
                            <button
                                className={`submit-btn ${!isFormValid ? 'disabled' : ''}`}
                                onClick={handleSubmit}
                                disabled={!isFormValid || submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Right Sidebar: Tips */}
                <div className="app-sidebar-column">
                    <div className="app-tips-card">
                        <h3>Application Tips</h3>
                        <ul className="tips-check-list">
                            <li><FaCheckCircle className="tip-icon-check" /> Confirm availability and understand job requirements.</li>
                            <li><FaCheckCircle className="tip-icon-check" /> Agree to terms and pay rate before applying.</li>
                            <li><FaCheckCircle className="tip-icon-check" /> Send a brief, polite message to the recruiter.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerJobApplication;
