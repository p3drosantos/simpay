import dotenv from "dotenv"

import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs"

import { handleMessage } from "./handle-message.js"

dotenv.config()

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function pollMessages() {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL!,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10,
  })

  const response = await sqs.send(command)

  if (!response.Messages) return

  for (const message of response.Messages) {
    await handleMessage(message.Body!)

    if (message.ReceiptHandle) {
      await sqs.send(
        new DeleteMessageCommand({
          QueueUrl: process.env.SQS_QUEUE_URL!,
          ReceiptHandle: message.ReceiptHandle,
        })
      )
    }
  }
}

async function startWorker() {
  while (true) {
    await pollMessages()
  }
}

startWorker()
