import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DB } from '../lib/db';
import { useAuth } from '../context/AuthContext';

const PostJobModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'general',
        wage: '',
        location: '',
        description: '',
        isUrgent: false
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await DB.jobs.create({
                title: formData.title,
                category: formData.category,
                wage: Number(formData.wage),
                location: formData.location,
                description: formData.description || '',
                isUrgent: formData.isUrgent,
                hirerId: currentUser.uid,
                hirerName: currentUser.displayName || 'Unknown Hirer',
                hirerPic: currentUser.photoURL || '',
                // Defaulting hirerRating as it's not currently tracked on user profile creation
                hirerRating: 0
            });
            onClose();
            // Ideally trigger a refresh in parent, but for now just close
            alert('Job Posted Successfully!');
        } catch (error) {
            console.error("Error posting job:", error);
            alert(`Failed to post job: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Inline styles for simplicity in this generated component
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    };

    const modalStyle = {
        backgroundColor: '#1e293b', // Matches dark theme roughly
        padding: '24px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        color: 'white',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginTop: '6px',
        marginBottom: '16px',
        borderRadius: '6px',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: 'white'
    };

    const labelStyle = {
        fontSize: '0.9rem',
        color: '#94a3b8'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Post a New Job</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={labelStyle}>Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            placeholder="e.g. Need Plumber for Kitchen"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="general">General Helper</option>
                                <option value="mason">Mason (Mistri)</option>
                                <option value="plumber">Plumber</option>
                                <option value="electrician">Electrician</option>
                                <option value="painter">Painter</option>
                                <option value="driver">Driver</option>
                                <option value="carpenter">Carpenter</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Daily Wage (₹)</label>
                            <input
                                type="number"
                                name="wage"
                                value={formData.wage}
                                onChange={handleChange}
                                required
                                min="1"
                                style={inputStyle}
                                placeholder="500"
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            placeholder="e.g. Shivaji Nagar, Pune"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Description (Optional)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            style={{ ...inputStyle, fontFamily: 'inherit' }}
                            placeholder="Details about the work..."
                        />
                    </div>

                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            name="isUrgent"
                            checked={formData.isUrgent}
                            onChange={handleChange}
                            id="urgent-check"
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <label htmlFor="urgent-check" style={{ color: '#ef4444', fontWeight: 'bold' }}>Mark as Urgent</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: loading ? '#475569' : '#d98347', // Orange brand color
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJobModal;
