import { Modal, Spin } from "antd";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import styles from "./TaskModal.module.css";
import { CreateTask, TaskModalProps } from "../../types/TaskInterfaces";
import { schema } from "../../helpers/validateForm";
import useCreateTask from "../../hooks/useCreateTask";
import useEditTask from "../../hooks/useEditTask";
import defaultValues from "../../constants/defaultValues";
import FormFooter from "./components/FormFooter/FormFooter";
import TitleInput from "./components/TitleInput/TitleInput";
import DescriptionInput from "./components/DescriptionInput/DescriptionInput";
import PrioritySelect from "./components/PrioritySelect/PrioritySelect";
import StatusSelect from "./components/StatusSelect/StatusSelect";
import DateInput from "./components/DateInput/DateInput";

function TaskModal({
  taskData,
  isEventLoading,
  taskId,
  closeModal,
  isModalOpen,
}: TaskModalProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateTask>({ resolver: zodResolver(schema) });

  const { mutate: createMutate, isPending: isCreateLoading } =
    useCreateTask(closeModal);

  const { mutate: editMutate, isPending: isEditLoading } =
    useEditTask(closeModal);

  useEffect(() => {
    if (taskData && taskId) {
      reset({
        ...defaultValues,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
      });
    }
  }, [reset, taskData, taskId]);

  const handleFormSubmit = async (form: FieldValues) => {
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
    };

    if (taskId) {
      editMutate({ taskId: taskId.toString(), task: form });
    } else {
      createMutate(payload);
    }
  };

  const isLoading = isEditLoading || isCreateLoading || isEventLoading;

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      onCancel={closeModal}
      className={styles.modalContent}
      closeIcon={<CloseOutlined className={styles.closeButton} />}
      width={500}
      centered
      destroyOnClose
      maskClosable={false}
      title={
        <div className={styles.header}>
          <h3 className={styles.title}>
            {!taskId ? "Create New Task" : "Edit Task"}
          </h3>
        </div>
      }
    >
      {isLoading && <Spin indicator={<LoadingOutlined spin />} size="small" />}

      <form
        name="task-form"
        className={styles.form}
        onSubmit={handleSubmit(handleFormSubmit)}
        autoComplete="off"
      >
        <TitleInput control={control} errors={errors} />
        <DescriptionInput control={control} errors={errors} />
        <PrioritySelect control={control} errors={errors} />
        <StatusSelect control={control} errors={errors} />
        <DateInput control={control} errors={errors} />

        <FormFooter taskId={taskId} closeModal={() => closeModal()} />
      </form>
    </Modal>
  );
}

export default TaskModal;
