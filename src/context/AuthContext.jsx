import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const signInWithGoogle = async (role) => {
        setError(null);
        console.log("Starting Google Sign In...");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Google Auth Success, User UID:", user.uid);

            // Create or update user profile in Firestore with role
            const userRef = doc(db, 'users', user.uid);
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: role,
                lastLogin: new Date().toISOString()
            };

            console.log("Attempting to write to Firestore:", userData);
            await setDoc(userRef, userData, { merge: true });
            console.log("Firestore write successful!");

            setUserRole(role);
            return result;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            if (error.code === 'permission-denied') {
                setError("Permission denied. Check Firestore Security Rules in Firebase Console.");
            } else if (error.code === 'unavailable' || error.message.includes('offline')) {
                setError("Firestore is offline. Please check if your database is created in Firebase Console.");
            } else {
                setError(error.message);
            }
            throw error;
        }
    };

    const logout = async () => {
        setUserRole(null);
        setError(null);
        return signOut(auth);
    };

    const updateUserRole = async (role) => {
        if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, { role }, { merge: true });
            setUserRole(role);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("Auth State Changed:", user ? "User Logged In" : "User Logged Out");
            setCurrentUser(user);
            setError(null);

            if (user) {
                // Fetch user role from Firestore
                try {
                    const userRef = doc(db, 'users', user.uid);
                    console.log("Fetching user role for UID:", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        console.log("User Data Found:", data);
                        setUserRole(data.role);
                    } else {
                        console.log("No user document found in Firestore for this UID.");
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    if (error.code === 'unavailable' || error.message.includes('offline')) {
                        setError("Database connection failed. Please ensure Firestore is enabled in your Firebase Console.");
                    } else {
                        setError("Failed to fetch user profile: " + error.message);
                    }
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        error,
        signInWithGoogle,
        logout,
        updateUserRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
