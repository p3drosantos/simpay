import { IBuyTicketRepository } from "../../controllers/tickets/protocols.js"
import { db } from "../../db/client.js"

import { eq, sql } from "drizzle-orm"

import * as schema from "../../db/schema.js"
import { Ticket } from "../../models/ticket.js"
import { CreateTicketParams } from "../../types/ticket.js"

export class BuyTicketRepository implements IBuyTicketRepository {
  async buyTicket(params: CreateTicketParams): Promise<Ticket> {
    const [ticket] = await db
      .insert(schema.ticketsTable)
      .values({
        eventId: params.eventId,
        buyerId: params.buyerId,
        quantity: params.quantity,
        totalPriceInCents: params.totalPriceInCents,
      })
      .returning()

    return {
      id: ticket.id,
      eventId: ticket.eventId,
      buyerId: ticket.buyerId,
      quantity: ticket.quantity,
      totalPriceInCents: ticket.totalPriceInCents,
      createdAt: new Date(ticket.createdAt),
    }
  }

  async sumTicketsByEventId(eventId: string): Promise<number> {
    const result = await db
      .select({
        total: sql<number>`
          coalesce(sum(${schema.ticketsTable.quantity}), 0)
        `,
      })
      .from(schema.ticketsTable)
      .where(eq(schema.ticketsTable.eventId, eventId))

    return Number(result[0].total)
  }
}
