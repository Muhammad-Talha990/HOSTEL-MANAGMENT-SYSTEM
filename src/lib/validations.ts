import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["STUDENT", "WARDEN", "ADMIN"]).default("STUDENT"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.string().min(1, "Room type is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  price: z.coerce.number().min(0, "Price must be positive"),
  status: z.enum(["AVAILABLE", "FULL", "MAINTENANCE"]).default("AVAILABLE"),
});

export const bookingSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
});

export const complaintSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const paymentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.coerce.number().min(1, "Amount must be positive"),
  transactionId: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RoomInput = z.infer<typeof roomSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
