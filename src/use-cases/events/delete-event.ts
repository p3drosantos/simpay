import {
  IDeleteEventRepository,
  IDeleteEventUseCase,
  IGetEventByIdRepository,
} from "../../controllers/events/protocols.js"
import { EventNotFoundError } from "../../errors/users/event.js"
import { UnauthorizedError } from "../../errors/users/user-errors.js"

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(
    private deleteEventRepository: IDeleteEventRepository,
    private getEventByIdRepository: IGetEventByIdRepository
  ) {}

  async deleteEvent(id: string, userId: string) {
    const event = await this.getEventByIdRepository.getEventById(id)

    if (!event) {
      throw new EventNotFoundError()
    }

    if (event.ownerId !== userId) {
      throw new UnauthorizedError()
    }

    const deletedEvent = await this.deleteEventRepository.deleteEvent(id)
    return deletedEvent
  }
}
