import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Board from "./components/pages/board/Board";
import Sidebar from "./components/ui/sidebar/Sidebar";
import TaskForm from "./components/ui/task_form/TaskForm";
import { TaskProvider, useTaskContext } from "./context";

function AppContent() {
  const {
    isTaskModalOpen,
    editingTask,
    closeModal,
    saveTask,
    categories,
    responsiblePersons,
    columns,
  } = useTaskContext();

  return (
    <div className="container">
      <Sidebar />
      <main className="main_content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </main>

      {isTaskModalOpen && (
        <TaskForm
          key={editingTask?.id || "new"}
          initialData={editingTask}
          onSubmit={saveTask}
          onClose={closeModal}
          categoriesList={categories}
          responsiblePersonsList={responsiblePersons}
          columnsList={columns}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
