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
import { UserSchema, JobSchema, ApplicationSchema, ReviewSchema, NotificationSchema, MessageSchema } from './schemas';

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
const applicationsCollection = createCollection('applications', ApplicationSchema);
const reviewsCollection = createCollection('reviews', ReviewSchema);

const notificationsCollection = createCollection('notifications', NotificationSchema);
const messagesCollection = createCollection('messages', MessageSchema);

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
        },

        /**
         * Get all workers
         * @returns {Promise<import('./schemas').User[]>}
         */
        getAllWorkers: async () => {
            const q = query(usersCollection, where('role', '==', 'worker'));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
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
        },

        /**
         * Delete a job by ID
         * @param {string} id 
         */
        delete: async (id) => {
            const ref = doc(jobsCollection, id);
            await deleteDoc(ref);
        }
    },

    applications: {
        create: async (data) => {
            const docRef = await addDoc(applicationsCollection, {
                ...data,
                appliedAt: new Date().toISOString()
            });
            return docRef.id;
        },
        getByJob: async (jobId) => {
            const q = query(applicationsCollection, where('jobId', '==', jobId));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        },
        getByWorker: async (workerId) => {
            const q = query(applicationsCollection, where('workerId', '==', workerId));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        },
        getByHirer: async (hirerId) => {
            const q = query(applicationsCollection, where('hirerId', '==', hirerId));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        },
        updateStatus: async (id, status) => {
            const ref = doc(applicationsCollection, id);
            await updateDoc(ref, { status });
        },
        delete: async (id) => {
            const ref = doc(applicationsCollection, id);
            await deleteDoc(ref);
        }
    },

    reviews: {
        create: async (data) => {
            await addDoc(reviewsCollection, {
                ...data,
                createdAt: new Date().toISOString()
            });
            // TODO: Update user rating average here? 
        },
        getByTargetUser: async (userId) => {
            const q = query(reviewsCollection, where('targetId', '==', userId));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        }
    },

    notifications: {
        create: async (data) => {
            await addDoc(notificationsCollection, {
                ...data,
                createdAt: new Date().toISOString(),
                read: false
            });
        },
        getByUser: async (userId) => {
            const q = query(notificationsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        },
        markAsRead: async (id) => {
            const ref = doc(notificationsCollection, id);
            await updateDoc(ref, { read: true });
        },
        markAllRead: async (userId) => {
            const q = query(notificationsCollection, where('userId', '==', userId), where('read', '==', false));
            const snap = await getDocs(q);
            const updates = snap.docs.map(d => updateDoc(d.ref, { read: true }));
            await Promise.all(updates);
        }
    },

    messages: {
        send: async (data) => {
            await addDoc(messagesCollection, {
                ...data,
                createdAt: new Date().toISOString(),
                read: false
            });
        },
        /**
         * Get all messages involving a user (sent or received)
         * Note: Firestore doesn't support logical OR directly in one simple query for multiple fields easily without compounding.
         * For MVP, we might simple query twice or use a redundant "participants" array field.
         * Let's stick to query-twice-and-merge or simplified approach. 
         * BETTER: Add a 'participants' array to MessageSchema and query "participants array-contains userId".
         * BUT: I already defined MessageSchema without it.
         * Let's just fetch sent and received and merge in client for now to avoid schema complexity for user.
         */
        getAllForUser: async (userId) => {
            // Remove orderBy to avoid needing a composite index
            const receivedQ = query(messagesCollection, where('receiverId', '==', userId));
            const sentQ = query(messagesCollection, where('senderId', '==', userId));

            const [receivedSnap, sentSnap] = await Promise.all([getDocs(receivedQ), getDocs(sentQ)]);
            const received = receivedSnap.docs.map(d => d.data());
            const sent = sentSnap.docs.map(d => d.data());

            // Merge and sort in memory
            return [...received, ...sent].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    }
};
