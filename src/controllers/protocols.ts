export interface HttpRequest<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
  THeaders = unknown,
> {
  body?: TBody
  params?: TParams
  query?: TQuery
  headers?: THeaders
}

export interface HttpResponse<T> {
  statusCode: HttpStatusCode
  body: T | string
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500,
  NOT_FOUND = 404,
}
