import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { TaskStats } from "../../types/StatsInterface";
import styles from "./Statistic.module.css";

interface Props {
  stats?: TaskStats;
  isLoading: boolean;
}
function Statistic({ stats, isLoading }: Props) {
  if (isLoading) {
    return <Spin indicator={<LoadingOutlined spin />} size="large" />;
  }

  return (
    <div className={styles.statsSection}>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Total Tasks</div>
        <div className={styles.statValue}>{stats?.total || 0}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>In Progress</div>
        <div className={styles.statValue}>
          {stats?.byStatus.IN_PROGRESS || 0}
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Completed</div>
        <div className={styles.statValue}>{stats?.byStatus.COMPLETED || 0}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Pending</div>
        <div className={styles.statValue}>{stats?.byStatus.PENDING || 0}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Low Priority</div>
        <div className={styles.statValue}>{stats?.byPriority.LOW || 0}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>Medium Priority</div>
        <div className={styles.statValue}>{stats?.byPriority.MEDIUM || 0}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statTitle}>High Priority</div>
        <div className={styles.statValue}>{stats?.byPriority.HIGH || 0}</div>
      </div>
    </div>
  );
}

export default Statistic;
