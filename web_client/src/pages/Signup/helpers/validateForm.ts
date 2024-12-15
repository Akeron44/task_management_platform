import { z } from "zod";
import error_messages from "../../../constants/error_messages";

export const schema = z.object({
  name: z
    .string()
    .min(3, error_messages.ENTITY_MIN_LENGTH("Name", 3))
    .max(50, error_messages.ENTITY_MAX_LENGTH("Name", 50)),
  age: z
    .number({ message: error_messages.ENTITY_REQUIRED("Age") })
    .min(1, error_messages.ENTITY_MIN("Age", 1))
    .max(100, error_messages.ENTITY_MAX("Age", 50)),
  email: z.string().min(5, error_messages.ENTITY_REQUIRED("Email")).email(),
  password: z
    .string()
    .min(8, error_messages.MIN_CHARACTERS("password", 8))
    .regex(/[a-z]/, error_messages.PASSWORD_LOWERCASE)
    .regex(/[A-Z]/, error_messages.PASSWORD_UPPERCASE)
    .regex(/\d/, error_messages.PASSWORD_NUMBER)
    .regex(/[!@#$%^&*(),.?":{}|<>]/, error_messages.PASSWORD_SYMBOL),
});
