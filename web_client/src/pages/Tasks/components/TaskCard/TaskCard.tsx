import { CalendarOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import styles from "./TaskCard.module.css";
import { Task } from "../../types/TaskInterfaces";
import { useState } from "react";
import useDeleteTask from "../../hooks/useDeleteTask";
import error_messages from "../../../../constants/error_messages";
import { formatStatus } from "../../helpers/formatStatus";
import EditTaskModal from "../EditTaskModal/EditTaskModal";
import ButtonActions from "./components/ButtonActions/ButtonActions";

function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  createdAt,
  myTask,
}: Task) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { mutate: mutateDelete, isPending: isLoading } = useDeleteTask();

  function handleDeleteEvent(taskId: string) {
    Modal.confirm({
      title: "Are you sure?",
      content: error_messages.ARE_YOU_SURE_DELETE,
      onOk: () => mutateDelete(taskId),
    });
  }

  return (
    <div className={styles.taskCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span
          className={`${styles.priority.toLocaleLowerCase()} ${
            priority && styles[priority.toLocaleLowerCase()]
          }`}
        >
          {priority}
        </span>
      </div>

      <div className={styles.status}>
        <span
          className={`${styles.statusDot} ${
            status && styles[status.toLocaleLowerCase()]
          }`}
        />
        <span className={styles.statusText}>
          {status && formatStatus(status)}
        </span>
      </div>

      <p className={styles.description}>{description}</p>

      <div className={styles.footer}>
        <div>
          <div className={styles.dueDate}>
            <CalendarOutlined className={styles.dateIcon} />
            Created: {createdAt && formatDate(createdAt.toString())}
          </div>
          <div className={styles.dueDate}>
            <CalendarOutlined className={styles.dateIcon} />
            Deadline: {dueDate && formatDate(dueDate.toString())}
          </div>
        </div>
        {myTask && (
          <ButtonActions
            openModal={() => setIsModalOpen(true)}
            deleteEvent={() => handleDeleteEvent(id)}
            isLoading={isLoading}
          />
        )}
      </div>
      {isModalOpen && (
        <EditTaskModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          taskId={id}
        />
      )}
    </div>
  );
}

export default TaskCard;
