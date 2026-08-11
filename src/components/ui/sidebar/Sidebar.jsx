import { NavLink } from "react-router-dom";
import "./Sidebar.style.css";
import { LayoutDashboard, SquareKanban } from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar_container">
      <h1 className="sidebar_title">Kanban Board</h1>
      <div className="sidebar_menu">
        <button className="new_task_btn">+ New Task</button>
        <ul className="sidebar_menu_ul">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `sidebar_menu_link ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/board"
              className={({ isActive }) =>
                `sidebar_menu_link ${isActive ? "active" : ""}`
              }
            >
              <SquareKanban size={20} />
              <span>Board</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
