import { z } from "zod";
import error_messages from "../../../constants/error_messages";

export const schema = z.object({
  email: z
    .string()
    .min(5, error_messages.MIN_CHARACTERS("email", 5))
    .email(error_messages.HAS_TO_BE("email")),
  password: z.string().min(8, error_messages.MIN_CHARACTERS("password", 8)),
});
