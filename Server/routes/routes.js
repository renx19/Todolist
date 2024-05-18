// routes.js
const express = require('express');
const Todo = require('../Models/Todo');

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});


router.get('/todos', async(req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add', async(req, res) => {
    try {
        const newTodo = new Todo({ text: req.body.text });
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/// Update todo
router.put('/update/:id', async(req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete todo
router.delete('/delete/:id', async(req, res) => {
    const { id } = req.params;

    try {
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete todo
router.put('/complete/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const todo = await Todo.findById(id);
        todo.isComplete = !todo.isComplete;
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;