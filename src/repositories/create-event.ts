import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"

import * as schema from "../db/schema.js"
import {
  createEventsParams,
  ICreateEventsRepository,
} from "../controllers/events/protocols.js"
import { Event } from "../models/event.js"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class CreateEventRepository implements ICreateEventsRepository {
  async createEvent(params: createEventsParams): Promise<Event> {
    const table = schema.eventsTable

    const [event] = await db
      .insert(table)
      .values({
        id: params.id,
        ownerId: params.ownerId,
        name: params.name,
        ticketPriceInCents: params.ticketPriceInCents,
        longitude: params.longitude.toString(),
        latitude: params.latitude.toString(),
        date: params.date,
      })
      .returning()
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
