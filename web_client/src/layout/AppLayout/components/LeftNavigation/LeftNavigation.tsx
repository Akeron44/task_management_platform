import {
  HomeOutlined,
  CheckSquareOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LeftNavigation.module.css";
import routes from "../../../../constants/routes";
import { clearLocalStorage } from "../../../../helpers/localStorageHelper";
import { useMenuNavigation } from "../../../../store/useMenuNavigation";
import { Button } from "antd";

function LeftNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMenuCollapsed, toggleMenu } = useMenuNavigation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "/tasks", icon: <CheckSquareOutlined />, label: "My Tasks" },
  ];

  const handleLogout = () => {
    clearLocalStorage();
    navigate(routes.LOG_IN);
  };

  return (
    <nav className={`${styles.leftNav} ${!isMenuCollapsed ? styles.open : ""}`}>
      <div className={styles.logo}>
        <span className={styles.logoText}>TaskMaster</span>
        <Button
          className={styles.menuToggleButton}
          icon={<MenuUnfoldOutlined />}
          onClick={toggleMenu}
        />
      </div>

      <div className={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`${styles.menuItem} ${
              location.pathname === item.key ? styles.active : ""
            }`}
            onClick={() => {
              navigate(item.key);
              toggleMenu();
            }}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            <span className={styles.menuText}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.userSection}>
        <div className={styles.userAvatar}>
          <UserOutlined />
        </div>
        <span className={styles.userName}>{user.name || "John Doe"}</span>
        <div className={styles.menuItem} onClick={handleLogout}>
          <LogoutOutlined className={styles.menuIcon} />
          <span className={styles.menuText}>Logout</span>
        </div>
      </div>
    </nav>
  );
}

export default LeftNavigation;
