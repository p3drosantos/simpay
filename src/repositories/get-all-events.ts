import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"
import { IGetAllEventsRepository } from "../controllers/events/protocols.js"
import * as schema from "../db/schema.js"
import { Event } from "../models/event.js"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class GetAllEventsRepository implements IGetAllEventsRepository {
  async getAllEvents(): Promise<Event[]> {
    const table = schema.eventsTable
    const events = await db.select().from(table)

    if (!events) return []

    return events.map((event) => ({
      id: event.id,
      ownerId: event.ownerId,
      name: event.name,
      ticketPriceInCents: event.ticketPriceInCents,
      longitude: Number(event.longitude),
      latitude: Number(event.latitude),
      date: new Date(event.date),
    }))
  }
}
