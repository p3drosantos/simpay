import request from "supertest"
import { app } from "../../src/app"

describe("Users E2E", () => {
  const userBody = {
    name: "Pedro",
    email: "pedro@test.com",
    password: "123456",
    role: "customer" as const,
  }

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

    return res.body.id
  }

  async function buyTicket(token: string, eventId: string) {
    await request(app)
      .post(`/events/${eventId}/tickets`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 1,
      })
  }

  it("should create user", async () => {
    const res = await request(app).post("/users").send(userBody)

    expect(res.status).toBe(201)
    expect(res.body.email).toBe(userBody.email)
  })

  it("should not create duplicated user", async () => {
    await request(app).post("/users").send(userBody)

    const res = await request(app).post("/users").send(userBody)

    expect(res.status).toBe(409)
  })

  it("should validate body", async () => {
    const res = await request(app).post("/users").send({
      email: "invalid",
    })

    expect(res.status).toBe(400)
  })

  it("should login", async () => {
    await request(app).post("/users").send(userBody)

    const res = await request(app).post("/users/login").send({
      email: userBody.email,
      password: userBody.password,
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  it("should not login with wrong password", async () => {
    await request(app).post("/users").send(userBody)

    const res = await request(app).post("/users/login").send({
      email: userBody.email,
      password: "wrong123",
    })

    expect(res.status).toBe(401)
  })

  it("should return 404 if user not found", async () => {
    const res = await request(app).post("/users/login").send({
      email: "none@test.com",
      password: "123456",
    })

    expect(res.status).toBe(404)
  })

  it("should return authenticated user's tickets", async () => {
    const token = await createUserAndLogin()

    const eventId = await createEvent(token)

    await buyTicket(token, eventId)

    const res = await request(app)
      .get("/users/me/tickets")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].event.id).toBe(eventId)
  })

  it("should return 401 when user is not authenticated", async () => {
    const res = await request(app).get("/users/me/tickets")

    expect(res.status).toBe(401)
  })

  it("should return empty array when user has no tickets", async () => {
    const token = await createUserAndLogin("empty@test.com")

    const res = await request(app)
      .get("/users/me/tickets")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it("should not return tickets from other users", async () => {
    const tokenUser1 = await createUserAndLogin("user1@test.com")
    const tokenUser2 = await createUserAndLogin("user2@test.com")

    const eventId = await createEvent(tokenUser1)

    await buyTicket(tokenUser1, eventId)

    const res = await request(app)
      .get("/users/me/tickets")
      .set("Authorization", `Bearer ${tokenUser2}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})
