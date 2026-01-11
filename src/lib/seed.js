import { DB } from './db';

const DUMMY_JOBS = [
    {
        title: 'Urgent Mason Needed',
        category: 'mason',
        wage: 950,
        location: 'Hinjewadi, Pune',
        description: 'Need a skilled mason for 3 days of wall repair work. Immediate joining required.',
        isUrgent: true,
        hirerId: 'seed_hirer_01',
        hirerName: 'Ramesh Pawar',
        hirerPic: 'https://randomuser.me/api/portraits/men/32.jpg',
        hirerRating: 4.8,
        applicantsCount: 5,
        status: 'open',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
        title: 'Loading/Unloading Help',
        category: 'general',
        wage: 700,
        location: 'Wakad, Pune',
        description: 'Shifting house luggage. Heavy lifting involved.',
        isUrgent: false,
        hirerId: 'seed_hirer_02',
        hirerName: 'Vikram Singh',
        hirerPic: 'https://randomuser.me/api/portraits/men/45.jpg',
        hirerRating: 4.5,
        applicantsCount: 2,
        status: 'open',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
    },
    {
        title: 'Electrician for Shop Wiring',
        category: 'electrician',
        wage: 1200,
        location: 'Market Yard, Pune',
        description: 'Full shop rewiring needed. Must bring own tools.',
        isUrgent: true,
        hirerId: 'seed_hirer_03',
        hirerName: 'Amit Traders',
        hirerPic: 'https://randomuser.me/api/portraits/men/22.jpg',
        hirerRating: 5.0,
        applicantsCount: 12,
        status: 'open',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
    },
    {
        title: 'Plumber for Leak Fix',
        category: 'plumber',
        wage: 600,
        location: 'Baner, Pune',
        description: 'Kitchen sink leakage repair. 2-3 hours work.',
        isUrgent: false,
        hirerId: 'seed_hirer_04',
        hirerName: 'Sneha Gupta',
        hirerPic: 'https://randomuser.me/api/portraits/women/44.jpg',
        hirerRating: 4.2,
        applicantsCount: 0,
        status: 'open',
        createdAt: new Date().toISOString() // Today
    },
    {
        title: 'Painter Helper',
        category: 'painter',
        wage: 850,
        location: 'Kothrud, Pune',
        description: 'Need helper for exterior painting work.',
        isUrgent: false,
        hirerId: 'seed_hirer_05',
        hirerName: 'Color World',
        hirerPic: 'https://randomuser.me/api/portraits/men/11.jpg',
        hirerRating: 4.7,
        applicantsCount: 8,
        status: 'in_progress',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    }
];

export const seedDatabase = async () => {
    console.log("Seeding database...");
    try {
        for (const job of DUMMY_JOBS) {
            // Using raw addDoc or DB.jobs.create but DB.jobs.create sets createdAt automatically to NOW, 
            // which we might want to override for dummy data to show history.
            // However, DB.jobs.create overrides it. Let's strictly use DB.jobs.create for safety 
            // or modify it. For simplicity, we'll use DB.jobs.create and let dates be new, 
            // OR we can manually bypass if we want exact dates. 
            // Let's use DB.jobs.create to ensure schema compliance, accepting 'now' dates is fine.

            const { id, ...jobData } = job;
            await DB.jobs.create(jobData);
        }
        console.log("Database seeded successfully!");
        alert("Database seeded with 5 dummy jobs!");
        window.location.reload();
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database: " + error.message);
    }
};
