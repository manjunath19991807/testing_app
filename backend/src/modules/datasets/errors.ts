export class DatasetParseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "DatasetParseError";
    this.statusCode = statusCode;
  }
}
