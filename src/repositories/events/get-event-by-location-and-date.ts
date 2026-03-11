import { IGetEventByLocationAndDateRepository } from "../../controllers/events/protocols.js"

import "dotenv/config"

import * as schema from "../../db/schema.js"
import { drizzle } from "drizzle-orm/node-postgres"
import { eq, and } from "drizzle-orm"
import { Event } from "../../models/event.js"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class GetEventByLocationAndDateRepository
  implements IGetEventByLocationAndDateRepository
{
  async getEventByLocationAndDate(
    longitude: number,
    latitude: number,
    date: Date
  ): Promise<Event | null> {
    const table = schema.eventsTable

    const [event] = await db
      .select()
      .from(table)
      .where(
        and(
          eq(table.longitude, longitude.toString()),
          eq(table.latitude, latitude.toString()),
          eq(table.date, date)
        )
      )
      .limit(1)

    return {
      ...event,
      longitude: Number(event.longitude),
      latitude: Number(event.latitude),
    }
  }
}
