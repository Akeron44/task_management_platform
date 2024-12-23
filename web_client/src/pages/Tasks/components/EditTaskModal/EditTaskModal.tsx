import useTask from "../../hooks/useTask";
import { TaskModalProps } from "../../types/TaskInterfaces";
import TaskModal from "../TaskModal/TaskModal";

function EditTaskModal({ isModalOpen, closeModal, taskId }: TaskModalProps) {
  const { data: taskData, isLoading: isTaskLoading } = useTask(taskId);

  return (
    <TaskModal
      taskData={taskData}
      taskId={taskData?.id}
      isTaskLoading={isTaskLoading}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
    />
  );
}

export default EditTaskModal;
