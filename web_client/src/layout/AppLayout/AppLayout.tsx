import { Navigate, Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";
import LeftNavigation from "./components/LeftNavigation/LeftNavigation";
import Navigation from "./components/Navigation/Navigation";

function AppLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.appLayout}>
      <LeftNavigation />
      <main className={styles.mainContent}>
        <Navigation />
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
