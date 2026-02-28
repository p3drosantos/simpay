import {
  IGetAllEventsRepository,
  IGetAllEventsUseCase,
} from "../controllers/events/protocols.js"

export class GetAllEventsUseCase implements IGetAllEventsUseCase {
  constructor(private getAllEventsRepository: IGetAllEventsRepository) {}
  async getAllEvents() {
    return await this.getAllEventsRepository.getAllEvents()
  }
}
