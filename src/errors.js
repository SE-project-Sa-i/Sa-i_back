export class IntervalServerError extends Error {
  errorCode = "S001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserEmailError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserIDError extends Error {
  errorCode = "U002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserNotFoundError extends Error {
  errorCode = "U301";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class MismatchedPasswordError extends Error {
  errorCode = "U302";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class AccessDBError extends Error {
  errorCode = "DB001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class MissRequiredFieldError extends Error {
  errorCode = "F001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
export class UnauthorizedError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = 'UnauthorizedError';
    this.errorCode = 'unauthorized';
    this.statusCode = 401;
    this.data = data;
  }
}
export class NotFoundError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.errorCode = 'not_found';
    this.reason = message;
    this.data = data;
  }
}