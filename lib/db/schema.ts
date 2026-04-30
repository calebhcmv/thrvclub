import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authUserId: text('auth_user_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role', { enum: ['admin', 'member'] }).notNull().default('member'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('courses_user_id_idx').on(table.userId), index('courses_status_idx').on(table.status)]);

export const modules = pgTable('modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  position: integer('position').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('modules_course_id_idx').on(table.courseId),
  index('modules_position_idx').on(table.position),
]);

export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: uuid('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  videoProvider: text('video_provider', { enum: ['youtube', 'vk', 'none'] }).notNull().default('none'),
  embedUrl: text('embed_url'),
  durationSec: integer('duration_sec'),
  position: integer('position').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('lessons_module_id_idx').on(table.moduleId),
  index('lessons_position_idx').on(table.position),
]);

export const enrollments = pgTable('enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('enrollments_user_id_idx').on(table.userId),
  index('enrollments_course_id_idx').on(table.courseId),
]);

export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  lessonId: uuid('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('user_progress_user_id_idx').on(table.userId),
  index('user_progress_lesson_id_idx').on(table.lessonId),
]);
