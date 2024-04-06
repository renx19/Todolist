import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import ToDo from './ToDo';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:3001/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  };

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    // Check if the todo text already exists
    if (todos.some(existingTodo => existingTodo.text.toLowerCase() === todo.text.toLowerCase())) {
      alert('This task has already been created.');
      return;
    }

    // Send only the text property without extra nesting
    axios.post('http://localhost:3001/add', { text: todo.text })
      .then(response => {
        setTodos(prevTodos => [response.data, ...prevTodos]);
      })
      .catch(error => console.error(error));
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    axios.put(`http://localhost:3001/update/${todoId}`, newValue.text)
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map((item) => (item._id === todoId ? { ...item, text: response.data.text } : item))
        );
      })
      .catch(error => {
        console.error('Update failed. Server error:', error);
        console.error('Server response:', error.response); // Log the response for more details
        // Handle the error as needed
      });
  };

  const removeTodo = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        // Use the correct property for comparison (_id instead of id)
        setTodos(prevTodos => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch(error => console.error(error));
  };

  const completeTodo = (id) => {
    axios.put(`http://localhost:3001/complete/${id}`)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, isComplete: !todo.isComplete } : todo
          )
        );

        if (todos.every((todo) => todo.isComplete)) {
          alert('Congratulations! You have completed all your to-do list.');
        }
      })
      .catch(error => console.error(error));
  };


  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='ToDoList'>
      <h1 className='td'>
        Set your plan for today <br />
        {todos.length === 0 ? '' : `${todos.filter((todo) => todo.isComplete).length} / ${todos.length}`} Complete
      </h1>
      
      
      <TodoForm onSubmit={addTodo} onSearch={setSearchTerm} />
      <ToDo
      todos={filteredTodos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </div>
  );
}

export default TodoList;
