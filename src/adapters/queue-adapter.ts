import { IQueue } from "../interfaces/queue.js"
import { sendMessageToQueue } from "../lib/sqs.js"

export class QueueAdapter implements IQueue {
  async sendMessage(message: object): Promise<void> {
    await sendMessageToQueue(message)
  }
}
