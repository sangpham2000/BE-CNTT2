import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let errorMessage: string;
    let errorDetails: any = {};

    if (typeof errorResponse === 'string') {
      errorMessage = errorResponse;
    } else if (typeof errorResponse === 'object') {
      errorMessage = (errorResponse as any).message || 'An error occurred';
      errorDetails = (errorResponse as any).error
        ? { error: (errorResponse as any).error }
        : {};
      if ((errorResponse as any).statusCode) {
        errorDetails.statusCode = (errorResponse as any).statusCode;
      }
    } else {
      errorMessage = 'An error occurred';
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorMessage}`,
    );

    // Respond with error
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
      ...errorDetails,
    });
  }
}
