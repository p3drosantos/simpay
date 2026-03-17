import request from "supertest"
import { app } from "../../src/app"

describe("Users E2E", () => {
  const userBody = {
    name: "Pedro",
    email: "pedro@test.com",
    password: "123456",
    role: "customer" as const,
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
})
