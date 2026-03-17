import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"
import { DeleteEventRepository } from "../../../src/repositories/events/delete-event"
import { db } from "../../../src/db/client"
import * as schema from "../../../src/db/schema"
import { eq } from "drizzle-orm"

describe("DeleteEventRepository", () => {
  it("should delete an existing event successfully", async () => {
    const userRepo = new CreateUserRepository()
    const createEventRepo = new CreateEventRepository()
    const sut = new DeleteEventRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner_delete@example.com",
      password: "123456",
      role: "customer" as const,
    })

    const event = await createEventRepo.createEvent({
      ownerId: owner.id,
      name: "Event To Delete",
      ticketPriceInCents: 5000,
      longitude: -46.632,
      latitude: -23.551,
      date: new Date(),
    })

    const deleted = await sut.deleteEvent(event.id)

    expect(deleted).toBeDefined()
    expect(deleted?.id).toBe(event.id)
    expect(deleted?.name).toBe(event.name)

    const found = await db
      .select()
      .from(schema.eventsTable)
      .where(eq(schema.eventsTable.id, event.id))
    expect(found[0]).toBeUndefined()
  })

  it("should return null if event does not exist", async () => {
    const sut = new DeleteEventRepository()

    const result = await sut.deleteEvent(crypto.randomUUID())
    expect(result).toBeNull()
  })
})
