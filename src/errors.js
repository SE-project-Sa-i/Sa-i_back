export class IntervalServerError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "IntervalServerError";
    this.errorCode = "S001";
    this.statusCode = 500;
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserEmailError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "DuplicateUserEmailError";
    this.errorCode = "U001";
    this.statusCode = 400;
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserIDError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "DuplicateUserIDError";
    this.errorCode = "U002";
    this.statusCode = 400;
    this.reason = reason;
    this.data = data;
  }
}

export class UserNotFoundError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "UserNotFoundError";
    this.errorCode = "U301";
    this.statusCode = 404;
    this.reason = reason;
    this.data = data;
  }
}

export class MismatchedPasswordError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "MismatchedPasswordError";
    this.errorCode = "U302";
    this.statusCode = 401;
    this.reason = reason;
    this.data = data;
  }
}

export class AccessDBError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "AccessDBError";
    this.errorCode = "DB001";
    this.statusCode = 500;
    this.reason = reason;
    this.data = data;
  }
}

export class MissRequiredFieldError extends Error {
  constructor(reason, data = null) {
    super(reason);
    this.name = "MissRequiredFieldError";
    this.errorCode = "F001";
    this.statusCode = 400;
    this.reason = reason;
    this.data = data;
  }
}

export class UnauthorizedError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = "UnauthorizedError";
    this.errorCode = "unauthorized";
    this.statusCode = 401;
    this.data = data;
  }
}
export class NotFoundError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.errorCode = "not_found";
    this.reason = message;
    this.data = data;
  }
}

// 추가 오류 클래스
export class BadRequestError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = "BadRequestError";
    this.errorCode = "bad_request";
    this.statusCode = 400;
    this.reason = message;
    this.data = data;
  }
}

export class ForbiddenError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = "ForbiddenError";
    this.errorCode = "forbidden";
    this.statusCode = 403;
    this.reason = message;
    this.data = data;
  }
}

export class AlreadyExistError extends Error {
  constructor(message, data = null) {
    super(message);
    this.name = "AlreadyExistError";
    this.errorCode = "already_exists";
    this.statusCode = 409;
    this.reason = message;
  }
}

export class DBError extends Error {
  errorCode = "DB001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
