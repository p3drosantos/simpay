import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"

import { IDeleteEventRepository } from "../../controllers/events/protocols.js"
import { Event } from "../../models/event.js"
import * as schema from "../../db/schema.js"
import { eq } from "drizzle-orm"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class DeleteEventRepository implements IDeleteEventRepository {
  async deleteEvent(id: string): Promise<Event | null> {
    const table = schema.eventsTable

    const [event] = await db.delete(table).where(eq(table.id, id)).returning()

    if (!event) {
      return null
    }

    return {
      id: event.id,
      ownerId: event.ownerId,
      name: event.name,
      ticketPriceInCents: event.ticketPriceInCents,
      longitude: Number(event.longitude),
      latitude: Number(event.latitude),
      date: new Date(event.date),
    }
  }
}
