import {
  ICreateEventsRepository,
  ICreateEventUseCase,
} from "../controllers/events/protocols.js"
import { CreateEventInput } from "../validators/create-event.schema.js"

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(private createEventsRepository: ICreateEventsRepository) {}

  async createEvent(params: CreateEventInput) {
    return this.createEventsRepository.createEvent(params)
  }
}
