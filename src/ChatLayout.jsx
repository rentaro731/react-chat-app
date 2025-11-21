import { NavLink, Outlet } from "react-router-dom";
import s from "./.css/chat.module.css";

export const ChatLayout = () => {
  const sidebarClass = ({ isActive }) =>
    [s.navItem, isActive && s.navItemActive].filter(Boolean).join(" ");
  return (
    <div className={s.wrapper}>
      <aside className={s.sidebar}>
        <NavLink to="talklist" className={sidebarClass}>
          💬
        </NavLink>
        <NavLink to="friend" className={sidebarClass}>
          👥
        </NavLink>
        <NavLink to="setting" className={sidebarClass}>
          ⚙️
        </NavLink>
      </aside>
      <main className={s.main}>
        <Outlet />
      </main>
    </div>
  );
};
