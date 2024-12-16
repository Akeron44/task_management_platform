export const error_messages = {
  INVALID_EMAIL: 'Invalid email address.',

  INVALID_CREDENTAILS: 'Invalid credentials.',

  EMAIL_IN_USE: 'This email is already in use.',

  UNAUTHORIZED: 'You are unauthorized to perform this action.',

  INVALID_PROPERTY: `Please set a valid property.`,

  RECORD_NOT_FOUND: (record: string) =>
    `${record.toUpperCase()} record was not found.`,

  ID_REQUIRED: (entity: string) => `${entity.toUpperCase()} is required.`,

  MIN_NUMBER: (entity: string, min: number) =>
    `${entity.toUpperCase()} can't be lower than ${min}`,

  MAX_NUMBER: (entity: string, max: number) =>
    `${entity.toUpperCase()} can't be gretaer than ${max}`,

  MIN_CHARACTERS: (entity: string, maxCharacters: number) =>
    `${entity.toUpperCase()} must be at least ${maxCharacters} characters`,

  MAX_CHARACTERS: (entity: string, maxCharacters: number) =>
    `${entity.toUpperCase()} must be at most ${maxCharacters} characters`,

  INVALID_ENTITY: (entity: string) =>
    `Invalid ${entity} or ${entity} not found.`,

  TASK_NOT_FOUND: (id: string) => `Task with ID ${id} not found.`,

  TASK_ALREADY_DELETED: (id: string) =>
    `Task with ID ${id} is already deleted.`,

  PASSWORD_COMPLEXITY:
    'Password must contain at least onelowercase letterm one uppercase letter, one number, and one special character.',

  PRISMA: {
    DATABASE_ERROR:
      'A database error occurred. Please check your database connection or schema.',

    NOT_FOUND: 'The requested record was not found.',

    CONSTRAINT_VIOLATION: 'A unique constraint violation occurred.',

    RECORD_NOT_UPDATE_OR_DELETE:
      'The record you are trying to update or delete was not found.',

    FOREIGN_KEY_VIOLATION: 'A foreign key constraint violation occurred.',

    INVALID_FIELD:
      'An invalid field error occurred. Please check the data being sent to the database.',

    UNKNOWN_DATABASE_ERROR: 'An unknown database error occurred.',
  },
};
