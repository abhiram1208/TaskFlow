const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();
router.use(auth);
// GET ALL TASKS
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// CREATE TASK
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    // ✅ Validation
    if (!title) {
      return res.status(400).json({ msg: 'Title is required' });
    }
    const task = new Task({
      user: req.user.id,
      title,
      description,
      priority: priority || 'medium',
      dueDate
    });
    await task.save();
    console.log("✅ Task created successfully");
    res.json(task);
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});
// UPDATE TASK
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
// DELETE TASK
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;