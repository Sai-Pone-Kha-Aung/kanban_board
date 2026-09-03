import { useState, useEffect } from "react";
import "./TaskForm.style.css";
import { COLUMNS, INITIAL_CATEGORIES, RESPONSIBLE_PERSONS } from "../../../constant";

function TaskForm({
  initialData = null,
  onSubmit,
  onClose,
  categoriesList = INITIAL_CATEGORIES,
  responsiblePersonsList = RESPONSIBLE_PERSONS,
  columnsList = COLUMNS,
}) {
  const getInitialState = (data) => {
    const isCustomCat =
      data?.category && !categoriesList.includes(data.category);
    return {
      title: data?.title || "",
      description: data?.description || "",
      category: isCustomCat
        ? "__add_new__"
        : data?.category || categoriesList[0] || "",
      customCategory: isCustomCat ? data.category : "",
      startDate: data?.startDate || new Date().toISOString().slice(0, 10),
      dueDate: data?.dueDate || "",
      completeDate: data?.completeDate || "",
      responsiblePersonId:
        data?.responsiblePerson?.id ||
        data?.responsiblePersonId ||
        responsiblePersonsList[0]?.id ||
        "",
      status: data?.status || "todo",
    };
  };

  const [formData, setFormData] = useState(() => getInitialState(initialData));
  const [isAddingCategory, setIsAddingCategory] = useState(() =>
    Boolean(initialData?.category && !categoriesList.includes(initialData.category))
  );

  useEffect(() => {
    setFormData(getInitialState(initialData));
    setIsAddingCategory(
      Boolean(initialData?.category && !categoriesList.includes(initialData.category))
    );
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      if (value === "__add_new__") {
        setIsAddingCategory(true);
      } else {
        setIsAddingCategory(false);
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory = isAddingCategory
      ? formData.customCategory.trim()
      : formData.category;

    if (!formData.title.trim()) {
      alert("Please enter a task title.");
      return;
    }
    if (!finalCategory) {
      alert("Please select or specify a category.");
      return;
    }

    const selectedPerson =
      responsiblePersonsList.find((p) => p.id === formData.responsiblePersonId) ||
      responsiblePersonsList[0];

    const taskPayload = {
      id: initialData?.id || `task-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: finalCategory,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      completeDate:
        formData.status === "done"
          ? formData.completeDate || new Date().toISOString().slice(0, 10)
          : formData.completeDate || null,
      responsiblePerson: selectedPerson,
      status: formData.status,
    };

    if (onSubmit) {
      onSubmit(taskPayload);
    }
  };

  return (
    <div className="task_form_overlay" onClick={onClose}>
      <div className="task_form_wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="task_form_header">
          <h3 className="task_form_title">
            {initialData ? "Edit Task" : "New Task"}
          </h3>
          {onClose && (
            <button type="button" className="task_form_close_btn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <form className="task_form_container" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="task_form_row full_width">
            <label htmlFor="task_title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="task_title"
              name="title"
              placeholder="e.g. Implement drag & drop feature"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="task_form_row full_width">
            <label htmlFor="task_description">Description</label>
            <textarea
              id="task_description"
              name="description"
              rows={3}
              placeholder="Provide task details or acceptance criteria..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="task_form_grid">
            {/* Category */}
            <div className="task_form_row">
              <label htmlFor="task_category">
                Category <span className="required">*</span>
              </label>
              <select
                name="category"
                id="task_category"
                value={isAddingCategory ? "__add_new__" : formData.category}
                onChange={handleChange}
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__add_new__">+ Add new category...</option>
              </select>
            </div>

            {/* New Category Custom Input */}
            {isAddingCategory && (
              <div className="task_form_row">
                <label htmlFor="task_custom_category">New Category Name</label>
                <input
                  type="text"
                  id="task_custom_category"
                  name="customCategory"
                  placeholder="Enter new category..."
                  value={formData.customCategory}
                  onChange={handleChange}
                  required={isAddingCategory}
                />
              </div>
            )}

            {/* Responsible Person */}
            <div className="task_form_row">
              <label htmlFor="task_responsible_person">Responsible Person</label>
              <select
                name="responsiblePersonId"
                id="task_responsible_person"
                value={formData.responsiblePersonId}
                onChange={handleChange}
              >
                {responsiblePersonsList.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.avatar})
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="task_form_row">
              <label htmlFor="task_status">Status</label>
              <select
                name="status"
                id="task_status"
                value={formData.status}
                onChange={handleChange}
              >
                {columnsList.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Inputs Grouped Together */}
          <div className="task_form_dates_section">
            <h4 className="task_form_section_title">Task Dates</h4>
            <div className="task_form_grid">
              {/* Start Date */}
              <div className="task_form_row">
                <label htmlFor="task_start_date">Start Date</label>
                <input
                  type="date"
                  id="task_start_date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              {/* Due Date */}
              <div className="task_form_row">
                <label htmlFor="task_due_date">Due Date</label>
                <input
                  type="date"
                  id="task_due_date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>

              {/* Complete Date - Shown when editing existing task or status is done */}
              {(initialData || formData.status === "done") && (
                <div className="task_form_row">
                  <label htmlFor="task_complete_date">Complete Date</label>
                  <input
                    type="date"
                    id="task_complete_date"
                    name="completeDate"
                    value={formData.completeDate}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="task_form_actions">
            {onClose && (
              <button
                type="button"
                className="task_form_btn cancel"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="task_form_btn submit">
              {initialData ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
