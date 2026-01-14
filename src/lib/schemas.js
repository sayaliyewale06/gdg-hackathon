import { z } from 'zod';

/**
 * User Schema
 * Defines the structure for user documents in the 'users' collection.
 */
export const UserSchema = z.object({
    uid: z.string(),
    email: z.string().email().optional().or(z.literal('')), // Relaxed for public view or phone-only users
    displayName: z.string().nullable().optional(),
    photoURL: z.string().url().nullable().optional(),
    role: z.enum(['worker', 'hire', 'admin']).nullable().optional(),
    phone: z.string().optional(),
    rating: z.number().min(0).max(5).default(0).optional(),
    reviewCount: z.number().default(0).optional(),
    createdAt: z.string().datetime().optional(), // ISO string
    lastLogin: z.string().datetime().optional(),

    // Profile Fields
    about: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
    location: z.string().optional(),
    availability: z.string().optional(),
    profession: z.string().optional(), // e.g. "Electrician", distinct from role="worker"

    // Earnings
    totalEarnings: z.number().default(0).optional(),
    weeklyEarnings: z.number().default(0).optional(),
});

/**
 * Job Schema
 * Defines the structure for job documents in the 'jobs' collection.
 */
export const JobSchema = z.object({
    id: z.string().optional(), // Firestore ID
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    category: z.string().default('general'), // e.g. mason, driver, electrician
    wage: z.number().positive("Wage must be positive"),
    location: z.string().min(2, "Location is required"),
    isUrgent: z.boolean().default(false),
    duration: z.number().min(1).default(1).optional(), // Added field

    hirerId: z.string(),
    hirerName: z.string().optional(), // Denormalized for easy display
    hirerPic: z.string().nullable().optional(),  // Denormalized for easy display
    hirerRating: z.number().optional(), // Denormalized for easy display

    status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).default('open'),
    applicantsCount: z.number().default(0),
    createdAt: z.string().datetime().optional(),
});

/**
 * Application Schema
 * Links a Worker to a Job
 */
export const ApplicationSchema = z.object({
    id: z.string().optional(),
    jobId: z.string(),
    workerId: z.string(),
    hirerId: z.string(),
    status: z.enum(['pending', 'accepted', 'rejected', 'completed']).default('pending'),
    workerName: z.string().optional(),
    workerPic: z.string().optional(),
    jobTitle: z.string().optional(), // Denormalized
    appliedAt: z.string().datetime().optional(),
    // Application Details
    message: z.string().optional(), // Kept for backward compatibility
    coverLetter: z.string().optional(),
    availability: z.string().optional(), // 'immediately', 'tomorrow', etc.
    expectedWage: z.string().optional(),
    experience: z.string().optional(),
    skills: z.array(z.string()).default([]).optional(),

    // Legacy/Checkbox fields (kept optional to avoid breaking existing data immediately)
    availability_confirmed: z.boolean().default(false),
    requirements_understood: z.boolean().default(false),
    safety_gear_agreed: z.boolean().default(false),
    pay_rate_accepted: z.boolean().default(false),
});

/**
 * Review Schema
 */
export const ReviewSchema = z.object({
    id: z.string().optional(),
    jobId: z.string(),
    reviewerId: z.string(), // Who wrote the review
    targetId: z.string(),   // Who is being reviewed
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    createdAt: z.string().datetime().optional(),
});

/**
 * Notification Schema
 */
export const NotificationSchema = z.object({
    id: z.string().optional(),
    userId: z.string(), // Who receives it
    type: z.enum(['application', 'earnings', 'message', 'completed', 'review', 'update']),
    title: z.string(),
    subtitle: z.string().optional(),
    read: z.boolean().default(false),
    data: z.record(z.any()).optional(), // Extra meta data like jobId, etc.
    createdAt: z.string().datetime().optional(),
});

/**
 * Message Schema
 */
export const MessageSchema = z.object({
    id: z.string().optional(),
    senderId: z.string(),
    receiverId: z.string(),
    text: z.string(),
    createdAt: z.string().datetime(), // ISO string
    read: z.boolean().default(false),
});
