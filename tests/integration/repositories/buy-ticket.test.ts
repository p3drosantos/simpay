// import { db } from "../../../src/db/client"
// import * as schema from "../../../src/db/schema"
import { CreateEventRepository } from "../../../src/repositories/events/create-event"
import { BuyTicketRepository } from "../../../src/repositories/ticket/buy-ticket"
import { CreateUserRepository } from "../../../src/repositories/users/create-user"

describe("BuyTicketRepository", () => {
  it("should buy a ticket successfully", async () => {
    const userRepo = new CreateUserRepository()
    const eventRepo = new CreateEventRepository()
    const sut = new BuyTicketRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner@example.com",
      password: "123456",
      role: "customer" as const,
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const eventData = {
      ownerId: owner.id,
      name: "Test Event",
      maxTickets: 10,
      ticketPriceInCents: 5000,
      longitude: -46.633308,
      latitude: -23.55052,
      date: futureDate,
    }

    const event = await eventRepo.createEvent(eventData)

    const ticket = await sut.buyTicket({
      eventId: event.id,
      buyerId: owner.id,
      quantity: 5,
      totalPriceInCents: 25000,
      status: "pending",
    })

    expect(ticket).toBeDefined()
    expect(ticket.eventId).toBe(event.id)
    expect(ticket.buyerId).toBe(owner.id)
    expect(ticket.quantity).toBe(5)
    expect(ticket.totalPriceInCents).toBe(25000)
    expect(ticket.status).toBe("pending")
    expect(ticket.createdAt).toBeInstanceOf(Date)
  })
  it("should sum tickets correctly", async () => {
    const userRepo = new CreateUserRepository()
    const eventRepo = new CreateEventRepository()
    const sut = new BuyTicketRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner2@example.com",
      password: "123456",
      role: "customer",
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const event = await eventRepo.createEvent({
      ownerId: owner.id,
      name: "Event",
      maxTickets: 100,
      ticketPriceInCents: 100,
      longitude: 0,
      latitude: 0,
      date: futureDate,
    })

    await sut.buyTicket({
      eventId: event.id,
      buyerId: owner.id,
      quantity: 2,
      totalPriceInCents: 200,
      status: "pending",
    })

    await sut.buyTicket({
      eventId: event.id,
      buyerId: owner.id,
      quantity: 3,
      totalPriceInCents: 300,
      status: "pending",
    })

    const total = await sut.sumTicketsByEventId(event.id)

    expect(total).toBe(5)
  })
  it("should update ticket status", async () => {
    const userRepo = new CreateUserRepository()
    const eventRepo = new CreateEventRepository()
    const sut = new BuyTicketRepository()

    const user = await userRepo.createUser({
      name: "User",
      email: "user-update@example.com",
      password: "123456",
      role: "customer",
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const event = await eventRepo.createEvent({
      ownerId: user.id,
      name: "Event",
      maxTickets: 10,
      ticketPriceInCents: 100,
      longitude: 0,
      latitude: 0,
      date: futureDate,
    })

    const ticket = await sut.buyTicket({
      eventId: event.id,
      buyerId: user.id,
      quantity: 1,
      totalPriceInCents: 100,
      status: "pending",
    })

    const updated = await sut.updateTicket(ticket.id, {
      status: "paid",
    })

    expect(updated.status).toBe("paid")
  })
  it("should throw if ticket does not exist", async () => {
    const sut = new BuyTicketRepository()

    await expect(
      sut.updateTicket("non-existent-id", { status: "paid" })
    ).rejects.toThrow()
  })
  it("should return 0 when no tickets", async () => {
    const userRepo = new CreateUserRepository()
    const eventRepo = new CreateEventRepository()
    const sut = new BuyTicketRepository()

    const owner = await userRepo.createUser({
      name: "Owner",
      email: "owner3@example.com",
      password: "123456",
      role: "customer",
    })

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)

    const event = await eventRepo.createEvent({
      ownerId: owner.id,
      name: "Event",
      maxTickets: 100,
      ticketPriceInCents: 100,
      longitude: 0,
      latitude: 0,
      date: futureDate,
    })

    const total = await sut.sumTicketsByEventId(event.id)

    expect(total).toBe(0)
  })
})
