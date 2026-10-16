export interface FieldValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errors?: FieldValidationError[];

  constructor(message: string, statusCode = 500, errors?: FieldValidationError[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
