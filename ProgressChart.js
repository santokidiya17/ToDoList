import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import axios from 'axios';
import 'react-circular-progressbar/dist/styles.css';
import './ProgressChart.css';

const CircularProgressChart = ({ progress }) => {
  return (
    <div style={{ width: 150, height: 150, marginTop: '30px' }}> {/* Added margin-top */}
      <CircularProgressbar
        value={progress}
        text={`${Math.round(progress)}%`}
        styles={buildStyles({
          pathColor: progress === 100 ? 'green' : '#3e98c7',
          textColor: progress === 100 ? 'green' : '#000',
        })}
      />
    </div>
  );
};


const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const completeTask = async (id, completed) => {
    if (completed) return;

    const updatedTasks = tasks.map(task =>
      task._id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: true });
    } catch (error) {
      console.error('Error updating task:', error);
      setTasks(tasks);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="centered-container">
      <h1>To-Do List</h1>

      <table className="task-table">
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>Task</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td>{task.text}</td>
              <td>{task.completed ? 'Completed' : 'Pending'}</td>
              <td>
                <button
                  onClick={() => completeTask(task._id, task.completed)}
                  disabled={task.completed}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: task.completed ? 'lightgray' : '#28a745',
                    color: '#fff',
                    cursor: task.completed ? 'not-allowed' : 'pointer',
                  }}
                >
                  {task.completed ? 'Completed' : 'Mark as Completed'}
                </button>
                <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: '#fff' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CircularProgressChart progress={progress} />
      <p>{completedTasks} of {tasks.length} tasks completed.</p>
    </div>
  );
};

export default ToDoList;
