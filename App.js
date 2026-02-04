import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  // This constant ensures all requests use the correct Versioned API
  const API = 'http://localhost:5000/api/v1';

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Logic for Login using v1
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Error"));
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/tasks`, { title }, {
        headers: { 'x-auth-token': token }
      });
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
  };

  if (!token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Sign In (v1)</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      <h2>My Tasks</h2>
      <form onSubmit={addTask}>
        <input type="text" placeholder="New Task" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} 
            <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '10px', color: 'red' }}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;