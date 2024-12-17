const error_messages = {
  TASK_NOT_CREATED:
    "Your task could not be created. An unknown error occurred.",

  TASK_NOT_DELETED:
    "Your task could not be deleted. An unknown error occurred.",

  TASK_ID_MISSING: "task id is missing.",

  NO_TASKS: "No new tasks.",

  WRONG_DATE: "You can not create an task in the past",

  AUTHENTICATION_FAILED: "Authentication failed.",

  UNKOWN_ERROR_OCCURED: "Something went wrong. An unknown error occurred.",

  UNAUTHORIZED: "You are not authorized to perform this action.",

  PASSWORD_LOWERCASE: "Password must have at least one lowercase letter",
  PASSWORD_UPPERCASE: "Password must have at least one uppercase letter",
  PASSWORD_NUMBER: "Password must have at least one number",
  PASSWORD_SYMBOL: "Password must have at least one symbol",

  HAS_TO_BE: (entity: string) =>
    `This field has to be an ${entity.toLowerCase()}`,

  MIN_CHARACTERS: (entity: string, characters: number) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } needs to be at least ${characters} characters long.`,

  MAX_CHARACTERS: (entity: string, characters: number) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } can't to be more than ${characters} characters long.`,

  ENTITY_REQUIRED: (entity: string) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } is required.`,

  ENTITY_MIN_LENGTH: (entity: string, min: number) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } should be at minimum length of ${min}.`,

  ENTITY_MAX_LENGTH: (entity: string, max: number) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } can't exceed ${max} characters.`,

  ENTITY_MIN: (entity: string, min: number) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } can't be lower than ${min}.`,

  ENTITY_MAX: (entity: string, max: number) =>
    `${
      entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    } can't be more than ${max}.`,

  ACTION_FAILED: (status: number) =>
    `Something went wrong. We're unable to process your request at the moment. (Status: ${status}) Please try again later.`,
};

export default error_messages;
