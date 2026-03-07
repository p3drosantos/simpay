import {
  IGetEventByIdRepository,
  IUpdateEventRepository,
  IUpdateEventUseCase,
} from "../../controllers/events/protocols.js"
import { UpdateEventInput } from "../../validators/create-event.schema.js"
import { Event } from "../../models/event.js"
import { EventNotFoundError } from "../../errors/users/event.js"
import { UnauthorizedError } from "../../errors/users/user-errors.js"

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(
    private updateEventRepository: IUpdateEventRepository,
    private getUserByIdRepository: IGetEventByIdRepository
  ) {}

  async updateEvent(
    id: string,
    userId: string,
    data: Partial<UpdateEventInput>
  ): Promise<Event | null> {
    const event = await this.getUserByIdRepository.getEventById(id)

    if (!event) {
      throw new EventNotFoundError()
    }

    if (event.ownerId !== userId) {
      throw new UnauthorizedError()
    }

    const updatedEvent = await this.updateEventRepository.updateEvent(id, data)

    return updatedEvent
  }
}
