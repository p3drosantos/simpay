import {
  IDeleteEventRepository,
  IDeleteEventUseCase,
} from "../controllers/events/protocols.js"

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(private deleteEventRepository: IDeleteEventRepository) {}

  async deleteEvent(id: string) {
    const deletedEvent = await this.deleteEventRepository.deleteEvent(id)
    return deletedEvent
  }
}
