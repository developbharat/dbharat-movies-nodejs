export class ValidationError extends Error {
  isValidationError: boolean = true;

  ValidationError(message: string) {
    this.message = message;
  }
}
