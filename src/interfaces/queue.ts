export interface IQueue {
  sendMessage(message: object): Promise<void>
}
