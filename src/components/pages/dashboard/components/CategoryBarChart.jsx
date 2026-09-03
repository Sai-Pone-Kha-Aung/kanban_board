import { ChartNoAxesColumn } from "lucide-react";

export default function CategoryBarChart({ data, total }) {
  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="chart_empty_state">
        <ChartNoAxesColumn size={32} className="chart_empty_icon" />
        <p>No tasks by category</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const palette = [
    "#6366f1",
    "#3b82f6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
  ];

  return (
    <div className="category_bars_list">
      {data.map((item, index) => {
        const color = palette[index % palette.length];
        const barWidth = `${Math.max(Math.round((item.count / maxCount) * 100), 6)}%`;

        return (
          <div key={item.category} className="category_bar_row">
            <div className="category_bar_header">
              <span className="category_name">{item.category}</span>
              <div className="category_numbers">
                <span className="category_count">
                  {item.count} task{item.count !== 1 ? "s" : ""}
                </span>
                <span className="category_pct">({item.percentage}%)</span>
              </div>
            </div>
            <div className="category_track">
              <div
                className="category_fill"
                style={{
                  width: item.count > 0 ? barWidth : "0%",
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
