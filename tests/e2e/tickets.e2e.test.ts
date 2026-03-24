import request from "supertest"
import { app } from "../../src/app"
import { db } from "../../src/db/client"
import { eq } from "drizzle-orm"
import * as schema from "../../src/db/schema"

describe("Tickets E2E", () => {
  async function createUserAndLogin(
    email = "pedro@test.com",
    role: "customer" | "organizer" = "customer"
  ) {
    await request(app).post("/users").send({
      name: "Pedro",
      email,
      password: "123456",
      role,
    })

    const login = await request(app).post("/users/login").send({
      email,
      password: "123456",
    })

    return login.body.token
  }

  async function createEvent(token: string, date = "2099-01-01") {
    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Event",
        maxTickets: 10,
        ticketPriceInCents: 100,
        longitude: 10,
        latitude: 10,
        date,
      })

    console.log("CREATE EVENT BODY:", res.body)

    return res.body.id
  }

  it("should require token", async () => {
    const res = await request(app).get("/events")

    expect(res.status).toBe(401)
  })

  it("should return 401 if token invalid", async () => {
    const res = await request(app)
      .get("/events")
      .set("Authorization", "Bearer invalid")

    expect(res.status).toBe(401)
  })

  it("should return 404 if event not found", async () => {
    const token = await createUserAndLogin()

    await createEvent(token)

    const res = await request(app)
      .post("/tickets/f4de4e4e-4e4e-4e4e-4e4e-4e4e4e4e4e4e")
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })

    expect(res.status).toBe(404)
  })

  it("should create ticket", async () => {
    const token = await createUserAndLogin()

    const eventId = await createEvent(token)

    const res = await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })

    expect(res.status).toBe(201)
  })

  it("should return 400 if event capacity exceeded", async () => {
    const token = await createUserAndLogin()

    const eventId = await createEvent(token)

    await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 10,
      })

    const res = await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })

    expect(res.status).toBe(400)
  })

  it("should return 400 if event already happened", async () => {
    const token = await createUserAndLogin()

    const eventId = await createEvent(token, "2099-01-01")

    await db
      .update(schema.eventsTable)
      .set({
        date: new Date("2000-01-01"),
      })
      .where(eq(schema.eventsTable.id, eventId))

    const res = await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })

    expect(res.status).toBe(400)
  })

  it("should return 403 if user is not customer", async () => {
    const token = await createUserAndLogin("admin@test.com", "organizer")

    const eventId = await createEvent(token)

    const res = await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })

    expect(res.status).toBe(403)
  })

  it("should return 400 if quantity missing", async () => {
    const token = await createUserAndLogin()

    const eventId = await createEvent(token)

    const res = await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({})

    expect(res.status).toBe(400)
  })
})
