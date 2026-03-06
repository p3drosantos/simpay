import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must have at least 6 characters"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
