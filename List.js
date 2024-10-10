import React, { useState, useEffect } from 'react';
import './List.css';

function List() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (task) {
      const currentTime = new Date().toLocaleString();
      const newTask = { text: task, completed: false, addedAt: currentTime, completedAt: null };

      // Send new task to backend
      fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
        .then(res => res.json())
        .then(addedTask => {
          setTasks([...tasks, addedTask]);
          setTask(''); // Clear the input field after adding task
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  const toggleTaskCompletion = (index, id) => {
    const taskToUpdate = tasks[index];
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
      completedAt: !taskToUpdate.completed ? new Date().toLocaleString() : null,
    };

    // Update task in the backend
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(res => res.json())
      .then(() => {
        const newTasks = tasks.map((t, i) => (i === index ? updatedTask : t));
        setTasks(newTasks);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const markAsCompleted = (index, id) => {
    const taskToUpdate = tasks[index];
    const updatedTask = {
      ...taskToUpdate,
      completed: true,
      completedAt: new Date().toLocaleString(),
    };

    // Update task in the backend
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(res => res.json())
      .then(() => {
        const newTasks = tasks.map((t, i) => (i === index ? updatedTask : t));
        setTasks(newTasks);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (index, id) => {
    // Delete task from the backend
    fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
          className="input"
        />
        <button onClick={addTask} className="add-button">Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((t, index) => (
          <li key={t._id} className={`task-item ${t.completed ? 'completed' : ''}`}>
            <div>
              <span onClick={() => toggleTaskCompletion(index, t._id)} className="task-text">
                {t.text}
              </span>
              <div className="timestamps">
                <span>Added: {t.addedAt}</span>
                {t.completed && <span> | Completed: {t.completedAt}</span>}
              </div>
            </div>
            <button onClick={() => markAsCompleted(index, t._id)} className="complete-button">
              Completed
            </button>
            <button onClick={() => deleteTask(index, t._id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
