import { handleMessage } from "../../../src/worker/handle-message"
import { sendEmail } from "../../../src/lib/email"
import { GetUserByIdRepository } from "../../../src/repositories/users/get-user-by-id"

jest.mock("../../../src/lib/email", () => ({
  sendEmail: jest.fn(),
}))

jest.mock("../../../src/repositories/users/get-user-by-id", () => ({
  GetUserByIdRepository: jest.fn().mockImplementation(() => ({
    getUserById: jest.fn(),
  })),
}))

describe("handleMessage", () => {
  it("should send email when PAYMENT_CONFIRMED message is received", async () => {
    const mockGetUserById = jest.fn().mockResolvedValue({
      id: "user-1",
      email: "test@email.com",
    })

    ;(GetUserByIdRepository as jest.Mock).mockImplementation(() => ({
      getUserById: mockGetUserById,
    }))

    const message = JSON.stringify({
      type: "PAYMENT_CONFIRMED",
      buyerId: "user-1",
    })

    await handleMessage(message)

    expect(mockGetUserById).toHaveBeenCalledWith("user-1")

    expect(sendEmail).toHaveBeenCalledWith("test@email.com")
  })
})
