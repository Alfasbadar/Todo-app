import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function TodoCard({ task, onDelete, onEdit, onCheck }) {
  const [isEditing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task.name);

  const handleEdit = () => {
    setEditing(!isEditing);
  };

  const handleSave = () => {
    onEdit(task.id, editedTask);
    setEditing(false);
  };

  const handleCheck = () => {
    onCheck(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className={`todo-card ${task.checked ? 'checked' : ''}`}>
      <div className="todo-content">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <p>{task.name}</p>
        )}
        <p className="created-date">Created: {task.createdAt.toLocaleString()}</p>
      </div>
      <div className="todo-actions">
        <label className="check-label">
          <input type="checkbox" onChange={handleCheck} />
          <span className="checkmark"></span>
        </label>
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
        {!isEditing && (
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: Date.now(),
        name: newTask,
        createdAt: new Date(),
        checked: false,
      };

      setTasks((prevTasks) => [...prevTasks, newTaskObj]);
      setNewTask('');
    }
  };

  const handleEditTask = (taskId, newName) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: newName } : task
      )
    );
  };

  const handleCheckTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  useEffect(() => {
    // Set focus to the input bar when component mounts
    inputRef.current.focus();
  }, []);

  return (
    <div className="App">
      <div className="todo-list">
        {tasks.map((task) => (
          <TodoCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onCheck={handleCheckTask}
          />
        ))}
      </div>
      <div className="add-task">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddTask}>+</button>
      </div>
    </div>
  );
}

export default App;
