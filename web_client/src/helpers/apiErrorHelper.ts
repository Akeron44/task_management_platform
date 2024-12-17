import axios from "axios";
import error_messages from "../constants/error_messages";

function getErrorMessage(message: string, statusCode: number) {
  if (message.toLowerCase().includes("invalid credentials")) {
    return "Your email or password is incorrect. Please put the right credentials.";
  }

  if (message.toLowerCase().includes("unauthorized")) {
    return "Oops, something went wrong. You may be unauthorized to perform this action. Please try again later.";
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
