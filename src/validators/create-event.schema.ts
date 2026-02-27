import { z } from "zod"

export const createEventSchema = z.object({
  ownerId: z.uuid("Invalid owner ID"),
  name: z.string().min(3, "Event name is required"),
  ticketPriceInCents: z
    .number()
    .positive("Ticket price must be a positive number"),
  longitude: z
    .number()
    .min(-180)
    .max(180, "Longitude must be between -180 and 180"),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  date: z.coerce.date().refine((date) => date > new Date(), {
    message: "Date must be in the future",
  }),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
