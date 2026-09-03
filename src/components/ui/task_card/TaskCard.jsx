import { useState, useEffect, useRef } from "react";
import { Calendar, MoreVertical, Pencil, Trash2, ArrowRightLeft } from "lucide-react";
import "./TaskCard.style.css";

export default function TaskCard({
  props,
  onEdit,
  onDelete,
  onMove,
  columnsList = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setShowMoveSubmenu(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
    setShowMoveSubmenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onEdit) onEdit(props);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (onDelete) onDelete(props.id);
  };

  const handleMove = (e, targetStatus) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowMoveSubmenu(false);
    if (onMove) onMove(props.id, targetStatus);
  };

  const availableColumns = columnsList.filter((col) => col.id !== props.status);

  return (
    <div className="item_container">
      <div className="item_header_row">
        <div className="item_categoty">{props.category}</div>

        <div className="item_menu_wrapper" ref={menuRef}>
          <button
            type="button"
            className="item_dots_btn"
            onClick={toggleMenu}
            title="Options"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div
              className="item_dropdown_menu"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="dropdown_item"
                onClick={handleEdit}
              >
                <Pencil size={14} />
                <span>Edit</span>
              </button>

              <div
                className="dropdown_item move_item"
                onMouseEnter={() => setShowMoveSubmenu(true)}
                onMouseLeave={() => setShowMoveSubmenu(false)}
              >
                <div
                  className="move_item_label"
                  onClick={() => setShowMoveSubmenu(!showMoveSubmenu)}
                >
                  <ArrowRightLeft size={14} />
                  <span>Move to</span>
                </div>

                {showMoveSubmenu && availableColumns.length > 0 && (
                  <div className="dropdown_submenu">
                    {availableColumns.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        className="dropdown_item submenu_item"
                        onClick={(e) => handleMove(e, col.id)}
                      >
                        <span
                          className="col_badge_dot"
                          style={{ backgroundColor: col.badgeColor }}
                        />
                        <span>{col.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="dropdown_item delete_item"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="item_container--info">
        <div className="item_title">{props.title}</div>
        <div className="item_description">
          {props.description || props.title}
        </div>
      </div>

      <hr />
      <div className="item_info">
        <div className="item_avatar">
          {props.responsiblePerson?.avatar || "JD"}
        </div>
        <div className="item_date">
          <Calendar size={18} /> <span>{props.dueDate}</span>
        </div>
      </div>
    </div>
  );
}
