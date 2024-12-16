import { useQuery } from "@tanstack/react-query";
import { Task } from "../types/TaskInterfaces";
import queryKeys from "../../../constants/queryKeys";
import taskService from "../services/taskService";

const useTask = (id: string | undefined) => {
  return useQuery<Task | undefined, Error>({
    queryKey: [queryKeys.TASK_DETAIL, id],
    queryFn: () => taskService.getTask(id),
    staleTime: 60 * 1000,
  });
};

export default useTask;
