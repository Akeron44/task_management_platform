import { useMutation, useQueryClient } from "@tanstack/react-query";
import eventsService from "../services/taskService";
import { CreateTask, Task } from "../types/TaskInterfaces";
import { useNavigate } from "react-router-dom";
import routes from "../../../constants/routes";
import queryKeys from "../../../constants/queryKeys";
import error_messages from "../../../constants/error_messages";
import { openNotification } from "../../../helpers/handleNotification";
import { messages } from "../../../constants/messages";

const useCreateTask = (closeModal: () => void) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<Task, Error, CreateTask>({
    mutationFn: async (eventData: CreateTask) => {
      const event = await eventsService.createTask(eventData);

      if (!event) {
        throw new Error(error_messages.TASK_NOT_CREATED);
      }

      return event;
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        title: "Task created",
        message: messages.TASK_CREATED_SUCCESS,
      });
      closeModal();
      navigate(`${routes.ROOT}${routes.TASKS}`);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.TASKS],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.TASKS_STATISTICS],
      });
    },
    onError: (error) => {
      openNotification({
        type: "error",
        title: "Error",
        message: error.message,
      });
    },
  });
};

export default useCreateTask;
