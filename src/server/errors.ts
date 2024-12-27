export class ServerError {
  message: string;

  constructor(message: string) {
    this.message = message ?? '';
  }

  static INTERNAL_ERROR = 'Internal Server Error';

  static INVALID_CREDENTIALS = 'Invalid credentials';

  static UNAUTHORIZED = 'Unauthorized';
}

export class PGError extends ServerError {
  code: string | undefined;

  constructor(code: string | undefined, message: string) {
    super(message);
    this.code = code;
  }

  static USER_EXISTS = '23505';
  static PASSWORD_TOO_SHORT = 'password_too_short';

  static USER_EXISTS_MESSAGE = 'User already exists';
  static PASSWORD_TOO_SHORT_MESSAGE = 'Password is too short';
}
