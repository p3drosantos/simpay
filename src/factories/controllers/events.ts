import { CreateEventController } from "../../controllers/events/create-event.js"
import { DeleteEventController } from "../../controllers/events/delete-event.js"
import { GetAllEventsController } from "../../controllers/events/get-all-events.js"
import { GetEventByIdController } from "../../controllers/events/get-event-by-id.js"
import { UpdateEventController } from "../../controllers/events/update-event.js"
import { CreateEventRepository } from "../../repositories/events/create-event.js"
import { DeleteEventRepository } from "../../repositories/events/delete-event.js"
import { GetAllEventsRepository } from "../../repositories/events/get-all-events.js"
import { GetEventByIdRepository } from "../../repositories/events/get-event-by-id.js"
import { GetEventByLocationAndDateRepository } from "../../repositories/events/get-event-by-location-and-date.js"
import { UpdateEventRepository } from "../../repositories/events/update-event.js"
import { GetUserByIdRepository } from "../../repositories/users/get-user-by-id.js"
import { CreateEventUseCase } from "../../use-cases/events/create-event.js"
import { DeleteEventUseCase } from "../../use-cases/events/delete-event.js"
import { GetAllEventsUseCase } from "../../use-cases/events/get-all-events.js"
import { GetEventByIdUseCase } from "../../use-cases/events/get-event-by-id.js"
import { UpdateEventUseCase } from "../../use-cases/events/update-event.js"

export const makeCreateEventController = () => {
  const createEventRepository = new CreateEventRepository()
  const getUserByIdRepository = new GetUserByIdRepository()
  const getEventByLocationAndDateRepository =
    new GetEventByLocationAndDateRepository()
  const createEventUseCase = new CreateEventUseCase(
    createEventRepository,
    getUserByIdRepository,
    getEventByLocationAndDateRepository
  )
  const createEventController = new CreateEventController(createEventUseCase)

  return createEventController
}

export const makeGetEventByIdController = () => {
  const getEventByIdRepository = new GetEventByIdRepository()
  const getEventByIdUseCase = new GetEventByIdUseCase(getEventByIdRepository)
  const getEventByIdController = new GetEventByIdController(getEventByIdUseCase)
  return getEventByIdController
}

export const makeGetAllEventsController = () => {
  const getAllEventsRepository = new GetAllEventsRepository()
  const getAllEventsUseCase = new GetAllEventsUseCase(getAllEventsRepository)
  const getAllEventsController = new GetAllEventsController(getAllEventsUseCase)

  return getAllEventsController
}

export const makeUpdateEventController = () => {
  const updateEventRepository = new UpdateEventRepository()
  const getEventByIdRepository = new GetEventByIdRepository()
  const updateEventUseCase = new UpdateEventUseCase(
    updateEventRepository,
    getEventByIdRepository
  )
  const updateEventController = new UpdateEventController(updateEventUseCase)

  return updateEventController
}

export const makeDeleteEventController = () => {
  const deleteEventRepository = new DeleteEventRepository()
  const getEventByIdRepository = new GetEventByIdRepository()
  const deleteEventUseCase = new DeleteEventUseCase(
    deleteEventRepository,
    getEventByIdRepository
  )
  const deleteEventController = new DeleteEventController(deleteEventUseCase)

  return deleteEventController
}
