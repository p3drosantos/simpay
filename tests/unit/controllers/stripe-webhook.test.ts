jest.mock("../../../src/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}))

import { StripeWebhookController } from "../../../src/controllers/stripe/stripe-webhook"
import { stripe } from "../../../src/lib/stripe"

const makeSut = () => {
  const mockUseCase = {
    updateFromWebhook: jest.fn(),
  }

  const sut = new StripeWebhookController(mockUseCase)

  return { sut, mockUseCase }
}

describe("Stripe Webhook Controller", () => {
  it("should return 400 if signature is missing", async () => {
    const { sut } = makeSut()

    const response = await sut.updateFromWebhook({
      rawBody: Buffer.from("{}"),
      stripeSignature: undefined,
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: "Missing stripe signature",
    })
  })
  it("should return 200 on success", async () => {
    const { sut, mockUseCase } = makeSut()

    const fakeEvent = { type: "checkout.session.completed" }

    ;(stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(fakeEvent)

    mockUseCase.updateFromWebhook.mockResolvedValue({
      ticketId: "ticket-123",
    })

    const response = await sut.updateFromWebhook({
      rawBody: Buffer.from("{}"),
      stripeSignature: "valid-signature",
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      ticketId: "ticket-123",
    })

    expect(mockUseCase.updateFromWebhook).toHaveBeenCalledWith(fakeEvent)
  })
  it("should return 500 if use case throws", async () => {
    const { sut, mockUseCase } = makeSut()

    const fakeEvent = { type: "checkout.session.completed" }

    ;(stripe.webhooks.constructEvent as jest.Mock).mockReturnValue(fakeEvent)

    mockUseCase.updateFromWebhook.mockRejectedValue(
      new Error("something went wrong")
    )

    const response = await sut.updateFromWebhook({
      rawBody: Buffer.from("{}"),
      stripeSignature: "valid-signature",
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "something went wrong",
    })
  })
  it("should return 500 if Stripe constructEvent fails", async () => {
    const { sut } = makeSut()

    ;(stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error("invalid signature")
    })

    const response = await sut.updateFromWebhook({
      rawBody: Buffer.from("{}"),
      stripeSignature: "invalid-signature",
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({
      error: "invalid signature",
    })
  })
})
