import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChartPie,
  ChartNoAxesColumn,
  Plus,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";
import { useTaskContext } from "../../../context";
import {
  DashboardStats,
  StatusDoughnutChart,
  CategoryBarChart,
  CompletionPerformanceSection,
} from "./components";
import "./Dashboard.style.css";

function Dashboard() {
  const navigate = useNavigate();
  const { analytics, openCreateModal } = useTaskContext();
  const [is30Days, setIs30Days] = useState(false);

  return (
    <section className="dashboard">
      <header className="dashboard_header">
        <div className="dashboard_header_main">
          <div>
            <h2 className="dashboard_title">Dashboard Overview</h2>
            <p className="dashboard_subtitle">
              Real-time metrics, Kanban board status, and task performance.
            </p>
          </div>
          <div className="dashboard_actions">
            <button
              type="button"
              className="dashboard_add_btn"
              onClick={openCreateModal}
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>
            <Link to="/board" className="dashboard_view_board_btn">
              <span>Go to Board</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Overdue alert banner if any tasks are overdue */}
        {analytics.overdueCount > 0 && (
          <div
            className="overdue_alert_banner"
            onClick={() => navigate("/board")}
          >
            <div className="overdue_alert_left">
              <TriangleAlert size={18} className="overdue_alert_icon" />
              <span>
                <strong>
                  {analytics.overdueCount} task
                  {analytics.overdueCount !== 1 ? "s" : ""}
                </strong>{" "}
                overdue and requires immediate attention.
              </span>
            </div>
            <span className="overdue_alert_link">
              View on Board <ArrowRight size={14} />
            </span>
          </div>
        )}
      </header>

      <main className="dashboard_main">
        {/* Top Summary Stats */}
        <DashboardStats analytics={analytics} />

        {/* Charts Grid: Task Status & Tasks by Category */}
        <div className="panels_grid">
          {/* Status Doughnut */}
          <section className="panel panel-status">
            <div className="panel_header">
              <div className="panel_icon" aria-hidden>
                <ChartPie />
              </div>
              <span className="panel_title">Task Status Breakdown</span>
            </div>
            <div className="panel_body">
              <StatusDoughnutChart
                todo={analytics.todo}
                doing={analytics.doing}
                done={analytics.done}
                total={analytics.total}
              />
            </div>
          </section>

          {/* Tasks by Category */}
          <section className="panel panel-category">
            <div className="panel_header">
              <div className="panel_icon" aria-hidden>
                <ChartNoAxesColumn />
              </div>
              <span className="panel_title">Tasks by Category</span>
            </div>
            <div className="panel_body">
              <CategoryBarChart
                data={analytics.categoryDistribution}
                total={analytics.total}
              />
            </div>
          </section>
        </div>

        {/* Completion Performance Panel */}
        <CompletionPerformanceSection
          analytics={analytics}
          is30Days={is30Days}
          onToggleRange={(val) => setIs30Days(val)}
        />
      </main>
    </section>
  );
}

export default Dashboard;
