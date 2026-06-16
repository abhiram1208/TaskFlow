import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      if (editingTask) {
        await axios.put(`${API}/tasks/${editingTask._id}`, {
          title, description, priority, dueDate
        });
      } else {
        await axios.post(`${API}/tasks`, {
          title, description, priority, dueDate
        });
      }
      setTitle('');
      setDescription('');
      setDueDate('');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    await axios.put(`${API}/tasks/${task._id}`, { completed: !task.completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-gray-900">My Tasks</h2>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-8 mb-10">
        <h3 className="text-xl font-semibold mb-6">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="border rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
            required
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full mt-6 border rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
          rows="3"
        />

        <div className="flex gap-4 mt-6">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 hover:shadow-md transition">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
              className="w-6 h-6 accent-blue-600"
            />

            <div className="flex-1">
              <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </p>
              {task.description && <p className="text-gray-500 text-sm mt-1">{task.description}</p>}
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                  ${task.priority === 'high' ? 'bg-red-100 text-red-600' : ''}
                  ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : ''}
                  ${task.priority === 'low' ? 'bg-green-100 text-green-600' : ''}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startEdit(task)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl">
                <Edit2 size={20} />
              </button>
              <button onClick={() => deleteTask(task._id)} className="p-3 text-red-600 hover:bg-red-50 rounded-xl">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-20">No tasks yet. Create your first task above!</p>
        )}
      </div>
    </div>
  );
}