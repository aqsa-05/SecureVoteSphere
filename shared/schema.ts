import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for both voters and admins
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("voter"), // voter, admin, observer
  voterId: text("voter_id").unique(),
  faceData: text("face_data"), // encoded facial features for verification
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  securityToken: text("security_token"), // for admin MFA
  createdAt: timestamp("created_at").defaultNow(),
});

// Elections table
export const elections = pgTable("elections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
});

// Candidates table
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  party: text("party"),
  position: text("position").notNull(), // e.g., "President", "Senate"
  electionId: integer("election_id").notNull(),
});

// Ballots table
export const ballots = pgTable("ballots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  electionId: integer("election_id").notNull(),
  choices: jsonb("choices").notNull(), // JSON array of candidate IDs selected
  submittedAt: timestamp("submitted_at").defaultNow(),
  verificationId: text("verification_id").notNull(), // unique identifier for verification
});

// SecurityLogs table
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  event: text("event").notNull(),
  category: text("category").notNull(), // Authentication, System, AI Defense, etc.
  severity: text("severity").notNull(), // Info, Warning, Critical
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userId: integer("user_id"),
});

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
  isActive: true,
});

// Schema for inserting elections
export const insertElectionSchema = createInsertSchema(elections).omit({
  id: true,
});

// Schema for inserting candidates
export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
});

// Schema for inserting ballots
export const insertBallotSchema = createInsertSchema(ballots).omit({
  id: true,
  submittedAt: true,
});

// Schema for inserting security logs
export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  timestamp: true,
});

// Login schema for voters
export const voterLoginSchema = z.object({
  voterId: z.string().min(3, "Voter ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login schema for admins
export const adminLoginSchema = z.object({
  username: z.string().min(3, "Admin ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  securityToken: z.string().min(3, "Security token is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertElection = z.infer<typeof insertElectionSchema>;
export type Election = typeof elections.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type InsertBallot = z.infer<typeof insertBallotSchema>;
export type Ballot = typeof ballots.$inferSelect;

export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;

export type VoterLogin = z.infer<typeof voterLoginSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
