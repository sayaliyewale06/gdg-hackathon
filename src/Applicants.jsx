import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    ChevronRight,
    Star,
    Phone,
    Monitor, /* Using Monitor as generic placeholder if WhatsApp icon not available in lucide set widely */
    Filter
} from 'lucide-react';
import './Applicants.css';

const Applicants = () => {
    const navigate = useNavigate();

    // Mock Data
    const applicantsData = [
        {
            id: 1,
            name: 'Ramesh Yadav',
            role: 'Construction Laborer',
            location: 'Wagoli, Pune',
            rating: 4.5,
            exp: 3,
            skills: ['Masonry', 'Carpentry'],
            wage: 750,
            phone: '+91 91780 12***',
            img: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            id: 2,
            name: 'Suresh Kumar',
            role: 'Plumber',
            location: 'Hinjewadi',
            rating: 4.0,
            exp: 4,
            skills: ['Water Pipe Fitting', 'Troubleshooting'],
            wage: 800,
            phone: '+91 98765 43***',
            img: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
            id: 3,
            name: 'Mohan Das',
            role: 'Electrician',
            location: 'Baner, Pune',
            rating: 4.8,
            exp: 5,
            skills: ['Wiring', 'Circuit Breakers', 'Electrical Repair'],
            wage: 900,
            phone: '+91 91234 56***',
            img: 'https://randomuser.me/api/portraits/men/62.jpg'
        },
        {
            id: 4,
            name: 'Vinod Patel',
            role: 'Mason',
            location: 'Wakad',
            rating: 4.5,
            exp: 6,
            skills: ['Masonry', 'Tile Work'],
            wage: 700,
            phone: '+91 88888 77***',
            img: 'https://randomuser.me/api/portraits/men/11.jpg'
        },
        {
            id: 5,
            name: 'Arjun Verma',
            role: 'Auto Driver',
            location: 'Hinjewadi',
            rating: 4.0,
            exp: 7,
            skills: ['Local Driving', 'Goods Delivery'],
            wage: 500,
            phone: '+91 77777 66***',
            img: 'https://randomuser.me/api/portraits/men/33.jpg'
        },
        {
            id: 6,
            name: 'Rahul Singh',
            role: 'Painter',
            location: 'Karol Bagh, Delhi',
            rating: 5.0,
            exp: 8,
            skills: ['House Painting', 'Wall Repair', 'Primer Coat'],
            wage: 600,
            phone: '+91 99999 00***',
            img: 'https://randomuser.me/api/portraits/men/24.jpg'
        }
    ];

    const [filters, setFilters] = useState({
        skill: 'All Skills',
        location: 'All Locations',
        minSalary: 0,
        maxSalary: 2000
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <main className="center-content-scrollable">
            {/* Breadcrumbs */}
            <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-current">Applicants</span>
            </div>

            {/* Header */}
            <div className="applicants-header-section">
                <h1 className="page-title">Applicants</h1>
                <p className="page-subtitle">Review and shortlist applicants for your job posts.</p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <select
                    name="skill"
                    className="filter-select"
                    value={filters.skill}
                    onChange={handleFilterChange}
                >
                    <option>All Skills</option>
                    <option>Masonry</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                </select>

                <select
                    name="location"
                    className="filter-select"
                    value={filters.location}
                    onChange={handleFilterChange}
                >
                    <option>All Locations</option>
                    <option>Pune</option>
                    <option>Delhi</option>
                </select>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Min: ₹</span>
                    <input
                        type="number"
                        name="minSalary"
                        className="salary-input"
                        value={filters.minSalary}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="salary-range">
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Max: ₹</span>
                    <input
                        type="number"
                        name="maxSalary"
                        className="salary-input"
                        value={filters.maxSalary}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-actions">
                    <span className="clear-filters" onClick={() => setFilters({ skill: 'All Skills', location: 'All Locations', minSalary: 0, maxSalary: 2000 })}>
                        Clear Filters
                    </span>
                    <button className="btn-filter"> - Filter</button>
                </div>
            </div>

            {/* List */}
            <h2 className="applicants-list-header">Applicants ({applicantsData.length} Jobs)</h2>

            <div className="applicants-list">
                {applicantsData.map(applicant => (
                    <div className="applicant-card" key={applicant.id}>
                        {/* 1. Image */}
                        <div className="applicant-img-container">
                            <img src={applicant.img} alt={applicant.name} className="applicant-img" />
                        </div>

                        {/* 2. Main Info */}
                        <div className="applicant-main-info">
                            <h3 className="applicant-name">{applicant.name}</h3>
                            <p className="applicant-role">{applicant.role}</p>
                            <div className="applicant-location">
                                <MapPin size={14} /> {applicant.location}
                            </div>
                        </div>

                        {/* 3. Details (Rating, Exp, Skills) */}
                        <div className="applicant-details">
                            <div className="rating-row">
                                <span className="stars">{'★'.repeat(Math.round(applicant.rating))}</span>
                                <span style={{ color: '#444' }}>{applicant.rating}</span>
                            </div>
                            <div className="experience-row">
                                {applicant.exp} Years Experience:
                                <div className="skills-tags">
                                    {applicant.skills.map((skill, idx) => (
                                        <span className="skill-tag" key={idx}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. Wages & Contact */}
                        <div className="applicant-wages-contact">
                            <div className="wage-row">
                                ₹{applicant.wage}<span className="wage-unit">/day</span>
                            </div>
                            {/* Duplicate wage shown in requirement mock? mimicking layout with two columns of wage if needed, or just contact info */}
                            <div className="wage-row" style={{ opacity: 0.7 }}>
                                ₹{applicant.wage}<span className="wage-unit">/day</span>
                            </div>
                            <div className="contact-row">
                                <Phone size={16} />
                                <span>{applicant.phone}</span>
                            </div>
                        </div>

                        {/* 5. Action */}
                        <button className="btn-shortlist">Shortlist</button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">4</button>
                <button className="page-btn">5</button>
                <button className="page-btn"><ChevronRight size={16} /></button>
            </div>
        </main>
    );
};

export default Applicants;
