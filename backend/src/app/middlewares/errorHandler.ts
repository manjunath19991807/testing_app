import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AuthError } from "../../modules/auth/errors.js";
import { DatasetParseError } from "../../modules/datasets/errors.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation failed",
      issues: error.flatten()
    });
  }

  if (error instanceof DatasetParseError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  if (error instanceof AuthError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  if (error instanceof Error) {
    return response.status(500).json({
      message: error.message
    });
  }

  return response.status(500).json({
    message: "Unexpected server error"
  });
}
