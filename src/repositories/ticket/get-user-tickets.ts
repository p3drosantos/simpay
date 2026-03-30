import { desc, eq } from "drizzle-orm"
import {
  IGetUserTicketsRepository,
  TicketWithEventInfo,
} from "../../controllers/tickets/protocols.js"
import { db } from "../../db/client.js"
// import { ticketsTable } from "../../db/schema.js";
import * as schema from "../../db/schema.js"

export class GetUserTicketsRepository implements IGetUserTicketsRepository {
  async getUserTickets(userId: string): Promise<TicketWithEventInfo[]> {
    const tickets = await db
      .select({
        ticket: {
          id: schema.ticketsTable.id,
          quantity: schema.ticketsTable.quantity,
          totalPriceInCents: schema.ticketsTable.totalPriceInCents,
          status: schema.ticketsTable.status,
          createdAt: schema.ticketsTable.createdAt,
        },
        event: {
          id: schema.eventsTable.id,
          name: schema.eventsTable.name,
          date: schema.eventsTable.date,
        },
      })
      .from(schema.ticketsTable)
      .leftJoin(
        schema.eventsTable,
        eq(schema.ticketsTable.eventId, schema.eventsTable.id)
      )
      .where(eq(schema.ticketsTable.buyerId, userId))
      .orderBy(desc(schema.ticketsTable.createdAt))
    return tickets
  }
}
