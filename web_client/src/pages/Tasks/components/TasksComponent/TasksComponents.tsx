import styles from "./TasksComponent.module.css";
import TaskCard from "../TaskCard/TaskCard";
import useTasks from "../../hooks/useTasks";
import EmptyComponent from "../../../../components/Empty/EmptyComponent";
import ErrorComponent from "../../../../components/Error/ErrorComponent";
import { LoadingOutlined } from "@ant-design/icons";
import { Pagination, Spin } from "antd";
import { useTaskFilters } from "../../../../store/useTaskFilters";
import { useEffect, useState } from "react";
import Statistic from "../Statistic/Statistic";
import useGetTasksStats from "../../hooks/useGetTasksStats";
import error_messages from "../../../../constants/error_messages";

interface Props {
  myTasks: boolean;
}

function TasksComponent({ myTasks }: Props) {
  const [page, setPage] = useState<number>(1);
  const { filters, sortConfig } = useTaskFilters();

  const query = {
    priority: filters.priority,
    status: filters.status,
    dueDateStart:
      filters.dueDate && filters.dueDate[0] ? filters.dueDate[0] : undefined,
    dueDateEnd:
      filters.dueDate && filters.dueDate[1] ? filters.dueDate[1] : undefined,
    sortBy: sortConfig.field,
    sort: sortConfig.order,
    myTasks: myTasks,
  };

  const {
    data: tasksData,
    error: tasksError,
    isLoading: isTasksLoading,
  } = useTasks(query, page);

  const {
    data: statsData,
    error: statsError,
    isLoading: isStatsLoading,
  } = useGetTasksStats(query);

  useEffect(() => {
    setPage(1);
  }, [filters, sortConfig, setPage]);

  if (isTasksLoading) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />;
  }

  const error = tasksError || statsError;
  const errorMessage =
    tasksError?.message ||
    statsError?.message ||
    error_messages.UNKOWN_ERROR_OCCURED;

  return (
    <div>
      {error && <ErrorComponent message={errorMessage} />}
      <Statistic isLoading={isStatsLoading} stats={statsData} />

      <div className={styles.taskList}>
        {tasksData?.tasks && tasksData?.tasks.length > 0 ? (
          tasksData?.tasks?.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              id={task.id}
              dueDate={task.dueDate}
              createdAt={task.createdAt}
              myTask={myTasks}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <EmptyComponent message="No tasks found" />
          </div>
        )}
      </div>
      <Pagination
        current={page}
        total={tasksData?.total}
        pageSize={10}
        onChange={setPage}
      />
    </div>
  );
}

export default TasksComponent;
