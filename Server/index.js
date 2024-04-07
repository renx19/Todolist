require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'https://todolist-gfcv.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods here
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Todo schema and model
const todoSchema = new mongoose.Schema({
  text: String,
  isComplete: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add todo
app.post('/add', async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update todo
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
const { text } = req.body;

console.log('Received update request:', { id, text });

try {
  const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
  res.json(updatedTodo);
} catch (error) {
  console.error('Error updating todo:', error);
  res.status(500).json({ error: error.message });
}

});

// Delete todo
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Complete todo
app.put('/complete/:id', async (req, res) => {
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

// Start the server
app.listen(3001, () => {
  console.log(`Server is running on port ${}`);
});