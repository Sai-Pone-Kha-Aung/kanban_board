import {
  ClipboardList,
  Circle,
  Clock3,
  CircleCheck,
  TriangleAlert,
  ChartPie,
  ChartNoAxesColumn,
  ChartLine,
} from "lucide-react";
import "./Dashboard.style.css";

function Dashboard() {
  return (
    <section className="dashboard">
      <header className="dashboard_header">
        <div>
          <h2 className="dashboard_title">Dashboard Overview</h2>
          <p className="dashboard_subtitle">
            Real-time metrics and task performance.
          </p>
        </div>
      </header>

      <main className="dashboard_main">
        <div className="stats_row">
          <div className="stat_card card-total">
            <div className="stat_top">
              <span className="stat_label">TOTAL TASKS</span>
              <div className="stat_icon" aria-hidden>
                <ClipboardList />
              </div>
            </div>
            <div className="stat_value">0</div>
          </div>

          <div className="stat_card card-todo">
            <div className="stat_top">
              <span className="stat_label">TO DO</span>
              <div className="stat_icon" aria-hidden>
                <Circle />
              </div>
            </div>
            <div className="stat_value">0</div>
          </div>

          <div className="stat_card card-doing">
            <div className="stat_top">
              <span className="stat_label">DOING</span>
              <div className="stat_icon" aria-hidden>
                <Clock3 />
              </div>
            </div>
            <div className="stat_value">0</div>
          </div>

          <div className="stat_card card-done">
            <div className="stat_top">
              <span className="stat_label">DONE</span>
              <div className="stat_icon" aria-hidden>
                <CircleCheck />
              </div>
            </div>
            <div className="stat_value">0</div>
          </div>

          <div className="stat_card card-overdue">
            <div className="stat_top">
              <span className="stat_label">OVERDUE</span>
              <div className="stat_icon" aria-hidden>
                <TriangleAlert />
              </div>
            </div>
            <div className="stat_value">0</div>
          </div>
        </div>

        <div className="panels_grid">
          <section className="panel panel-status">
            <div className="panel_header">
              <div className="panel_icon" aria-hidden>
                <ChartPie />
              </div>
              <span className="panel_title">Task Status</span>
            </div>
            <div className="panel_body" />
          </section>

          <section className="panel panel-category">
            <div className="panel_header">
              <div className="panel_icon" aria-hidden>
                <ChartNoAxesColumn />
              </div>
              <span className="panel_title">Tasks by Category</span>
            </div>
            <div className="panel_body" />
          </section>
        </div>

        <section className="panel panel-performance">
          <div className="panel_header panel_header--space">
            <div className="panel_header_left">
              <div className="panel_icon" aria-hidden>
                <ChartLine />
              </div>
              <span className="panel_title">Completion Performance</span>
            </div>
            <button className="small_btn">Last 30 Days</button>
          </div>
          <div className="panel_body panel_body--large" />
        </section>
      </main>
    </section>
  );
}

export default Dashboard;
