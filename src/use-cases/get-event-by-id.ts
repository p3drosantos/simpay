import {
  IGetEventByIdRepository,
  IGetEventByIdUseCase,
} from "../controllers/events/protocols.js"

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private getEventByIdRepository: IGetEventByIdRepository) {}
  async getEventById(id: string) {
    return this.getEventByIdRepository.getEventById(id)
  }
}
