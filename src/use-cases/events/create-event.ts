import {
  ICreateEventsRepository,
  ICreateEventUseCase,
  IGetEventByLocationAndDateRepository,
} from "../../controllers/events/protocols.js"
import { IGetUserByIdRepository } from "../../controllers/users/protocols.js"
import {
  EventAlreadyExistsError,
  EventDateIsInThePastError,
} from "../../errors/users/event.js"
import { UserNotFoundError } from "../../errors/users/user-errors.js"
import { CreateEventInput } from "../../validators/create-event.schema.js"

export type CreateEventUseCaseinput = CreateEventInput & {
  ownerId: string
}

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(
    private createEventsRepository: ICreateEventsRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private getEventByLocationAndDateRepository: IGetEventByLocationAndDateRepository
  ) {}

  async createEvent(params: CreateEventUseCaseinput) {
    if (params.date < new Date()) {
      throw new EventDateIsInThePastError()
    }

    const user = await this.getUserByIdRepository.getUserById(params.ownerId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const eventAlreadyExists =
      await this.getEventByLocationAndDateRepository.getEventByLocationAndDate(
        params.longitude,
        params.latitude,
        params.date
      )

    if (eventAlreadyExists) {
      throw new EventAlreadyExistsError()
    }

    return this.createEventsRepository.createEvent(params)
  }
}
