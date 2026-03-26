import { HttpResponse } from "../protocols.js"
import {
  IStripeWebhookController,
  IStripeWebhookUseCase,
  StripeWebhookRequest,
} from "./protocols.js"

import Stripe from "stripe"

export class StripeWebhookController implements IStripeWebhookController {
  constructor(private readonly stripeWebhookUseCase: IStripeWebhookUseCase) {}

  async updateFromWebhook(
    request: StripeWebhookRequest
  ): Promise<HttpResponse<{ ticketId: string } | { error: string }>> {
    try {
      const rawBody = request.rawBody
      const signature = request.stripeSignature

      if (!signature) {
        return {
          statusCode: 400,
          body: { error: "Missing stripe signature" },
        }
      }

      const event = Stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      const result = await this.stripeWebhookUseCase.updateFromWebhook(event)

      return {
        statusCode: 200,
        body: { ticketId: result.ticketId },
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: (error as Error).message },
      }
    }
  }
}
