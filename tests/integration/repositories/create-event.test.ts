import { CreateUserRepository } from "../../../src/repositories/users/create-user"
import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { db } from "../../../src/db/client"
import * as schema from "../../../src/db/schema"

describe("CreateEventRepository", () => {
  it("should create a new event successfully", async () => {
    const userRepo = new CreateUserRepository()
    const sut = new CreateEventRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner@example.com",
      password: "123456",
    })

    const eventData = {
      ownerId: owner.id,
      name: "Test Event",
      ticketPriceInCents: 5000,
      longitude: -46.633308,
      latitude: -23.55052,
      date: new Date(),
    }

    const result = await sut.createEvent(eventData)

    expect(result).toBeDefined()
    expect(result.ownerId).toBe(owner.id)
    expect(result.name).toBe(eventData.name)
  })

  it("should persist the event in the database", async () => {
    const userRepo = new CreateUserRepository()
    const sut = new CreateEventRepository()

    const owner = await userRepo.createUser({
      name: "Persist Owner",
      email: "persist_owner@example.com",
      password: "123456",
    })

    const eventData = {
      ownerId: owner.id,
      name: "Persisted Event",
      ticketPriceInCents: 7500,
      longitude: -46.632,
      latitude: -23.551,
      date: new Date(),
    }

    const created = await sut.createEvent(eventData)

    const events = await db.select().from(schema.eventsTable)
    const found = events.find((e) => e.id === created.id)

    expect(found).toBeDefined()
    expect(found?.ownerId).toBe(owner.id)
    expect(found?.name).toBe(eventData.name)
  })
})
