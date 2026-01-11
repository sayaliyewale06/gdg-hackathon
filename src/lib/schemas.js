import { z } from 'zod';

/**
 * User Schema
 * Defines the structure for user documents in the 'users' collection.
 */
export const UserSchema = z.object({
    uid: z.string(),
    email: z.string().email(),
    displayName: z.string().nullable().optional(),
    photoURL: z.string().url().nullable().optional(),
    role: z.enum(['worker', 'hire', 'admin']).nullable().optional(),
    phone: z.string().optional(),
    rating: z.number().min(0).max(5).default(0).optional(),
    reviewCount: z.number().default(0).optional(),
    createdAt: z.string().datetime().optional(), // ISO string
    lastLogin: z.string().datetime().optional(),
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

    hirerId: z.string(),
    hirerName: z.string().optional(), // Denormalized for easy display
    hirerPic: z.string().optional(),  // Denormalized for easy display
    hirerRating: z.number().optional(), // Denormalized for easy display

    status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).default('open'),
    applicantsCount: z.number().default(0),
    createdAt: z.string().datetime().optional(),
});
