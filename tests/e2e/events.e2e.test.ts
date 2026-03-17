import request from "supertest"
import { app } from "../../src/app"

describe("Events E2E", () => {
  async function createUserAndLogin(email = "pedro@test.com") {
    await request(app)
      .post("/users")
      .send({
        name: "Pedro",
        email,
        password: "123456",
        role: "customer" as const,
      })

    const login = await request(app).post("/users/login").send({
      email,
      password: "123456",
    })

    return login.body.token
  }

  const eventBody = {
    name: "Event",
    maxTickets: 10,
    ticketPriceInCents: 100,
    longitude: 10,
    latitude: 10,
    date: "2099-01-01",
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

  it("should create event", async () => {
    const token = await createUserAndLogin()

    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    expect(res.status).toBe(201)
  })

  it("should not create event with past date", async () => {
    const token = await createUserAndLogin()

    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...eventBody,
        date: "2000-01-01",
      })

    expect(res.status).toBe(400)
  })

  it("should not create duplicated event", async () => {
    const token = await createUserAndLogin()

    await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    const res = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    expect(res.status).toBe(400)
  })

  it("should get all events", async () => {
    const token = await createUserAndLogin()

    await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    const res = await request(app)
      .get("/events")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it("should get event by id", async () => {
    const token = await createUserAndLogin()

    const created = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    const res = await request(app)
      .get(`/events/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
  })

  it("should return 404 if event not found", async () => {
    const token = await createUserAndLogin()

    const res = await request(app)
      .get(`/events/${crypto.randomUUID()}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(404)
  })

  it("should update event", async () => {
    const token = await createUserAndLogin()

    const created = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    const res = await request(app)
      .put(`/events/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated",
      })

    expect(res.status).toBe(200)
  })

  it("should not update event of another user", async () => {
    const token1 = await createUserAndLogin("a@test.com")

    const created = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token1}`)
      .send(eventBody)

    const token2 = await createUserAndLogin("b@test.com")

    const res = await request(app)
      .put(`/events/${created.body.id}`)
      .set("Authorization", `Bearer ${token2}`)
      .send({
        name: "Hack",
      })

    expect(res.status).toBe(401)
  })

  it("should delete event", async () => {
    const token = await createUserAndLogin()

    const created = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token}`)
      .send(eventBody)

    const res = await request(app)
      .delete(`/events/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
  })

  it("should not delete event of another user", async () => {
    const token1 = await createUserAndLogin("c@test.com")

    const created = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${token1}`)
      .send(eventBody)

    const token2 = await createUserAndLogin("d@test.com")

    const res = await request(app)
      .delete(`/events/${created.body.id}`)
      .set("Authorization", `Bearer ${token2}`)

    expect(res.status).toBe(403)
  })
})
