import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function TodoForm({ onSubmit, edit, onSearch }) {
  const [input, setInput] = useState(edit ? edit.value : '');

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text: input }); // Pass an object with 'text' property
    setInput('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-bar"
      />
      
      <input
        type="text"
        placeholder={edit ? 'Update your todo' : 'Add a new todo'}
        value={input}
        name="text"
        className="todo-input"
        onChange={handleChange}
      />
      <button className="todo-button" type="submit">
        {edit ? 'Update' : 'Add todo'}
      </button>
    </form>
  );
}

// Prop type validation
TodoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  edit: PropTypes.object,
  onSearch: PropTypes.func.isRequired
};

export default TodoForm;
