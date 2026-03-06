import {
  ICreateEventsRepository,
  ICreateEventUseCase,
} from "../../controllers/events/protocols.js"
import { CreateEventInput } from "../../validators/create-event.schema.js"

export type CreateEventUseCaseinput = CreateEventInput & {
  ownerId: string
}

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(private createEventsRepository: ICreateEventsRepository) {}

  async createEvent(params: CreateEventUseCaseinput) {
    return this.createEventsRepository.createEvent(params)
  }
}
