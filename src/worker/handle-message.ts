import { sendEmail } from "../lib/email.js"
import { GetUserByIdRepository } from "../repositories/users/get-user-by-id.js"

export async function handleMessage(rawMessage: string) {
  const data = JSON.parse(rawMessage)
  console.log("📦 DATA:", data)

  if (data.type === "PAYMENT_CONFIRMED") {
    console.log("📦 DATA:", data)
    const getUserByIdRepository = new GetUserByIdRepository()

    const user = await getUserByIdRepository.getUserById(data.buyerId)

    if (!user) {
      console.log("✅ email enviado")
      return
    }
    console.log("📧 tentando enviar email para:", user.email)
    await sendEmail(user.email)
    console.log("✅ email enviado")
  }
}
