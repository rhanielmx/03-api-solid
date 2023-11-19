export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      "The CheckIn can only be validated up to 20 minutes after its creation.",
    );
  }
}
