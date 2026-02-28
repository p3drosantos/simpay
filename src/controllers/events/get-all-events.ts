import { IGetAllEventsController, IGetAllEventsUseCase } from "./protocols.js"

export class GetAllEventsController implements IGetAllEventsController {
  constructor(private getAllEventsUseCase: IGetAllEventsUseCase) {}
  async getAllEvents() {
    try {
      const events = await this.getAllEventsUseCase.getAllEvents()
      return {
        statusCode: 200,
        body: events,
      }
    } catch {
      return {
        statusCode: 500,
        body: { error: "An error occurred while fetching events." },
      }
    }
  }
}
