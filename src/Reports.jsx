import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Briefcase,
    Users,
    IndianRupee,
    ChevronDown,
    Download,
    ChevronLeft
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();

    // Mock KPI Data
    const kpiData = {
        jobsPosted: 5,
        workersHired: 23,
        totalPayments: 61700
    };

    // Mock Table Data
    const [reportData] = useState([
        {
            id: 1,
            name: 'Mohan Das',
            role: 'Electrician',
            jobRole: 'Electrician',
            location: 'Noida',
            phone: '+91 9665 32****',
            details: '5 Years Experience',
            date: 'Apr 26, 2024',
            payment: 3200,
            status: 'Paid',
            img: 'https://randomuser.me/api/portraits/men/62.jpg'
        },
        {
            id: 2,
            name: 'Vinod Patel',
            role: 'Mason',
            jobRole: 'Mason',
            location: 'Wakad', // Inferred location from context or blank if not specified
            phone: '+91 9665 32****',
            details: '4 Years Experience',
            date: 'Apr 25, 2024',
            payment: 3500,
            status: 'Paid',
            img: 'https://randomuser.me/api/portraits/men/11.jpg'
        },
        {
            id: 3,
            name: 'Ramesh Yadav',
            role: 'Construction Laborer',
            jobRole: 'Electrician', // As per prompt Row 3: Job: Electrician, Construction Laborer ?? Maybe Job Title is Electrician? Or Role? Prompt says "Job: Electrician, Construction Laborer". I'll use Construction Laborer as Role and Electrician as Job Title to match headers.
            location: '',
            phone: '+91 9665 32****',
            details: '3 Years Experience',
            date: 'Apr 22, 2024',
            payment: 2250,
            status: 'Pending',
            img: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            id: 4,
            name: 'Suresh Kumar',
            role: 'Plumber',
            jobRole: 'Plumber',
            location: 'Hinjewadi',
            phone: '+91 9587 64****',
            details: '6 Years Experience',
            date: 'Apr 17, 2024',
            payment: 1600,
            status: 'Paid',
            img: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        {
            id: 5,
            name: 'Kamlesh Kumar',
            role: 'Welder',
            jobRole: 'Welder',
            location: 'Baner Pune',
            phone: '+91 787 64****',
            details: '5 Years Experience',
            date: 'Apr 15, 2024',
            payment: 3400,
            status: 'Paid',
            img: 'https://randomuser.me/api/portraits/men/55.jpg'
        },
        {
            id: 6,
            name: 'Arjun Verma',
            role: 'Auto Driver',
            jobRole: 'Auto Driver',
            location: '',
            phone: '', // Detailed phone not provided in prompt for Row 6
            details: '',
            date: 'Apr 14, 2024',
            payment: 500,
            status: 'Pending',
            img: 'https://randomuser.me/api/portraits/men/33.jpg'
        }
    ]);

    return (
        <div className="reports-page-layout">

            {/* LEFT COLUMN: Main Content (Scrolls) */}
            <main className="reports-main-content">
                {/* Breadcrumbs */}
                <div className="breadcrumb">
                    <span className="breadcrumb-link" onClick={() => navigate('/hire-dashboard')}>Dashboard</span>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span className="breadcrumb-current">Reports</span>
                </div>

                {/* Header */}
                <div className="applicants-header-section">
                    <h1 className="page-title">Reports</h1>
                    <p className="page-subtitle">View and generate reports to track your hiring and payments.</p>
                </div>

                {/* KPI Cards */}
                <div className="reports-kpi-row">
                    <div className="reports-kpi-card">
                        <div className="kpi-icon"><Briefcase size={24} /></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Jobs Posted</span>
                            <span className="kpi-value">{kpiData.jobsPosted}</span>
                        </div>
                    </div>
                    <div className="reports-kpi-card">
                        <div className="kpi-icon"><Users size={24} /></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Workers Hired</span>
                            <div className="kpi-value-row">
                                <span className="kpi-value">{kpiData.workersHired}</span>
                                <span className="badge-new">New</span>
                            </div>
                        </div>
                    </div>
                    <div className="reports-kpi-card">
                        <div className="kpi-icon"><IndianRupee size={24} /></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Total Payments</span>
                            <div className="kpi-value-row">
                                <span className="kpi-value">₹{kpiData.totalPayments.toLocaleString()}</span>
                                <span className="badge-new">New</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="reports-filter-bar">
                    <div className="filter-group">
                        <span className="filter-label">Report Type:</span>
                        <select className="filter-select">
                            <option>All</option>
                            <option>Jobs Posted</option>
                            <option>Workers Hired</option>
                            <option>Payments</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <span className="filter-label">Date Range:</span>
                        <select className="filter-select">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                            <option>Last 90 Days</option>
                        </select>
                    </div>

                    <span className="clear-filters">Clear Filters</span>
                    <button className="btn-filter" style={{ marginLeft: 'auto' }}>Filter</button>
                </div>

                {/* Table */}
                <div className="reports-table-container">
                    <div className="table-header-actions">
                        <h2 className="table-title">Reports Table</h2>
                        <button className="btn-download">Download Report <ChevronDown size={14} /></button>
                    </div>

                    <div className="table-scroll-wrapper">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>Worker</th>
                                    <th>Job Title / Location</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map(row => (
                                    <tr key={row.id}>
                                        <td className="cell-worker">
                                            <img src={row.img} alt={row.name} className="cell-worker-img" />
                                            <div className="cell-worker-info">
                                                <h4>{row.name}</h4>
                                                <div className="cell-worker-sub">{row.role} {row.phone ? `• ${row.phone}` : ''}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell-job-title">{row.jobRole}</div>
                                            <div className="cell-job-loc">{row.location}</div>
                                        </td>
                                        <td>{row.date}</td>
                                        <td><strong>₹{row.payment.toLocaleString()}</strong></td>
                                        <td>
                                            <span className={`status-badge ${row.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-view-details">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination (Page 3 Active) */}
                <div className="pagination">
                    <button className="page-btn"><ChevronLeft size={16} /></button>
                    <button className="page-btn">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn active">3</button>
                    <button className="page-btn">4</button>
                    <button className="page-btn">5</button>
                    <button className="page-btn">6</button>
                    <button className="page-btn"><ChevronRight size={16} /></button>
                </div>
            </main>

            {/* RIGHT COLUMN: Sidebar Panel (Fixed/Flush) */}
            <aside className="reports-right-panel">
                <h3 className="tip-header">Tip for Using Reports</h3>
                <ul className="tip-list">
                    <li className="tip-item">
                        <span className="tip-icon">📊</span>
                        <div>Use filters to find specific report types</div>
                    </li>
                    <li className="tip-item">
                        <span className="tip-icon">⚙️</span>
                        <div>Analyze hiring and payment trends regularly</div>
                    </li>
                    <li className="tip-item">
                        <span className="tip-icon">💾</span>
                        <div>Download reports to keep records</div>
                    </li>
                </ul>

                {/* Duplicate tip section as requested in prompt "appears twice in your design" - checking design it might just be the same card repeated or different content. I will duplicate it visually as user explicitly said "Right Sidebar - "Tip for Using Reports" section (appears twice in your design)" */}
                <div style={{ marginTop: '32px' }}></div>
                <h3 className="tip-header">Tip for Using Reports</h3>
                <ul className="tip-list">
                    <li className="tip-item">
                        <span className="tip-icon">📍</span>
                        <div>Use filters to find specific report types</div>
                    </li>
                    <li className="tip-item">
                        <span className="tip-icon">Il</span>
                        <div>Analyze hiring and payment trends regularly</div>
                    </li>
                </ul>
            </aside>

        </div>
    );
};

export default Reports;
