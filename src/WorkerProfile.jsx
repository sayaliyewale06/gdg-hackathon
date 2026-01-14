import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProfileEditForm from './components/worker/ProfileEditForm';
import WorkerSidebar from './components/worker/WorkerSidebar';
import ProfileCard from './components/worker/ProfileCard';
import ProfileDetailsContent from './components/worker/ProfileDetailsContent';
import './components/worker/ProfileDetails.css';
import { DB } from './lib/db'; // Import DB service
import toast from 'react-hot-toast';

const WorkerProfile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [profileData, setProfileData] = useState({
        name: currentUser?.displayName || '',
        role: 'Verified Worker',
        profession: '', // Distinct from role
        phone: '',
        email: currentUser?.email || '',
        location: '',
        availability: 'Available for work',
        about: '',
        skills: [],
        experience: '',
        profilePhoto: currentUser?.photoURL || null,
        totalEarnings: 0,
        weeklyEarnings: 0
    });

    useEffect(() => {
        if (currentUser) {
            loadProfileData();
        }
    }, [currentUser]);

    const loadProfileData = async () => {
        setIsLoading(true);
        try {
            // Fetch from DB
            const dbData = await DB.users.get(currentUser.uid);

            // Base data from Auth (always authoritative for identity)
            const baseData = {
                name: currentUser?.displayName || '',
                email: currentUser?.email || '',
                profilePhoto: currentUser?.photoURL || null,
                role: 'Verified Worker' // Default UI role
            };

            if (dbData) {
                // Merge DB data with base auth data
                // We map 'profession' from DB to 'role' in state for the UI input
                const uiRole = dbData.profession || dbData.role || 'Verified Worker';

                setProfileData(prev => ({
                    ...prev,
                    ...dbData, // This will override fields like phone, about, skills if they exist
                    ...baseData, // Ensure auth identity fields are fresh
                    role: uiRole,
                    totalEarnings: dbData.totalEarnings || 0,
                    weeklyEarnings: dbData.weeklyEarnings || 0
                }));
            } else {
                // First time user, just use Auth data
                setProfileData(prev => ({
                    ...prev,
                    ...baseData,
                    totalEarnings: 0,
                    weeklyEarnings: 0
                }));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // alert('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            // Save to DB
            // We save all profile fields.
            // Note: We don't save 'role' as 'Verified Worker' back to DB 'role' field 
            // if DB expects 'worker'/'hirer'.
            // So we explicitly construct the payload.

            const payload = {
                displayName: profileData.name, // Sync display name
                phone: profileData.phone,
                location: profileData.location,
                about: profileData.about,
                skills: profileData.skills,
                experience: profileData.experience,
                availability: profileData.availability,
                // We might want to separate Role (System) from Profession (Display)
                // In the form: Role/Profession input is mapped to `role` state currently.
                // Let's save that to `profession` in DB.
                profession: profileData.role,
            };

            // Also create/update the user document
            // If user doesn't exist, create. If exists, update.
            // DB.users.create uses setDoc (merge: false usually, but we want merge behavior or explicit create)
            // Our DB.users.create implementation:
            // await setDoc(ref, { ...data, createdAt... }); -> This overwrites!

            // So we should check if we loaded data successfully.
            // Effectively, we can just use DB.users.update if we know they exist.
            // But if they are new (Google Auth only), they might not be in 'users' collection yet.

            const exists = await DB.users.get(currentUser.uid);
            if (exists) {
                await DB.users.update(currentUser.uid, payload);
            } else {
                await DB.users.create(currentUser.uid, {
                    email: currentUser.email,
                    role: 'worker', // System role
                    ...payload,
                    totalEarnings: 0,
                    weeklyEarnings: 0
                });
            }

            setIsEditing(false);
            toast.success('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile. Please try again.');
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        loadProfileData();
    };

    if (isEditing) {
        return (
            <div className="worker-dashboard-layout">
                {/* Nav sidebar stays */}
                <WorkerSidebar activeView="profile" userProfile={profileData} />

                {/* Edit form takes full remaining width */}
                <div className="profile-edit-container">
                    <ProfileEditForm
                        profileData={profileData}
                        setProfileData={setProfileData}
                        onSave={handleSaveProfile}
                        onCancel={handleCancelEdit}
                        isNewProfile={false}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="worker-dashboard-layout">
            {/* Left: Navigation Sidebar (fixed width) */}
            <WorkerSidebar activeView="profile" userProfile={profileData} />

            {/* Middle: Profile Card */}
            <div className="profile-sidebar-card">
                <ProfileCard profileData={profileData} />
            </div>

            {/* Right: Main Profile Content */}
            <div className="profile-main-content">
                <ProfileDetailsContent profileData={profileData} onEdit={handleEditClick} />
            </div>
        </div>
    );
};

export default WorkerProfile;
