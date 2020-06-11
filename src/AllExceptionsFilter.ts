import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
    let message = ""
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      message = exception.message
      // ToDo: A better solution is required
      if ((exception.message as any) instanceof Object) {
        message = (exception.message as any).message
      }
    }

    this.logger.error(exception)

    response.status(statusCode).json({
      message,
      path: request.url,
      statusCode,
      timestamp: new Date().toISOString(),
    })
  }
}
