import { z } from "zod";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import error_messages from "../../../constants/error_messages";

dayjs.extend(utc);
dayjs.extend(timezone);

export const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: error_messages.MIN_CHARACTERS("title", 3) })
    .max(55, error_messages.MAX_CHARACTERS("title", 55)),
  description: z
    .string()
    .trim()
    .min(5, error_messages.MIN_CHARACTERS("Description", 5))
    .max(250, error_messages.MAX_CHARACTERS("Description", 250)),
  status: z.string().trim().min(1, error_messages.ENTITY_REQUIRED("status")),
  priority: z
    .string()
    .trim()
    .min(1, error_messages.ENTITY_REQUIRED("priority")),
  dueDate: z.string().min(1, error_messages.ENTITY_REQUIRED("Deadline")),
});
