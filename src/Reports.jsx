import React, { useState, useEffect } from 'react';
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

import { useAuth } from './context/AuthContext';
import { DB } from './lib/db';

const Reports = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState({
        jobsPosted: 0,
        workersHired: 0,
        totalPayments: 0
    });
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchReportData = async () => {
            if (currentUser?.uid) {
                try {
                    const [jobs, applications] = await Promise.all([
                        DB.jobs.getByHirer(currentUser.uid),
                        DB.applications.getByHirer(currentUser.uid)
                    ]);

                    // Process KPIs
                    const jobsPosted = jobs.length;
                    const hiredApps = applications.filter(a => ['accepted', 'completed'].includes(a.status));
                    const workersHired = hiredApps.length;

                    // Create Job Map for quick lookup of wage/location
                    const jobMap = new Map(jobs.map(j => [j.id, j]));

                    // Calculate Total Payments (Sum of wages for completed jobs)
                    // Assumption: Payment = Job Wage. Only count 'completed' for payments.
                    let totalPayments = 0;
                    hiredApps.forEach(app => {
                        if (app.status === 'completed') {
                            const job = jobMap.get(app.jobId);
                            if (job?.wage) totalPayments += Number(job.wage);
                        }
                    });

                    setKpiData({ jobsPosted, workersHired, totalPayments });

                    // Process Table Data
                    // Fetch worker details for all relevant applications
                    const uniqueWorkerIds = [...new Set(applications.map(a => a.workerId))];
                    const workerPromises = uniqueWorkerIds.map(uid => DB.users.get(uid));
                    const workerDocs = await Promise.all(workerPromises);
                    const workerMap = new Map(workerDocs.map(u => [u.uid, u]));

                    const rows = applications.map(app => {
                        const job = jobMap.get(app.jobId);
                        const worker = workerMap.get(app.workerId);

                        return {
                            id: app.id,
                            name: worker?.displayName || app.workerName || 'Unknown Driver',
                            role: worker?.role || 'Worker',
                            jobRole: app.jobTitle || job?.title || 'Job',
                            location: job?.location || 'Unknown',
                            phone: worker?.phone || 'N/A',
                            details: worker?.experience ? `${worker.experience} Years Experience` : '',
                            date: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
                            payment: job?.wage || 0,
                            status: app.status === 'completed' ? 'Paid' : 'Pending', // Simplified status mapping
                            img: worker?.photoURL || app.workerPic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        };
                    });

                    setReportData(rows);

                } catch (error) {
                    console.error("Error fetching report data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchReportData();
    }, [currentUser]);

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
                            <span className="kpi-value">{loading ? '...' : kpiData.jobsPosted}</span>
                        </div>
                    </div>
                    <div className="reports-kpi-card">
                        <div className="kpi-icon"><Users size={24} /></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Workers Hired</span>
                            <div className="kpi-value-row">
                                <span className="kpi-value">{loading ? '...' : kpiData.workersHired}</span>
                                {/* <span className="badge-new">New</span> */}
                            </div>
                        </div>
                    </div>
                    <div className="reports-kpi-card">
                        <div className="kpi-icon"><IndianRupee size={24} /></div>
                        <div className="kpi-info">
                            <span className="kpi-label">Total Payments</span>
                            <div className="kpi-value-row">
                                <span className="kpi-value">₹{loading ? '...' : kpiData.totalPayments.toLocaleString()}</span>
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
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center' }}>Loading reports...</div>
                        ) : (
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
                                    {reportData.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No reports data available.</td>
                                        </tr>
                                    ) : (
                                        reportData.map(row => (
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
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
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
