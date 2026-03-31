import { Router } from "express"
import express from "express"
import { StripeWebhookController } from "../controllers/stripe/stripe-webhook.js"
import { BuyTicketRepository } from "../repositories/ticket/buy-ticket.js"
import { StripeWebhookUseCase } from "../use-cases/stripe/stripe-webhook.js"
import { QueueAdapter } from "../adapters/queue-adapter.js"

const webhookRouter = Router()

webhookRouter.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),

  async (req, res) => {
    const controller = new StripeWebhookController(
      new StripeWebhookUseCase(new BuyTicketRepository(), new QueueAdapter())
    )

    const response = await controller.updateFromWebhook({
      rawBody: req.body,
      stripeSignature: req.headers["stripe-signature"] as string | undefined,
    })

    res.status(response.statusCode).json(response.body)
  }
)

export default webhookRouter
