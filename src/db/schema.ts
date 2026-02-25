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
  ownerId: uuid().notNull(),
  name: text().notNull(),
  ticketPriceInCents: integer("ticket_price_in_cents").notNull(),
  longitude: decimal({ precision: 10, scale: 6 }).notNull(),
  latitude: decimal({ precision: 10, scale: 6 }).notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
})
