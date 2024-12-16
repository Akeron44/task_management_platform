import { Modal, Select, DatePicker, Button } from "antd";
import styles from "./FilterModal.module.css";
import { useTaskFilters } from "../../../../store/useTaskFilters";
import dayjs from "dayjs";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface FilterValues {
  priority: string[];
  status: string[];
  dueDate: [string, string] | null;
}

const { RangePicker } = DatePicker;

const FilterModal: React.FC<FilterModalProps> = ({ isVisible, onClose }) => {
  const { filters, setFilters } = useTaskFilters();

  const handleApply = () => {
    setFilters(filters);
    onClose();
  };

  return (
    <Modal
      title="Filter Tasks"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply Filters
        </Button>,
      ]}
    >
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label>Priority</label>
          <Select
            value={filters.priority}
            mode="multiple"
            placeholder="Select priorities"
            onChange={(values) => setFilters({ ...filters, priority: values })}
            className={styles.filterSelect}
          >
            <Select.Option value="HIGH">High</Select.Option>
            <Select.Option value="MEDIUM">Medium</Select.Option>
            <Select.Option value="LOW">Low</Select.Option>
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>
          <Select
            value={filters.status}
            mode="multiple"
            placeholder="Select statuses"
            onChange={(values) => setFilters({ ...filters, status: values })}
            className={styles.filterSelect}
          >
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
            <Select.Option value="COMPLETED">Completed</Select.Option>
            <Select.Option value="CANCELLED">Cancelled</Select.Option>
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <label>Deadline Range</label>
          <RangePicker
            value={
              filters.dueDate
                ? [
                    filters.dueDate[0] ? dayjs(filters.dueDate[0]) : null,
                    filters.dueDate[1] ? dayjs(filters.dueDate[1]) : null,
                  ]
                : null
            }
            className={styles.filterDate}
            onChange={(dates, dateStrings) =>
              setFilters({
                ...filters,
                dueDate: dateStrings as [string, string],
              })
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
