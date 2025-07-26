import { pgTable, text, timestamp, decimal, integer, serial, varchar } from 'drizzle-orm/pg-core';

export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'haircut', 'misc', 'expense'
  service: text('service'), // For haircut entries
  description: text('description'), // For misc/expense entries
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').default(1),
  date: varchar('date', { length: 10 }).notNull(), // Store as YYYY-MM-DD string for consistency
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type TrackerEntry = typeof entries.$inferSelect;
export type NewTrackerEntry = typeof entries.$inferInsert;