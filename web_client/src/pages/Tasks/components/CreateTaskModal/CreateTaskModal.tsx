import { TaskModalProps } from "../../types/TaskInterfaces";
import TaskModal from "../TaskModal/TaskModal";

function CreateTaskModal({ isModalOpen, closeModal }: TaskModalProps) {
  return <TaskModal isModalOpen={isModalOpen} closeModal={closeModal} />;
}

export default CreateTaskModal;
