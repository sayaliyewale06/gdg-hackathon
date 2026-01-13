import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';
import './JobApplication.css';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const JobApplication = () => {
    const location = useLocation();
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Get job details passed from previous page or fetch if missing
    // Ideally we should fetch fresh if not present, but for now we fallback to location state
    const [jobDetails, setJobDetails] = useState(location.state?.job || null);
    const [loading, setLoading] = useState(!location.state?.job);

    useEffect(() => {
        if (!jobDetails && jobId) {
            const fetchJob = async () => {
                try {
                    const job = await DB.jobs.get(jobId);
                    setJobDetails(job);
                } catch (error) {
                    console.error("Error fetching job:", error);
                    toast.error("Job not found");
                    navigate('/active-jobs'); // Fallback
                } finally {
                    setLoading(false);
                }
            };
            fetchJob();
        }
    }, [jobId, jobDetails, navigate]);

    const [application, setApplication] = useState({
        coverLetter: '',
        availability: '',
        expectedWage: location.state?.job?.wage ? String(location.state.job.wage) : '',
        experience: '',
        skills: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill wage if available from fetched job
    useEffect(() => {
        if (jobDetails?.wage && !application.expectedWage) {
            setApplication(prev => ({ ...prev, expectedWage: String(jobDetails.wage) }));
        }
    }, [jobDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDetails || !currentUser) return;

        setIsSubmitting(true);

        try {
            await DB.applications.create({
                jobId: jobId,
                workerId: currentUser.uid,
                hirerId: jobDetails.hirerId,
                status: 'pending',
                workerName: currentUser.displayName,
                workerPic: currentUser.photoURL,
                jobTitle: jobDetails.title,

                // New Fields
                coverLetter: application.coverLetter,
                availability: application.availability,
                expectedWage: application.expectedWage,
                experience: application.experience,
                skills: application.skills,

                // Defaults for legacy compatibility/logic
                availability_confirmed: true,
                requirements_understood: true,
                safety_gear_agreed: true,
                pay_rate_accepted: true
            });

            // Notification for Recruiter
            await DB.notifications.create({
                userId: jobDetails.hirerId,
                type: 'application',
                title: 'New Job Application',
                subtitle: `${currentUser.displayName || 'A worker'} applied for ${jobDetails.title}`,
                data: { jobId: jobId, workerId: currentUser.uid }
            });

            // Show success message
            toast.success('Application submitted successfully!');

            // Navigate to My Jobs page
            navigate('/my-jobs');
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Job Details...</div>;
    if (!jobDetails) return <div style={{ padding: '40px', textAlign: 'center' }}>Job not found.</div>;

    return (
        <div className="job-application-page">
            <div className="application-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft style={{ marginRight: '8px' }} /> Back
                </button>
                <h1>Apply for Job</h1>
            </div>

            {/* Job Details Summary */}
            <div className="job-summary-card">
                <div className="job-icon">💼</div>
                <div className="job-info">
                    <h2>{jobDetails.title || 'Job Title'}</h2>
                    <p>📍 {jobDetails.location || 'Location'}</p>
                    <p>💰 ₹{jobDetails.wage || 'Wage'}/day</p>
                    {jobDetails.isUrgent && <span className="urgent-badge">Urgent</span>}
                </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="application-form">
                <div className="form-section">
                    <h3>Why are you a good fit for this job?</h3>
                    <textarea
                        placeholder="Tell the employer why you're perfect for this role..."
                        value={application.coverLetter}
                        onChange={(e) => setApplication({ ...application, coverLetter: e.target.value })}
                        required
                        rows={6}
                    />
                </div>

                <div className="form-section">
                    <h3>When can you start?</h3>
                    <select
                        value={application.availability}
                        onChange={(e) => setApplication({ ...application, availability: e.target.value })}
                        required
                    >
                        <option value="">Select availability</option>
                        <option value="immediately">Immediately</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="2-3 days">In 2-3 days</option>
                        <option value="next week">Next week</option>
                    </select>
                </div>

                <div className="form-section">
                    <h3>Expected Daily Wage</h3>
                    <div className="wage-input">
                        <span>₹</span>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={application.expectedWage}
                            onChange={(e) => setApplication({ ...application, expectedWage: e.target.value })}
                            required
                        />
                        <span>/ day</span>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Relevant Experience</h3>
                    <textarea
                        placeholder="Describe your relevant experience for this job..."
                        value={application.experience}
                        onChange={(e) => setApplication({ ...application, experience: e.target.value })}
                        rows={4}
                    />
                </div>

                <div className="form-section">
                    <h3>Your Skills</h3>
                    <div className="skills-checklist">
                        {['Painting', 'Plastering', 'Interior Work', 'Exterior Work', 'Plumbing', 'Electrician', 'Carpentry', 'Loading/Unloading'].map(skill => (
                            <label key={skill} className="skill-checkbox">
                                <input
                                    type="checkbox"
                                    value={skill}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setApplication({ ...application, skills: [...application.skills, skill] });
                                        } else {
                                            setApplication({ ...application, skills: application.skills.filter(s => s !== skill) });
                                        }
                                    }}
                                    checked={application.skills.includes(skill)}
                                />
                                {skill}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="cancel-button"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobApplication;
