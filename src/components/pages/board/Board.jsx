import { useState, useMemo } from "react";
import "./Board.style.css";
import TaskCard from "../../ui/task_card/TaskCard";
import { useTaskContext } from "../../../context";
import { Search, Filter, Plus, Layers } from "lucide-react";

function Board() {
  const {
    tasks,
    columns,
    categories,
    openCreateModal,
    openEditModal,
    deleteTask,
    moveTask,
  } = useTaskContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dragOverCol, setDragOverCol] = useState(null);

  // Filter tasks based on search and category
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.responsiblePerson?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "all" || task.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [tasks, searchQuery, selectedCategory]);

  // Drag and Drop handlers
  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    // Only reset if leaving the column element itself
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      moveTask(taskId, colId);
    }
  };

  return (
    <section className="board_container">
      <header className="board_header">
        <div className="board_header_title_row">
          <div>
            <h2 className="board_title">Kanban Board</h2>
            <p className="board_subtitle">
              Manage tasks, drag across stages, and track progress.
            </p>
          </div>
          <button
            type="button"
            className="board_add_btn"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Board Controls: Search & Category Filter */}
        <div className="board_filters_bar">
          <div className="board_search_wrapper">
            <Search size={16} className="board_search_icon" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="board_search_input"
            />
            {searchQuery && (
              <button
                type="button"
                className="board_search_clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="board_filter_group">
            <Filter size={15} className="board_filter_icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="board_category_select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="board_main">
        <div className="board_columns">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === col.id
            );
            const totalInCol = tasks.filter((t) => t.status === col.id).length;
            const isTargetOver = dragOverCol === col.id;

            return (
              <div
                key={col.id}
                className={`column ${isTargetOver ? "column_drag_over" : ""}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="column_header">
                  <div className="column_title">
                    <span
                      className="column_badge_indicator"
                      style={{ backgroundColor: col.badgeColor }}
                    />
                    <p>{col.title}</p>
                    <span
                      className="item_count"
                      style={{ backgroundColor: col.badgeColor, color: "#fff" }}
                    >
                      {totalInCol}
                    </span>
                  </div>
                  {col.showAdd && (
                    <button
                      type="button"
                      className="column_quick_add_btn"
                      onClick={openCreateModal}
                      title={`Add task to ${col.title}`}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                <div className="column_dropzone">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      props={task}
                      columnsList={columns}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                      onMove={moveTask}
                    />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="column_empty_state">
                      <Layers size={22} className="column_empty_icon" />
                      <p>
                        {searchQuery || selectedCategory !== "all"
                          ? "No matching tasks"
                          : `Drop tasks here or click +`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </section>
  );
}

export default Board;
