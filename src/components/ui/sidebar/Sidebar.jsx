import { NavLink } from "react-router-dom";
import "./Sidebar.style.css";
import { LayoutDashboard, SquareKanban } from "lucide-react";
import { useTaskContext } from "../../../context";

function Sidebar() {
  const { openCreateModal } = useTaskContext();

  return (
    <aside className="sidebar_container">
      <h1 className="sidebar_title">Kanban Board</h1>
      <div className="sidebar_menu">
        <button
          type="button"
          className="new_task_btn"
          onClick={openCreateModal}
        >
          + New Task
        </button>
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
