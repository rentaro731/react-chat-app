import { NavLink, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "./.css/chat.module.css";

export const ChatLayout = () => {
  const location = useLocation();
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <NavLink
          to="talklist"
          className={`${styles.navItem} ${
            location.pathname.includes("talklist") ? styles.navItemActive : ""
          }`}
        >
          💬
        </NavLink>
        <NavLink
          to="friend"
          className={`${styles.navItem} ${
            location.pathname.includes("friend") ? styles.navItemActive : ""
          }`}
        >
          👥
        </NavLink>
        <NavLink
          to="setting"
          className={`${styles.navItem} ${
            location.pathname.includes("setting") ? styles.navItemActive : ""
          }`}
        >
          ⚙️
        </NavLink>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
