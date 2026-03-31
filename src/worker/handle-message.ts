import { sendEmail } from "../lib/email.js"
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id.js"

export async function handleMessage(rawMessage: string) {
  const data = JSON.parse(rawMessage)

  if (data.type === "PAYMENT_CONFIRMED") {
    const getUserByIdRepository = new GetUserByIdRepository()

    const user = await getUserByIdRepository.getUserById(data.buyerId)

    if (!user) return

    await sendEmail(user.email)
  }
}
