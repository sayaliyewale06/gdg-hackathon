import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    MapPin,
    Filter,
    Phone,
    Star
} from 'lucide-react';
import './ShortlistedWorkers.css';

const ShortlistedWorkers = () => {
    const navigate = useNavigate();

    // Mock Data
    const [workers, setWorkers] = useState([
        {
            id: 1,
            name: 'Ramesh Yadav',
            role: 'Construction Laborer',
            location: 'Wagoli, Pune',
            rating: 4.5,
            exp: 3,
            wage: 750,
            skills: ['Masonry', 'Carpentry'],
            img: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            id: 2,
            name: 'Suresh Kumar',
            role: 'Plumber',
            location: 'Hinjewadi',
            rating: 4.0,
            exp: 4,
            wage: 800,
            skills: ['Water Pipe Fitting', 'Troubleshooting', 'Leak Repair'],
            img: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
            id: 3,
            name: 'Mohan Das',
            role: 'Electrician',
            location: 'Baner, Pune',
            rating: 4.8,
            exp: 5,
            wage: 900,
            skills: ['Wiring', 'Circuit Breakers', 'Electrical Repair'],
            img: 'https://randomuser.me/api/portraits/men/62.jpg'
        },
        {
            id: 4,
            name: 'Vinod Patel',
            role: 'Mason',
            location: 'Wakad',
            rating: 4.5,
            exp: 6,
            wage: 700,
            skills: ['Masonry', 'Tile Work'],
            img: 'https://randomuser.me/api/portraits/men/11.jpg'
        },
        {
            id: 5,
            name: 'Kamlesh Kumar',
            role: 'Worker',
            location: 'Pune, Pune',
            rating: 4.8,
            exp: 5,
            wage: 850,
            skills: ['Arc Welding', 'Pipe Welding'],
            img: 'https://randomuser.me/api/portraits/men/55.jpg'
        }
    ]);

    const handleAssign = (name) => {
        const confirmAssign = window.confirm(`Assign job to ${name}?`);
        if (confirmAssign) {
            alert(`Job assigned to ${name} successfully! Check "Ongoing Jobs" for updates.`);
        }
    };

    const handleRemove = (id, name) => {
        const confirmRemove = window.confirm(`Are you sure you want to remove ${name} from shortlisted candidates?`);
        if (confirmRemove) {
            setWorkers(prev => prev.filter(w => w.id !== id));
        }
    };

    const handleContact = (name) => {
        // In a real app, this would select the conversation with this user
        // For now, simple navigation to messages
        navigate('/hire-dashboard/messages');
    };

    // Helper to get skill badge color
    const getSkillColor = (index) => {
        const colors = ['orange', 'blue', 'green', 'purple'];
        return colors[index % colors.length];
    };

    return (
        <main className="center-content-scrollable">
            {/* Breadcrumbs */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Shortlisted Workers</span>
            </div>

            {/* Header */}
            <div className="applicants-header-section" style={{ marginBottom: '24px' }}>
                <h1 className="page-title">Shortlisted Workers</h1>
                <p className="page-subtitle">Review and manage your shortlisted worker candidates.</p>
            </div>

            {/* Filter Bar */}
            <div className="shortlist-filter-bar">
                <select className="filter-select">
                    <option>All Skills</option>
                    <option>Masonry</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                </select>

                <select className="filter-select">
                    <option>All Locations</option>
                    <option>Pune</option>
                    <option>Mumbai</option>
                </select>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Min: ₹</span>
                    <input type="number" defaultValue={0} className="salary-input" />
                </div>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Max: ₹</span>
                    <input type="number" defaultValue={2000} className="salary-input" />
                </div>

                <div className="filter-actions">
                    <span className="clear-filters">Clear Filters</span>
                    <button className="btn-filter"> - Filter</button>
                </div>
            </div>

            {/* List */}
            <h2 className="shortlist-list-header">Shortlisted Workers ({workers.length} Jobs)</h2>

            <div className="shortlist-list">
                {workers.map(worker => (
                    <div className="shortlist-card" key={worker.id}>
                        {/* 1. Image */}
                        <div className="shortlist-img-container">
                            <img src={worker.img} alt={worker.name} className="shortlist-img" />
                        </div>

                        {/* 2. Main Info */}
                        <div className="shortlist-info">
                            <h3 className="shortlist-name">{worker.name}</h3>
                            <p className="shortlist-role">{worker.role}</p>
                            <div className="shortlist-location">
                                <MapPin size={14} /> {worker.location}
                            </div>
                        </div>

                        {/* 3. Details */}
                        <div className="shortlist-details">
                            <div className="shortlist-rating">
                                <span className="stars-gold">{'★'.repeat(Math.floor(worker.rating))}</span>
                                <span style={{ marginLeft: '4px' }}>{/* spacing */}</span>
                                <span>{worker.rating}</span>
                            </div>
                            <div className="shortlist-exp-wage">
                                <strong>₹{worker.wage}/day</strong>
                                <span style={{ color: '#ccc' }}>|</span>
                                <span>{worker.exp} Years Experience</span>
                            </div>
                            <div className="shortlist-skills">
                                {worker.skills.map((skill, idx) => (
                                    <span key={idx} className={`skill-badge ${getSkillColor(idx)}`}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 4. Actions */}
                        <div className="shortlist-actions">
                            <button className="btn-action btn-assign" onClick={() => handleAssign(worker.name)}>Assign Job</button>
                            <button className="btn-action btn-remove" onClick={() => handleRemove(worker.id, worker.name)}>Remove</button>
                            <button className="btn-action btn-contact" onClick={() => handleContact(worker.name)}>Contact</button>

                            <div className="icon-phone-call" title="Call Worker">
                                <Phone size={18} />
                            </div>
                        </div>
                    </div>
                ))}

                {workers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        No shortlisted workers found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {workers.length > 0 && (
                <div className="pagination">
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn">4</button>
                    <button className="page-btn">5</button>
                    <button className="page-btn">6</button>
                    <button className="page-btn"><ChevronRight size={16} /></button>
                </div>
            )}
        </main>
    );
};

export default ShortlistedWorkers;
