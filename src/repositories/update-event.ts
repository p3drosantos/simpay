import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"

import { IUpdateEventRepository } from "../controllers/events/protocols.js"
import { UpdateEventInput } from "../validators/create-event.schema.js"
import { Event } from "../models/event.js"
import * as schema from "../db/schema.js"
import { eq } from "drizzle-orm"

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class UpdateEventRepository implements IUpdateEventRepository {
  async updateEvent(
    id: string,
    data: Partial<UpdateEventInput>
  ): Promise<Event | null> {
    const table = schema.eventsTable
    const UpdateData: Partial<UpdateEventInput> = { ...data }

    const [updatedEvent] = await db
      .update(table)
      .set(UpdateData)
      .where(eq(table.id, id))
      .returning()

    if (!updatedEvent) {
      return null
    }

    return {
      id: updatedEvent.id,
      ownerId: updatedEvent.ownerId,
      name: updatedEvent.name,
      ticketPriceInCents: updatedEvent.ticketPriceInCents,
      longitude: Number(updatedEvent.longitude),
      latitude: Number(updatedEvent.latitude),
      date: new Date(updatedEvent.date),
    }
  }
}
