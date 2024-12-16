import { useQuery } from "@tanstack/react-query";
import queryKeys from "../../../constants/queryKeys";
import taskService from "../services/taskService";
import { TaskStats } from "../types/StatsInterface";
import { QueryParams } from "./useTasks";

const useGetTasksStats = (query: QueryParams) => {
  return useQuery<TaskStats | undefined, Error>({
    queryKey: [queryKeys.TASKS_STATISTICS, query],
    queryFn: () =>
      taskService.getTasksStatistics({
        priority: query.priority,
        status: query.status,
        dueDateStart: query.dueDateStart,
        dueDateEnd: query.dueDateEnd,
        myTasks: query.myTasks,
      }),
    staleTime: 1000,
  });
};

export default useGetTasksStats;
