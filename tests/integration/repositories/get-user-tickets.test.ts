import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { BuyTicketRepository } from "../../../src/repositories/ticket/buy-ticket"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"
import { GetUserTicketsRepository } from "../../../src/repositories/ticket/get-user-tickets"

describe("GetUserTicketsRepository", () => {
  it("should return tickets for a given user", async () => {
    const user = new CreateUserRepository()
    const event = new CreateEventRepository()
    const ticketRepo = new BuyTicketRepository()
    const sut = new GetUserTicketsRepository()

    const createdUser = await user.createUser({
      name: "Test User",
      email: "FtVdS@example.com",
      password: "password123",
      role: "customer",
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const createdEvent = await event.createEvent({
      ownerId: createdUser.id,
      name: "Test Event",
      maxTickets: 10,
      ticketPriceInCents: 5000,
      longitude: -46.633308,
      latitude: -23.55052,
      date: futureDate,
    })

    const createdTicket = await ticketRepo.buyTicket({
      eventId: createdEvent.id,
      buyerId: createdUser.id,
      quantity: 2,
      totalPriceInCents: 10000,
      status: "paid",
    })

    const tickets = await sut.getUserTickets(createdUser.id)

    expect(tickets).toBeDefined()
    expect(Array.isArray(tickets)).toBe(true)
    expect(tickets).toHaveLength(1)
    expect(tickets[0]).toMatchObject({
      ticket: {
        id: createdTicket.id,
        quantity: 2,
        totalPriceInCents: 10000,
        status: "paid",
        createdAt: expect.any(Date),
      },
      event: {
        id: createdEvent.id,
        name: createdEvent.name,
        date: createdEvent.date,
      },
    })
  })

  it("should return an empty array if user has no tickets", async () => {
    const user = new CreateUserRepository()
    const sut = new GetUserTicketsRepository()

    const createdUser = await user.createUser({
      name: "No Tickets User",
      email: "no_tickets_FtVdS@example.com",
      password: "password123",
      role: "customer",
    })
    const tickets = await sut.getUserTickets(createdUser.id)

    expect(tickets).toBeDefined()
    expect(Array.isArray(tickets)).toBe(true)
    expect(tickets).toHaveLength(0)
  })

  it("should return empty array when no tickets match userId", async () => {
    const sut = new GetUserTicketsRepository()
    const userId = crypto.randomUUID()
    const tickets = await sut.getUserTickets(userId)

    expect(tickets).toBeDefined()
    expect(Array.isArray(tickets)).toBe(true)
    expect(tickets).toHaveLength(0)
  })

  it("should return only tickets for the specified user", async () => {
    const userRepo = new CreateUserRepository()
    const eventRepo = new CreateEventRepository()
    const ticketRepo = new BuyTicketRepository()
    const sut = new GetUserTicketsRepository()

    const user1 = await userRepo.createUser({
      name: "User One",
      email: "user1_FtVdS@example.com",
      password: "password123",
      role: "customer",
    })

    const user2 = await userRepo.createUser({
      name: "User Two",
      email: "user2_FtVdS@example.com",
      password: "password123",
      role: "customer",
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const event1 = await eventRepo.createEvent({
      ownerId: user1.id,
      name: "Event One",
      maxTickets: 10,
      ticketPriceInCents: 5000,
      longitude: -46.633308,
      latitude: -23.55052,
      date: futureDate,
    })

    const event2 = await eventRepo.createEvent({
      ownerId: user2.id,
      name: "Event Two",
      maxTickets: 10,
      ticketPriceInCents: 5000,
      longitude: -46.633308,
      latitude: -23.55052,
      date: futureDate,
    })

    await ticketRepo.buyTicket({
      eventId: event1.id,
      buyerId: user1.id,
      quantity: 2,
      totalPriceInCents: 10000,
      status: "paid",
    })

    await ticketRepo.buyTicket({
      eventId: event2.id,
      buyerId: user2.id,
      quantity: 5,
      totalPriceInCents: 25000,
      status: "paid",
    })

    const tickets = await sut.getUserTickets(user1.id)

    expect(tickets).toBeDefined()
    expect(Array.isArray(tickets)).toBe(true)
    expect(tickets).toHaveLength(1)
    expect(tickets[0].event?.id).toBe(event1.id)
    expect(tickets[0].ticket.quantity).toBe(2)
    expect(tickets[0].ticket.totalPriceInCents).toBe(10000)
  })
})
