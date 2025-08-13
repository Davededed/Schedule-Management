// MongoDB initialization script
db = db.getSiblingDB('schedule-management');

// Create collections
db.createCollection('schedules');

// Create indexes for better performance
db.schedules.createIndex({ "staffId": 1, "date": 1 }, { unique: true });
db.schedules.createIndex({ "staffId": 1 });
db.schedules.createIndex({ "date": 1 });
db.schedules.createIndex({ "isActive": 1 });

// Insert sample data for testing
db.schedules.insertMany([
  {
    staffId: "STAFF001",
    date: new Date("2024-01-15T00:00:00.000Z"),
    startTime: "09:00",
    endTime: "17:00",
    interval: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    staffId: "STAFF002",
    date: new Date("2024-01-15T00:00:00.000Z"),
    startTime: "10:00",
    endTime: "18:00",
    interval: 60,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    staffId: "STAFF001",
    date: new Date("2024-01-16T00:00:00.000Z"),
    startTime: "08:00",
    endTime: "16:00",
    interval: 45,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialized with sample data");