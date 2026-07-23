// NOTE: Uncomment when drizzle-orm is installed
/*
import { pgTable, serial, text, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// Users Table for Authentication & RBAC
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("operator").notNull(), // 'admin' | 'operator' | 'viewer'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Profiles Table (represents Lembaga / Institution)
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings Table for App Customization
export const settings = pgTable("settings", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  instituteName: text("institute_name").default("PONDOK PESANTREN AL-ITQAN").notNull(),
  eventName: text("event_name").default("HAFLAH AT-TAKSHRIJ").notNull(),
  academicYear: text("academic_year").default("2024/2025").notNull(),
  primaryColor: text("primary_color").default("#10b981").notNull(),
  fontSize: text("font_size").default("normal").notNull(),
  showFooter: boolean("show_footer").default(true).notNull(),
  layoutTheme: text("layout_theme").default("classic").notNull(),
});

// Questions Table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  nomor: integer("nomor").notNull(),
  kategori: text("kategori").notNull(),
  soal: text("soal").notNull(),
  jawaban: text("jawaban").notNull(),
  soalImage: text("soal_image"),
  jawabanImage: text("jawaban_image"),
});

// Used Questions Table
export const usedQuestions = pgTable("used_questions", {
  id: serial("id").primaryKey(),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  nomor: integer("nomor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NextAuth Tables
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expires: timestamp("expires").notNull(),
  sessionToken: text("session_token").notNull().unique(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});
*/
