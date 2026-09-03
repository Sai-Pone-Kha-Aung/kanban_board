import { ChartLine, TrendingUp, Award } from "lucide-react";

export default function CompletionPerformanceSection({
  analytics,
  is30Days,
  onToggleRange,
}) {
  const perf = is30Days
    ? analytics.completionPerformance30Days
    : analytics.completionPerformanceAll;

  const total = perf.totalCompleted;
  const onTimeEfficiency =
    total > 0 ? Math.round(((perf.early + perf.onTime) / total) * 100) : 0;

  return (
    <section className="panel panel-performance">
      <div className="panel_header panel_header--space">
        <div className="panel_header_left">
          <div className="panel_icon" aria-hidden>
            <ChartLine />
          </div>
          <div>
            <span className="panel_title">Completion Performance</span>
            <span className="panel_subtitle">
              Early vs On Time vs Late task delivery analysis
            </span>
          </div>
        </div>
        <div className="perf_controls">
          <button
            type="button"
            className={`small_btn ${!is30Days ? "small_btn_active" : ""}`}
            onClick={() => onToggleRange(false)}
          >
            All Time
          </button>
          <button
            type="button"
            className={`small_btn ${is30Days ? "small_btn_active" : ""}`}
            onClick={() => onToggleRange(true)}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="panel_body panel_body--large">
        {total === 0 ? (
          <div className="chart_empty_state">
            <Award size={36} className="chart_empty_icon" />
            <p>No completed tasks recorded for this period.</p>
            <span className="chart_empty_hint">
              Move tasks to DONE on the Kanban Board to track completion metrics.
            </span>
          </div>
        ) : (
          <div className="performance_content">
            {/* Efficiency Highlights Row */}
            <div className="perf_cards_grid">
              <div className="perf_metric_card card_early">
                <div className="perf_metric_header">
                  <span className="perf_metric_label">EARLY COMPLETIONS</span>
                  <span className="perf_badge badge_early">Ahead</span>
                </div>
                <div className="perf_metric_value">{perf.early}</div>
                <div className="perf_metric_footer">
                  <span>{perf.earlyPercent}% of completed tasks</span>
                </div>
              </div>

              <div className="perf_metric_card card_ontime">
                <div className="perf_metric_header">
                  <span className="perf_metric_label">ON TIME</span>
                  <span className="perf_badge badge_ontime">Target</span>
                </div>
                <div className="perf_metric_value">{perf.onTime}</div>
                <div className="perf_metric_footer">
                  <span>{perf.onTimePercent}% of completed tasks</span>
                </div>
              </div>

              <div className="perf_metric_card card_late">
                <div className="perf_metric_header">
                  <span className="perf_metric_label">LATE COMPLETIONS</span>
                  <span className="perf_badge badge_late">Delayed</span>
                </div>
                <div className="perf_metric_value">{perf.late}</div>
                <div className="perf_metric_footer">
                  <span>{perf.latePercent}% of completed tasks</span>
                </div>
              </div>

              <div className="perf_metric_card card_efficiency">
                <div className="perf_metric_header">
                  <span className="perf_metric_label">ON-TIME DELIVERY RATE</span>
                  <TrendingUp size={16} className="efficiency_icon" />
                </div>
                <div className="perf_metric_value">{onTimeEfficiency}%</div>
                <div className="perf_metric_footer">
                  <span>
                    {perf.early + perf.onTime} / {total} tasks on or before due date
                  </span>
                </div>
              </div>
            </div>

            {/* Segmented Comparison Bar */}
            <div className="perf_bar_container">
              <div className="perf_bar_title_row">
                <span className="perf_bar_label">Distribution Comparison</span>
                <span className="perf_bar_total">
                  Total Completed: <strong>{total}</strong>
                </span>
              </div>
              <div className="perf_segmented_track">
                {perf.early > 0 && (
                  <div
                    className="perf_segment segment_early"
                    style={{ width: `${perf.earlyPercent}%` }}
                    title={`Early: ${perf.early} (${perf.earlyPercent}%)`}
                  >
                    {perf.earlyPercent >= 12 && `${perf.earlyPercent}%`}
                  </div>
                )}
                {perf.onTime > 0 && (
                  <div
                    className="perf_segment segment_ontime"
                    style={{ width: `${perf.onTimePercent}%` }}
                    title={`On Time: ${perf.onTime} (${perf.onTimePercent}%)`}
                  >
                    {perf.onTimePercent >= 12 && `${perf.onTimePercent}%`}
                  </div>
                )}
                {perf.late > 0 && (
                  <div
                    className="perf_segment segment_late"
                    style={{ width: `${perf.latePercent}%` }}
                    title={`Late: ${perf.late} (${perf.latePercent}%)`}
                  >
                    {perf.latePercent >= 12 && `${perf.latePercent}%`}
                  </div>
                )}
              </div>

              <div className="perf_legend_row">
                <div className="perf_legend_item">
                  <span className="perf_legend_bullet bullet_early" />
                  <span>Early ({perf.early})</span>
                </div>
                <div className="perf_legend_item">
                  <span className="perf_legend_bullet bullet_ontime" />
                  <span>On Time ({perf.onTime})</span>
                </div>
                <div className="perf_legend_item">
                  <span className="perf_legend_bullet bullet_late" />
                  <span>Late ({perf.late})</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
