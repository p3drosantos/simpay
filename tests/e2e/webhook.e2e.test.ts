jest.mock("../../src/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: "session-id",
          url: "http://fake-checkout-url",
        }),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}))
import request from "supertest"
import { app } from "../../src/app"
import { db } from "../../src/db/client"
import { eq } from "drizzle-orm"
import * as schema from "../../src/db/schema"
import { stripe } from "../../src/lib/stripe"

describe("Stripe Webhook E2E", () => {
  it("should mark ticket as paid after webhook", async () => {
    await request(app).post("/users").send({
      name: "User",
      email: "webhook@test.com",
      password: "123456",
      role: "customer",
    })

    const login = await request(app).post("/users/login").send({
      email: "webhook@test.com",
      password: "123456",
    })

    const token = login.body.token

    const eventRes = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Event",
        maxTickets: 10,
        ticketPriceInCents: 100,
        longitude: 10,
        latitude: 10,
        date: "2099-01-01",
      })

    const eventId = eventRes.body.id

    const ticketRes = await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })

    const ticketId = ticketRes.body.ticketId

    ;(stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {
            ticketId,
          },
        },
      },
    })

    const webhookRes = await request(app)
      .post("/stripe/webhook")
      .set("content-type", "application/json")
      .set("stripe-signature", "fake-signature")
      .send(Buffer.from(JSON.stringify({})))

    expect(webhookRes.status).toBe(200)

    const [ticket] = await db
      .select()
      .from(schema.ticketsTable)
      .where(eq(schema.ticketsTable.id, ticketId))

    console.log("WEBHOOK RESPONSE:", webhookRes.body)

    expect(ticket.status).toBe("paid")
  })
})
