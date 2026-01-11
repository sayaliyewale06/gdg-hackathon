import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from './firebase'; // Ensure this points to your firebase init file
import { UserSchema, JobSchema } from './schemas';

/**
 * Generic helper to create a type-safe Firestore collection reference.
 * Applying withConverter ensures that data flowing in/out matches the Zod schema.
 * 
 * @param {string} collectionName 
 * @param {import('zod').ZodSchema} schema 
 */
const createCollection = (collectionName, schema) => {
    return collection(db, collectionName).withConverter({
        toFirestore: (data) => {
            // Validate data before writing to Firestore
            // Using safeParse inside a real app might be better to avoid throwing, 
            // but for strict type safety we want to catch schema violations early.
            const parsed = schema.parse(data);
            return parsed;
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            // We include the ID in the returned object for convenience
            return schema.parse({ ...data, id: snapshot.id });
        },
    });
};

// ==========================================
// Typed Collections
// ==========================================

const usersCollection = createCollection('users', UserSchema);
const jobsCollection = createCollection('jobs', JobSchema);

// ==========================================
// Service Functions
// ==========================================

export const DB = {
    users: {
        /**
         * Get a user by their UID
         * @param {string} uid 
         * @returns {Promise<import('./schemas').User | null>}
         */
        get: async (uid) => {
            const ref = doc(usersCollection, uid);
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data() : null;
        },

        /**
         * Create or overwrite a user
         * @param {string} uid 
         * @param {import('./schemas').User} data 
         */
        create: async (uid, data) => {
            const ref = doc(usersCollection, uid);
            // We merge: true to avoid overwriting unrelated fields if any exists,
            // though withConverter 'toFirestore' handles the schematic check.
            // setDoc with merge requires the data to be partial if we want true merge,
            // but here we are strictly validating against the full schema for creation.
            // For partial updates, use update().

            // Zod validation happens automatically via the converter
            await setDoc(ref, {
                ...data,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        },

        /**
         * Update specific fields of a user
         * @param {string} uid 
         * @param {Partial<import('./schemas').User>} data 
         */
        update: async (uid, data) => {
            const ref = doc(usersCollection, uid);
            // Note: Update doesn't use the converter's toFirestore as strictly for partials 
            // in standard usage, but it's good practice. 
            // We pass the raw data here for updateDoc.
            await updateDoc(ref, data);
        }
    },

    jobs: {
        /**
         * Create a new job
         * @param {Omit<import('./schemas').Job, 'id'>} data 
         * @returns {Promise<string>} The new job ID
         */
        create: async (data) => {
            const docRef = await addDoc(jobsCollection, {
                ...data,
                createdAt: new Date().toISOString(),
                status: 'open'
            });
            return docRef.id;
        },

        /**
         * Get all jobs
         * @returns {Promise<import('./schemas').Job[]>}
         */
        getAll: async () => {
            const q = query(jobsCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data());
        },

        /**
         * Get jobs posted by a specific hirer
         * @param {string} hirerId 
         * @returns {Promise<import('./schemas').Job[]>}
         */
        getByHirer: async (hirerId) => {
            const q = query(jobsCollection, where('hirerId', '==', hirerId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data());
        },

        /**
        * Get job by ID
        * @param {string} id
        * @returns {Promise<import('./schemas').Job | null>}
        */
        get: async (id) => {
            const ref = doc(jobsCollection, id);
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data() : null;
        }
    }
};
