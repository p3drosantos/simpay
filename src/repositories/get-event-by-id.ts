import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"
import { IGetEventByIdRepository } from "../controllers/events/protocols.js"
import * as schema from "../db/schema.js"
import { eq } from "drizzle-orm"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class GetEventByIdRepository implements IGetEventByIdRepository {
  async getEventById(id: string) {
    const table = schema.eventsTable

    const [event] = await db
      .select()
      .from(table)
      .where(eq(table.id, id))
      .limit(1)

    if (!event) return null

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
