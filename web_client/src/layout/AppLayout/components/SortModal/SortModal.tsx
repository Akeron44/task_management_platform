import React from "react";
import { Modal, Radio, Button, Space } from "antd";
import styles from "./SortModal.module.css";
import { useTaskFilters } from "../../../../store/useTaskFilters";

interface SortModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface SortValues {
  field: "priority" | "status" | "dueDate" | "none";
  order: "asc" | "desc";
}

const SortModal: React.FC<SortModalProps> = ({ isVisible, onClose }) => {
  const { sortConfig, setSortConfig } = useTaskFilters();

  const handleApply = () => {
    setSortConfig(sortConfig);
    onClose();
  };

  return (
    <Modal
      title="Sort Tasks"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply Sort
        </Button>,
      ]}
    >
      <div className={styles.sortContainer}>
        <div className={styles.sortGroup}>
          <label>Sort By</label>
          <Radio.Group
            value={sortConfig.field}
            onChange={(e) =>
              setSortConfig({ ...sortConfig, field: e.target.value })
            }
          >
            <Space direction="vertical">
              <Radio value="priority">Priority</Radio>
              <Radio value="status">Status</Radio>
              <Radio value="dueDate">Deadline</Radio>
              <Radio value="none">None</Radio>
            </Space>
          </Radio.Group>
        </div>

        <div className={styles.sortGroup}>
          <label>Order</label>
          <Radio.Group
            value={sortConfig.order}
            onChange={(e) =>
              setSortConfig({ ...sortConfig, order: e.target.value })
            }
          >
            <Space>
              <Radio value="asc">Ascending</Radio>
              <Radio value="desc">Descending</Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};

export default SortModal;
