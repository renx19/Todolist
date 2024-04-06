

// models/todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model('todos', todoSchema);

module.exports = Todo;


