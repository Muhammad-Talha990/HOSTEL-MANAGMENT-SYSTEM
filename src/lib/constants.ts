export const ROOMS_TYPES = ["Single", "Double", "Triple", "Quad", "Suite"] as const;
export const ROOM_STATUSES = ["AVAILABLE", "FULL", "MAINTENANCE"] as const;
export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"] as const;
export const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED"] as const;
export const COMPLAINT_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const COMPLAINT_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"] as const;

export const ROLES = {
  ADMIN: "ADMIN",
  WARDEN: "WARDEN",
  STUDENT: "STUDENT",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STUDENTS: "/admin/students",
    ROOMS: "/admin/rooms",
    STAFF: "/admin/staff",
    COMPLAINTS: "/admin/complaints",
    PAYMENTS: "/admin/payments",
    REPORTS: "/admin/reports",
  },
  WARDEN: {
    DASHBOARD: "/warden/dashboard",
    COMPLAINTS: "/warden/complaints",
    MAINTENANCE: "/warden/maintenance",
  },
  STUDENT: {
    DASHBOARD: "/student/dashboard",
    PROFILE: "/student/profile",
    BOOKING: "/student/booking",
    COMPLAINTS: "/student/complaints",
    PAYMENTS: "/student/payments",
  },
};
