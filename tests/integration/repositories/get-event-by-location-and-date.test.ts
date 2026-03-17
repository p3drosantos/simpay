import { GetEventByLocationAndDateRepository } from "../../../src/repositories/events/get-event-by-location-and-date"
import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"

describe("GetEventByLocationAndDateRepository", () => {
  it("should return event when location and date match", async () => {
    const userRepo = new CreateUserRepository()
    const createEventRepo = new CreateEventRepository()
    const sut = new GetEventByLocationAndDateRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner_location@example.com",
      password: "123456",
      role: "customer" as const,
    })

    const date = new Date()

    const createdEvent = await createEventRepo.createEvent({
      ownerId: owner.id,
      name: "Location Event",
      ticketPriceInCents: 1000,
      longitude: -46.63,
      latitude: -23.55,
      date,
    })

    const event = await sut.getEventByLocationAndDate(-46.63, -23.55, date)

    expect(event).toBeDefined()
    expect(event?.id).toBe(createdEvent.id)
    expect(event?.longitude).toBe(-46.63)
    expect(event?.latitude).toBe(-23.55)
  })

  it("should return null when event does not exist", async () => {
    const sut = new GetEventByLocationAndDateRepository()

    const event = await sut.getEventByLocationAndDate(
      0,
      0,
      new Date("2030-01-01")
    )

    expect(event).toBeNull()
  })
})
