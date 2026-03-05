import {
  IUpdateEventRepository,
  IUpdateEventUseCase,
} from "../../controllers/events/protocols.js"
import { UpdateEventInput } from "../../validators/create-event.schema.js"
import { Event } from "../../models/event.js"

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(private updateEventRepository: IUpdateEventRepository) {}

  async updateEvent(
    id: string,
    data: Partial<UpdateEventInput>
  ): Promise<Event | null> {
    const updatedEvent = await this.updateEventRepository.updateEvent(id, data)

    return updatedEvent
  }
}
