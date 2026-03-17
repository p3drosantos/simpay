import {
  integer,
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core"

export const eventsTable = pgTable("events", {
  id: uuid().primaryKey().defaultRandom(),
  ownerId: uuid()
    .notNull()
    .references(() => userTable.id),
  name: text().notNull(),
  ticketPriceInCents: integer("ticket_price_in_cents").notNull(),
  maxTickets: integer("max_tickets").notNull(),
  longitude: decimal({ precision: 10, scale: 6 }).notNull(),
  latitude: decimal({ precision: 10, scale: 6 }).notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
})

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: text().notNull().default("customer"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})

export const ticketsTable = pgTable("tickets", {
  id: uuid().primaryKey().defaultRandom(),

  eventId: uuid()
    .notNull()
    .references(() => eventsTable.id),

  buyerId: uuid()
    .notNull()
    .references(() => userTable.id),

  quantity: integer().notNull(),

  totalPriceInCents: integer("total_price_in_cents").notNull(),

  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
