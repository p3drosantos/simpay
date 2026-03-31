import dotenv from "dotenv"

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

dotenv.config()

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function sendMessageToQueue(message: object) {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL!,
    MessageBody: JSON.stringify(message),
  })

  await sqs.send(command)
}
