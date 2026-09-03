import { useState } from "react";
import { ChartPie } from "lucide-react";

export default function StatusDoughnutChart({ todo, doing, done, total }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (total === 0) {
    return (
      <div className="chart_empty_state">
        <ChartPie size={32} className="chart_empty_icon" />
        <p>No tasks created yet</p>
      </div>
    );
  }

  const radius = 58;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const slices = [
    { label: "TO DO", count: todo, color: "#3b82f6", bg: "#eff6ff" },
    { label: "DOING", count: doing, color: "#f59e0b", bg: "#fffbeb" },
    { label: "DONE", count: done, color: "#10b981", bg: "#ecfdf5" },
  ].filter((s) => s.count > 0);

  let accumulatedOffset = 0;

  return (
    <div className="doughnut_wrapper">
      <div className="doughnut_svg_container">
        <svg
          viewBox="0 0 160 160"
          className="doughnut_svg"
          aria-label="Task Status Breakdown"
        >
          {/* Base background ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {slices.map((slice, index) => {
            const ratio = slice.count / total;
            const strokeDash = ratio * circumference;
            const gap = circumference - strokeDash;
            const currentOffset = accumulatedOffset;
            accumulatedOffset += strokeDash;

            const isHovered = hoveredIndex === index;

            return (
              <circle
                key={slice.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${strokeDash} ${gap}`}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                className="doughnut_segment"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
          {/* Center text */}
          <text
            x="80"
            y="74"
            textAnchor="middle"
            className="doughnut_center_value"
          >
            {total}
          </text>
          <text
            x="80"
            y="94"
            textAnchor="middle"
            className="doughnut_center_label"
          >
            Tasks
          </text>
        </svg>
      </div>

      <div className="doughnut_legend">
        {[
          { label: "TO DO", count: todo, color: "#3b82f6" },
          { label: "DOING", count: doing, color: "#f59e0b" },
          { label: "DONE", count: done, color: "#10b981" },
        ].map((item, i) => {
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div
              key={item.label}
              className={`legend_item ${hoveredIndex === i ? "is_hovered" : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="legend_left">
                <span
                  className="legend_dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend_title">{item.label}</span>
              </div>
              <div className="legend_right">
                <span className="legend_count">{item.count}</span>
                <span className="legend_percent">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
