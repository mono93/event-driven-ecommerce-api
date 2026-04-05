import { HttpStatus, Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class ResponseService {
  public success<T>(res: Response, statusCode: HttpStatus, message: string = "OK", data?: T) {
    return res.status(statusCode).send({
      message: message,
      data: data,
    });
  }

  public error<T>(res: Response, statusCode: HttpStatus, message: string = "ERROR", error?: T) {
    return res.status(statusCode).send({
      message: message,
      error: error,
    });
  }
}
