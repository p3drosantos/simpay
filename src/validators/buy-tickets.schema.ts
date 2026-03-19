import { z } from "zod"

export const buyTicketsSchema = z.object({
  quantity: z
    .number()
    .positive("Quantity must be a positive number")
    .min(1, "Quantity must be at least 1"),
})

export type BuyTicketsInput = z.infer<typeof buyTicketsSchema>
