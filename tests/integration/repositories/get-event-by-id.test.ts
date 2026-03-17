import { GetEventByIdRepository } from "../../../src/repositories/events/get-event-by-id"
import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"

describe("GetEventByIdRepository", () => {
  it("should return event when event exists", async () => {
    const userRepo = new CreateUserRepository()
    const createEventRepo = new CreateEventRepository()
    const sut = new GetEventByIdRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner_get_by_id@example.com",
      password: "123456",
      role: "customer" as const,
    })

    const createdEvent = await createEventRepo.createEvent({
      ownerId: owner.id,
      name: "Event Test",
      maxTickets: 10,
      ticketPriceInCents: 5000,
      longitude: -46,
      latitude: -23,
      date: new Date(),
    })

    const event = await sut.getEventById(createdEvent.id)

    expect(event).toBeDefined()
    expect(event?.id).toBe(createdEvent.id)
    expect(event?.name).toBe(createdEvent.name)
    expect(event?.ownerId).toBe(owner.id)
  })

  it("should return null if event does not exist", async () => {
    const sut = new GetEventByIdRepository()

    const event = await sut.getEventById("00000000-0000-0000-0000-000000000000")

    expect(event).toBeNull()
  })
})
