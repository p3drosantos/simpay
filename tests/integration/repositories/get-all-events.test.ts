import { GetAllEventsRepository } from "../../../src/repositories/events/get-all-events"
import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"

describe("GetAllEventsRepository", () => {
  it("should return empty array if no events exist", async () => {
    const sut = new GetAllEventsRepository()

    const events = await sut.getAllEvents()

    expect(events).toEqual([])
  })

  it("should return all events", async () => {
    const userRepo = new CreateUserRepository()
    const createEventRepo = new CreateEventRepository()
    const sut = new GetAllEventsRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner_get_all@example.com",
      password: "123456",
      role: "customer" as const,
    })

    const event1 = await createEventRepo.createEvent({
      ownerId: owner.id,
      name: "Event 1",
      maxTickets: 10,
      ticketPriceInCents: 1000,
      longitude: -46,
      latitude: -23,
      date: new Date(),
    })

    const event2 = await createEventRepo.createEvent({
      ownerId: owner.id,
      name: "Event 2",
      maxTickets: 5,
      ticketPriceInCents: 2000,
      longitude: -47,
      latitude: -24,
      date: new Date(),
    })

    const events = await sut.getAllEvents()

    expect(events.length).toBeGreaterThanOrEqual(2)

    const found1 = events.find((e) => e.id === event1.id)
    const found2 = events.find((e) => e.id === event2.id)

    expect(found1).toBeDefined()
    expect(found2).toBeDefined()

    expect(found1?.name).toBe("Event 1")
    expect(found2?.name).toBe("Event 2")
  })
})
