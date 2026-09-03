import { useState, useEffect, useMemo } from "react";
import { TaskContext } from "./taskContextDef";
import {
  INITIAL_TASKS,
  INITIAL_CATEGORIES,
  COLUMNS,
  RESPONSIBLE_PERSONS,
  STORAGE_KEYS,
} from "../constant";

export function TaskProvider({ children }) {
  // 1. Initialize Tasks from localStorage or initial constant
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load tasks from localStorage:", e);
    }
    return INITIAL_TASKS;
  });

  // 2. Initialize Categories from localStorage or initial constant
  const [categories, setCategories] = useState(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load categories from localStorage:", e);
    }
    return INITIAL_CATEGORIES;
  });

  // 3. Modal State for global task creation & editing
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Sync tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage:", e);
    }
  }, [tasks]);

  // Sync categories to localStorage whenever categories change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error("Failed to save categories to localStorage:", e);
    }
  }, [categories]);

  // Modal open / close helpers
  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  // Add a new category if it doesn't already exist
  const addCategory = (newCat) => {
    const trimmed = newCat?.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
  };

  // Add Task
  const addTask = (taskPayload) => {
    if (taskPayload.category && !categories.includes(taskPayload.category)) {
      addCategory(taskPayload.category);
    }
    setTasks((prev) => [taskPayload, ...prev]);
    closeModal();
  };

  // Update Task
  const updateTask = (taskPayload) => {
    if (taskPayload.category && !categories.includes(taskPayload.category)) {
      addCategory(taskPayload.category);
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === taskPayload.id ? taskPayload : t))
    );
    closeModal();
  };

  // Delete Task
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (editingTask?.id === taskId) {
      closeModal();
    }
  };

  // Move Task status
  const moveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = newStatus === "done";
          return {
            ...t,
            status: newStatus,
            // Automatically record completeDate if moving to done and not set
            completeDate: isDone
              ? t.completeDate || new Date().toISOString().slice(0, 10)
              : t.completeDate,
          };
        }
        return t;
      })
    );
  };

  // Save handler for TaskForm (handles both add & update)
  const saveTask = (taskPayload) => {
    if (editingTask) {
      updateTask(taskPayload);
    } else {
      addTask(taskPayload);
    }
  };

  // Reset to initial demo data if needed
  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  };

  // ==========================================
  // Computed Analytics & Metrics for Dashboard
  // ==========================================
  const analytics = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const doing = tasks.filter((t) => t.status === "doing").length;
    const done = tasks.filter((t) => t.status === "done").length;

    // Normalize today date string 'YYYY-MM-DD'
    const todayStr = new Date().toISOString().slice(0, 10);

    // Overdue tasks: Not completed, and dueDate exists and is before today
    const overdueTasks = tasks.filter(
      (t) => t.status !== "done" && t.dueDate && t.dueDate < todayStr
    );
    const overdueCount = overdueTasks.length;

    // Category distribution
    const categoryMap = {};
    // Ensure all registered categories appear even if count is 0
    categories.forEach((cat) => {
      categoryMap[cat] = 0;
    });
    tasks.forEach((t) => {
      const cat = t.category || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryMap).map(
      ([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })
    );
    // Sort by count descending
    categoryDistribution.sort((a, b) => b.count - a.count);

    // Completion Performance Calculation (Early, On Time, Late)
    const completedTasks = tasks.filter((t) => t.status === "done");

    const calculatePerformance = (taskList) => {
      let early = 0;
      let onTime = 0;
      let late = 0;

      taskList.forEach((t) => {
        if (!t.dueDate || !t.completeDate) {
          // If no dueDate was specified, treat as On Time if completed
          onTime += 1;
          return;
        }
        if (t.completeDate < t.dueDate) {
          early += 1;
        } else if (t.completeDate === t.dueDate) {
          onTime += 1;
        } else {
          late += 1;
        }
      });

      const totalCompleted = taskList.length;
      return {
        early,
        onTime,
        late,
        totalCompleted,
        earlyPercent: totalCompleted > 0 ? Math.round((early / totalCompleted) * 100) : 0,
        onTimePercent: totalCompleted > 0 ? Math.round((onTime / totalCompleted) * 100) : 0,
        latePercent: totalCompleted > 0 ? Math.round((late / totalCompleted) * 100) : 0,
      };
    };

    const completionPerformanceAll = calculatePerformance(completedTasks);

    // Last 30 days performance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);

    const recentCompletedTasks = completedTasks.filter((t) => {
      const cDate = t.completeDate || t.dueDate || "";
      return cDate >= thirtyDaysAgoStr;
    });
    const completionPerformance30Days = calculatePerformance(recentCompletedTasks);

    return {
      total,
      todo,
      doing,
      done,
      overdueCount,
      overdueTasks,
      categoryDistribution,
      completionPerformanceAll,
      completionPerformance30Days,
    };
  }, [tasks, categories]);

  const value = {
    tasks,
    categories,
    columns: COLUMNS,
    responsiblePersons: RESPONSIBLE_PERSONS,
    isTaskModalOpen,
    editingTask,
    analytics,
    openCreateModal,
    openEditModal,
    closeModal,
    saveTask,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addCategory,
    resetToDemoData,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
