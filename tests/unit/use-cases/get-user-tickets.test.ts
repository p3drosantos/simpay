import { UnauthorizedError } from "../../../src/errors/users/user-errors"
import { GetUserTicketsUseCase } from "../../../src/use-cases/ticket/get-user-tickets"

const makeSut = () => {
  const mockRepository = {
    getUserTickets: jest.fn(),
  }

  const sut = new GetUserTicketsUseCase(mockRepository)

  return {
    sut,
    mockRepository,
  }
}

const date = new Date("2027-01-01T00:00:00Z")

const makeResponse = () => {
  return [
    {
      ticket: {
        id: "any_id",
        quantity: 2,
        totalPriceInCents: 1000,
        status: "paid",
        createdAt: date,
      },
      event: {
        id: "any_id",
        name: "any_name",
        date: date,
      },
    },
  ]
}

const makeResponseUseCase = () => {
  return [
    {
      id: "any_id",
      quantity: 2,
      totalPriceInCents: 1000,
      status: "paid",
      createdAt: date,
      event: {
        id: "any_id",
        name: "any_name",
        date: date,
      },
    },
  ]
}

describe("GetUserTicketsUseCase", () => {
  it("should return user tickets on success", async () => {
    const { sut, mockRepository } = makeSut()
    const response = makeResponse()

    mockRepository.getUserTickets.mockResolvedValue(response)

    const result = await sut.getUserTickets("any_user_id")
    expect(result).toEqual(makeResponseUseCase())
    expect(mockRepository.getUserTickets).toHaveBeenCalledWith("any_user_id")
  })

  it("should throw an error if user id is not provided", async () => {
    const { sut } = makeSut()

    await expect(sut.getUserTickets("")).rejects.toThrow(UnauthorizedError)
  })

  it("should return an error if repository throws an error", async () => {
    const { sut, mockRepository } = makeSut()

    mockRepository.getUserTickets.mockRejectedValue(
      new Error("Repository error")
    )

    await expect(sut.getUserTickets("any_user_id")).rejects.toThrow(
      "Repository error"
    )
  })

  it("should return an empty array if user has no tickets", async () => {
    const { sut, mockRepository } = makeSut()

    mockRepository.getUserTickets.mockResolvedValue([])

    const result = await sut.getUserTickets("any_user_id")
    expect(result).toEqual([])
  })

  it("should return array with event null if event is not found", async () => {
    const { sut, mockRepository } = makeSut()
    const response = [
      {
        ticket: {
          id: "any_id",
          quantity: 2,
          totalPriceInCents: 1000,
          status: "paid",

          createdAt: date,
        },
        event: null,
      },
    ]

    mockRepository.getUserTickets.mockResolvedValue(response)

    const result = await sut.getUserTickets("any_user_id")
    expect(result).toEqual([
      {
        id: "any_id",
        quantity: 2,
        totalPriceInCents: 1000,
        status: "paid",
        createdAt: date,
        event: null,
      },
    ])
  })
})
