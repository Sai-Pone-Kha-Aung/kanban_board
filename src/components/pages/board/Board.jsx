import { useState } from "react";
import "./Board.style.css";
import TaskCard from "../../ui/task_card/TaskCard";
import { INITIAL_TASKS, COLUMNS } from "../../../constant";
import TaskForm from "../../ui/task_form/TaskForm";

function Board() {
  const [columns] = useState(COLUMNS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleSaveTask = (taskPayload) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskPayload.id ? taskPayload : t))
      );
      setEditingTask(null);
    } else {
      setTasks((prev) => [taskPayload, ...prev]);
      setShowTaskForm(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <section className="board_container">
      <header className="board_header">
        <div>
          <h2 className="board_title">Kanban Board</h2>
        </div>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
          onClick={() => {
            setEditingTask(null);
            setShowTaskForm(true);
          }}
        >
          + Add New Task
        </button>
      </header>

      <main className="board_main">
        <div className="board_columns">
          {columns.map((col) => (
            <div key={col.id} className="column">
              <div className="column_header">
                <div className="column_title">
                  <p>{col.title}</p>
                  <span
                    className="item_count"
                    style={{ backgroundColor: col.badgeColor, color: "#fff" }}
                  >
                    {tasks.filter((task) => task.status === col.id).length}
                  </span>
                </div>
              </div>
              {tasks
                .filter((task) => task.status === col.id)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    props={task}
                    columnsList={columns}
                    onEdit={(taskToEdit) => setEditingTask(taskToEdit)}
                    onDelete={handleDeleteTask}
                    onMove={handleMoveTask}
                  />
                ))}
            </div>
          ))}
        </div>
      </main>

      {(showTaskForm || editingTask) && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSaveTask}
          onClose={handleCloseForm}
        />
      )}
    </section>
  );
}

export default Board;
