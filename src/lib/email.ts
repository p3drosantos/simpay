import dotenv from "dotenv"

import { Resend } from "resend"
dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string) {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: "Pagamento confirmado 🎉",
    html: `
              <h1>Pagamento confirmado com sucesso 🎉</h1>
              <p>Seu ingresso foi confirmado com sucesso.</p>
              <p>Obrigado por usar nossa plataforma.</p>
            `,
  })

  console.log("Email enviado:", response)
}
