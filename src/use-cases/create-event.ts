import {
  createEventsParams,
  ICreateEventsRepository,
  ICreateEventUseCase,
} from "../controllers/events/protocols.js"

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(private createEventsRepository: ICreateEventsRepository) {}

  async createEvent(params: createEventsParams) {
    return this.createEventsRepository.createEvent(params)
  }
}
