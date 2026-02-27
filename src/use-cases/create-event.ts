import {
  createEventsParams,
  ICreateEventUseCase,
} from "../controllers/events/protocols.js"

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(private createEventsRepository: ICreateEventUseCase) {}

  async createEvent(params: createEventsParams) {
    return this.createEventsRepository.createEvent(params)
  }
}
