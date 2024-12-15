import { Empty, Typography, Button } from "antd";
import { useState } from "react";
import TaskModal from "../../pages/Tasks/components/TaskModal/TaskModal";

interface Props {
  message: string;
  myEvents?: boolean;
}

function EmptyComponent({ message, myEvents }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={<Typography.Text>{message}</Typography.Text>}
    >
      {myEvents && (
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          Create Event
        </Button>
      )}

      {isModalOpen && (
        <TaskModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </Empty>
  );
}

export default EmptyComponent;
