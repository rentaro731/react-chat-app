import { NavLink, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "./css/chat.module.css";

export const ChatLayout = () => {
  const location = useLocation();
  const naviLinks = [
    {
      to: "/chat/talklist",
      icon: "💬",
      isActive: location.pathname.includes("talklist"),
    },
    {
      to: "/chat/friend",
      icon: "👥",
      isActive: location.pathname.includes("friend"),
    },
    {
      to: "/chat/setting",
      icon: "⚙️",
      isActive: location.pathname.includes("setting"),
    },
  ];
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        {naviLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`${styles.navItem} ${
              link.isActive ? styles.navItemActive : ""
            }`}
          >
            {link.icon}
          </NavLink>
        ))}
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
