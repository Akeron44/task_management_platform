import axios from "axios";
import error_messages from "../constants/error_messages";

function getErrorMessage(message: string | string[], statusCode: number) {
  if (typeof message === "string") {
    if (message.toLowerCase().includes("invalid credentials")) {
      return error_messages.INVALID_CREDENTIALS;
    }

    if (message.toLowerCase().includes("unauthorized")) {
      return error_messages.OOPS_SOMETHING_WENT_WRONG;
    }
  } else if (message.length !== 0) {
    return message[0];
  }

  return error_messages.ACTION_FAILED(statusCode);
}

export function processAxiosError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.message || error_messages.UNKOWN_ERROR_OCCURED;
    const statusCode = error.response?.status || 500;

    throw new Error(
      getErrorMessage(errorMessage, statusCode) ||
        error_messages.UNKOWN_ERROR_OCCURED
    );
  } else {
    throw new Error(error_messages.UNKOWN_ERROR_OCCURED);
  }
}
