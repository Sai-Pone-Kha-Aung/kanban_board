import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Circle,
  Clock3,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

export default function DashboardStats({ analytics }) {
  const navigate = useNavigate();

  const cards = [
    {
      id: "total",
      label: "TOTAL TASKS",
      value: analytics.total,
      icon: <ClipboardList />,
      className: "card-total",
      title: "View all tasks on Board",
    },
    {
      id: "todo",
      label: "TO DO",
      value: analytics.todo,
      icon: <Circle />,
      className: "card-todo",
      title: "View TO DO column",
    },
    {
      id: "doing",
      label: "DOING",
      value: analytics.doing,
      icon: <Clock3 />,
      className: "card-doing",
      title: "View DOING column",
    },
    {
      id: "done",
      label: "DONE",
      value: analytics.done,
      icon: <CircleCheck />,
      className: "card-done",
      title: "View DONE column",
    },
    {
      id: "overdue",
      label: "OVERDUE",
      value: analytics.overdueCount,
      icon: <TriangleAlert />,
      className: `card-overdue ${analytics.overdueCount > 0 ? "has_overdue" : ""}`,
      title: "View overdue tasks on Board",
    },
  ];

  return (
    <div className="stats_row">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`stat_card ${card.className}`}
          onClick={() => navigate("/board")}
          title={card.title}
        >
          <div className="stat_top">
            <span className="stat_label">{card.label}</span>
            <div className="stat_icon" aria-hidden>
              {card.icon}
            </div>
          </div>
          <div className="stat_value">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
