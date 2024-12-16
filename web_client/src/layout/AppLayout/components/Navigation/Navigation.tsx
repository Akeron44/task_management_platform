import { Button, Badge } from "antd";
import {
  PlusOutlined,
  FilterOutlined,
  SortDescendingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";
import { useState } from "react";
import FilterModal from "../FilterModal/FilterModal";
import SortModal from "../SortModal/SortModal";
import { useTaskFilters } from "../../../../store/useTaskFilters";
import CreateTaskModal from "../../../../pages/Tasks/components/CreateTaskModal/CreateTaskModal";
import { useMenuNavigation } from "../../../../store/useMenuNavigation";

function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const location = useLocation();
  const { toggleMenu } = useMenuNavigation();
  const { filters, sortConfig } = useTaskFilters();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/tasks":
        return "Tasks";
      default:
        return "Dashboard";
    }
  };
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priority.length) count += filters.priority.length;
    if (filters.status.length) count += filters.status.length;
    if (filters.dueDate && filters.dueDate[0] && filters.dueDate[1]) count += 1;
    return count;
  };

  return (
    <div className={styles.navigation}>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      <Button
        className={styles.menuToggleButton}
        icon={<MenuOutlined />}
        onClick={toggleMenu}
      />
      <div className={styles.actions}>
        <Badge count={sortConfig.field === "none" ? 0 : 1} color="blue">
          <Button
            onClick={() => setIsSortModalOpen(true)}
            className={styles.filterButton}
          >
            <SortDescendingOutlined />
            Sort
          </Button>
        </Badge>
        {isSortModalOpen && (
          <SortModal
            isVisible={isSortModalOpen}
            onClose={() => setIsSortModalOpen(false)}
          />
        )}
        <Badge count={getActiveFiltersCount()} color="blue">
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            className={styles.filterButton}
          >
            <FilterOutlined />
            Filter
          </Button>
        </Badge>
        {isFilterModalOpen && (
          <FilterModal
            isVisible={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
          />
        )}

        <Button
          onClick={() => setIsModalOpen(true)}
          className={styles.addButton}
          type="primary"
        >
          <PlusOutlined />
          Add Task
        </Button>
      </div>
      {isModalOpen && (
        <CreateTaskModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Navigation;
