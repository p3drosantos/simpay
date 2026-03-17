import { UpdateEventRepository } from "../../../src/repositories/events/update-event"
import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"
import { db } from "../../../src/db/client"
import * as schema from "../../../src/db/schema"

describe("UpdateEventRepository", () => {
  it("should update event successfully", async () => {
    const userRepo = new CreateUserRepository()
    const createEventRepo = new CreateEventRepository()
    const sut = new UpdateEventRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner_update@example.com",
      password: "123456",
      role: "customer" as const,
    })

    const createdEvent = await createEventRepo.createEvent({
      ownerId: owner.id,
      name: "Old name",
      ticketPriceInCents: 1000,
      longitude: -46,
      latitude: -23,
      date: new Date(),
    })

    const updated = await sut.updateEvent(createdEvent.id, {
      name: "New name",
      ticketPriceInCents: 5000,
    })

    expect(updated).toBeDefined()
    expect(updated?.id).toBe(createdEvent.id)
    expect(updated?.name).toBe("New name")
    expect(updated?.ticketPriceInCents).toBe(5000)

    // verifica no banco
    const events = await db.select().from(schema.eventsTable)

    const found = events.find((e) => e.id === createdEvent.id)

    expect(found).toBeDefined()
    expect(found?.name).toBe("New name")
    expect(found?.ticketPriceInCents).toBe(5000)
  })

  it("should return null if event does not exist", async () => {
    const sut = new UpdateEventRepository()

    const result = await sut.updateEvent(
      "00000000-0000-0000-0000-000000000000",
      {
        name: "Test",
      }
    )

    expect(result).toBeNull()
  })
})
