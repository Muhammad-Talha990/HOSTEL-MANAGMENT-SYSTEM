import bcrypt from "bcryptjs";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.student.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create Rooms
  const rooms = await Promise.all([
    prisma.room.create({ data: { roomNumber: "101", type: "Single", capacity: 1, price: 5000, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "102", type: "Double", capacity: 2, price: 7000, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "103", type: "Triple", capacity: 3, price: 9000, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "104", type: "Quad", capacity: 4, price: 11000, status: "FULL" } }),
    prisma.room.create({ data: { roomNumber: "105", type: "Suite", capacity: 2, price: 15000, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "106", type: "Single", capacity: 1, price: 5000, status: "MAINTENANCE" } }),
    prisma.room.create({ data: { roomNumber: "201", type: "Double", capacity: 2, price: 7500, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "202", type: "Triple", capacity: 3, price: 9500, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "203", type: "Suite", capacity: 2, price: 16000, status: "AVAILABLE" } }),
    prisma.room.create({ data: { roomNumber: "204", type: "Single", capacity: 1, price: 5500, status: "AVAILABLE" } }),
  ]);
  console.log(`🛏️  Created ${rooms.length} rooms`);

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@hostel.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("👑 Created admin: admin@hostel.com / admin123");

  // Create Warden User
  const wardenPassword = await bcrypt.hash("warden123", 12);
  const wardenUser = await prisma.user.create({
    data: {
      name: "Mr. Warden Khan",
      email: "warden@hostel.com",
      password: wardenPassword,
      role: "WARDEN",
      staff: { create: { position: "Head Warden", phone: "+92-300-1234567" } },
    },
  });
  console.log("🔒 Created warden: warden@hostel.com / warden123");

  // Create Student Users
  const studentPassword = await bcrypt.hash("student123", 12);
  const studentNames = [
    { name: "Ahmed Ali", email: "student@hostel.com", phone: "+92-312-1111111", roomIdx: 0 },
    { name: "Fatima Khan", email: "fatima@hostel.com", phone: "+92-312-2222222", roomIdx: 1 },
    { name: "Usman Tariq", email: "usman@hostel.com", phone: "+92-312-3333333", roomIdx: 1 },
    { name: "Sara Ahmed", email: "sara@hostel.com", phone: "+92-312-4444444", roomIdx: 2 },
    { name: "Bilal Hussain", email: "bilal@hostel.com", phone: "+92-312-5555555", roomIdx: 2 },
    { name: "Zainab Malik", email: "zainab@hostel.com", phone: "+92-312-6666666", roomIdx: 4 },
  ];

  const studentRecords = [];
  for (const s of studentNames) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: studentPassword,
        role: "STUDENT",
        student: {
          create: {
            phone: s.phone,
            roomId: rooms[s.roomIdx].id,
          },
        },
      },
      include: { student: true },
    });
    studentRecords.push(user);
  }
  console.log(`👨‍🎓 Created ${studentRecords.length} students (password: student123)`);

  // Create Bookings
  const students = studentRecords.map((s) => s.student!);
  const bookings = await Promise.all([
    prisma.booking.create({ data: { studentId: students[0].id, checkIn: new Date("2024-09-01"), checkOut: new Date("2025-06-30"), status: "CONFIRMED" } }),
    prisma.booking.create({ data: { studentId: students[1].id, checkIn: new Date("2024-09-01"), checkOut: new Date("2025-06-30"), status: "CONFIRMED" } }),
    prisma.booking.create({ data: { studentId: students[2].id, checkIn: new Date("2024-09-15"), checkOut: new Date("2025-06-30"), status: "CONFIRMED" } }),
    prisma.booking.create({ data: { studentId: students[3].id, checkIn: new Date("2025-01-01"), checkOut: new Date("2025-06-30"), status: "PENDING" } }),
    prisma.booking.create({ data: { studentId: students[4].id, checkIn: new Date("2025-02-01"), checkOut: new Date("2025-06-30"), status: "CONFIRMED" } }),
    prisma.booking.create({ data: { studentId: students[5].id, checkIn: new Date("2025-03-01"), checkOut: new Date("2025-06-30"), status: "PENDING" } }),
  ]);
  console.log(`📋 Created ${bookings.length} bookings`);

  // Create Payments
  const payments = await Promise.all([
    prisma.payment.create({ data: { studentId: students[0].id, amount: 15000, status: "SUCCESS", transactionId: "TXN-001", paidAt: new Date("2024-09-01") } }),
    prisma.payment.create({ data: { studentId: students[0].id, amount: 5000, status: "SUCCESS", transactionId: "TXN-002", paidAt: new Date("2024-10-01") } }),
    prisma.payment.create({ data: { studentId: students[1].id, amount: 7000, status: "SUCCESS", transactionId: "TXN-003", paidAt: new Date("2024-09-05") } }),
    prisma.payment.create({ data: { studentId: students[2].id, amount: 7000, status: "PENDING", transactionId: "TXN-004" } }),
    prisma.payment.create({ data: { studentId: students[3].id, amount: 9000, status: "SUCCESS", transactionId: "TXN-005", paidAt: new Date("2025-01-15") } }),
    prisma.payment.create({ data: { studentId: students[4].id, amount: 9000, status: "FAILED", transactionId: "TXN-006" } }),
    prisma.payment.create({ data: { studentId: students[5].id, amount: 15000, status: "SUCCESS", transactionId: "TXN-007", paidAt: new Date("2025-03-01") } }),
  ]);
  console.log(`💳 Created ${payments.length} payments`);

  // Create Complaints
  const complaints = await Promise.all([
    prisma.complaint.create({ data: { studentId: students[0].id, title: "Broken window in Room 101", description: "The window in my room is cracked and lets cold air in. Needs immediate repair.", priority: "HIGH", status: "OPEN" } }),
    prisma.complaint.create({ data: { studentId: students[1].id, title: "AC not cooling properly", description: "The air conditioning unit in Room 102 is running but not cooling. Might need servicing.", priority: "MEDIUM", status: "IN_PROGRESS" } }),
    prisma.complaint.create({ data: { studentId: students[2].id, title: "WiFi connection issues", description: "Internet drops every 30 minutes on the 2nd floor. Very frustrating for studies.", priority: "HIGH", status: "OPEN" } }),
    prisma.complaint.create({ data: { studentId: students[3].id, title: "Leaky faucet", description: "Bathroom faucet has a slow drip. Not urgent but wastes water.", priority: "LOW", status: "RESOLVED" } }),
    prisma.complaint.create({ data: { studentId: students[4].id, title: "Noisy neighbors", description: "Room 103 plays loud music late at night. Please enforce quiet hours.", priority: "MEDIUM", status: "OPEN" } }),
    prisma.complaint.create({ data: { studentId: students[5].id, title: "Elevator malfunction", description: "The elevator on block B gets stuck between 2nd and 3rd floor frequently.", priority: "HIGH", status: "IN_PROGRESS" } }),
  ]);
  console.log(`📢 Created ${complaints.length} complaints`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📌 Login Credentials:");
  console.log("   Admin:   admin@hostel.com   / admin123");
  console.log("   Warden:  warden@hostel.com  / warden123");
  console.log("   Student: student@hostel.com / student123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
