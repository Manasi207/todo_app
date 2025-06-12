
// import React, { useState, useEffect } from 'react';
// import TodoItem from './components/TodoItem';
// import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
// import './App.css';

// function App() {
//   const [tasks, setTasks] = useState(() => loadFromLocalStorage());
//   const [taskInput, setTaskInput] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   // const [errorMessage, setErrorMessage] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     saveToLocalStorage(tasks);
//   }, [tasks]);

//   // const addTask = () => {
//   //   const trimmed = taskInput.trim();

//   //   if (!trimmed || trimmed.length < 2 || /^\d+$/.test(trimmed)) {
//   //     setErrorMessage('Invalid task! Unable to recognize!! Enter at least 2 valid characters.');
//   //     return;
//   //   }

//   //   setTasks([...tasks, { id: Date.now(), text: trimmed, completed: false }]);
//   //   setTaskInput('');
//   //   setSuccessMessage('New Task Added !!!');
//   //   setErrorMessage('');

//   //   setTimeout(() => setSuccessMessage(''), 3000);
//   // };

// // // updated addTask function to include OpenAI validation
// const addTask = async () => {
//   setError('');
//   setSuccessMessage('');

//   const trimmedTask = taskInput.trim();
//   if (!trimmedTask) {
//     setError('Please enter a task');
//     return;
//   }

//   try {
//     setError(''); // clear previous errors
//     setSuccessMessage('Checking task...');
//     const response = await fetch('http://localhost:5000/validate-task', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ task: trimmedTask }),
//     });

//     const data = await response.json();

//     if (!data.valid) {
//       setError('Invalid task. Please enter a meaningful one.');
//       setSuccessMessage('');
//       return;
//     }

//     // Add task
//     setTasks([...tasks, { id: Date.now(), text: trimmedTask, completed: false }]);
//     setTaskInput('');
//     setSuccessMessage('New Task Added !!!');

//     setTimeout(() => setSuccessMessage(''), 3000);
//   } catch (err) {
//     console.error('Validation error:', err);
//     setError('Something went wrong. Please try again.');
//   }
// };


//   const toggleTask = (id) =>
//     setTasks(tasks.map(task =>
//       task.id === id ? { ...task, completed: !task.completed } : task
//     ));

//   const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));

//   const editTask = (id, newText) =>
//     setTasks(tasks.map(task =>
//       task.id === id ? { ...task, text: newText } : task
//     ));

//   const filteredTasks = tasks.filter(task =>
//     task.text.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const remaining = tasks.filter(task => !task.completed).length;

//   return (
//     <div className="todo-container">
//       <h1>Get Things Done !</h1>

//       {/* Input Row */}
//       <form onSubmit={(e) => { e.preventDefault(); addTask(); }}>
//         <input
//           type="text"
//           placeholder="What's your next task?"
//           value={taskInput}
//           onChange={(e) => setTaskInput(e.target.value)}
//         />
//         <button type="submit">Add New Task</button>
//       </form>

//       {/* Error Message */}
//       {/* {errorMessage && (
//         <div className="error-msg">
//           {errorMessage}
//         </div>
//       )} */}
      
//       {/* 🔴 Error Message */}
// {error && <p className="error-text">{error}</p>}

//       {/* Success Alert */}
//       {successMessage && (
//         <div className="success-alert">
//           {successMessage}
//         </div>
//       )}

//       {/* Search Box */}
//       <div className="search-box">
//         <input
//           type="text"
//           placeholder="Search tasks..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Task Count */}
//       <p className="task-count">
//         You have <strong>{remaining}</strong> task(s) to complete
//       </p>

//       {/* Task List */}
//       <ul className="todo-list">
//         {filteredTasks.map(task => (
//           <TodoItem
//             key={task.id}
//             task={task}
//             onToggle={toggleTask}
//             onDelete={deleteTask}
//             onEdit={editTask}
//           />
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
///--------------------------------
// App.js
import React, { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => loadFromLocalStorage());
  const [taskInput, setTaskInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // NEW

  useEffect(() => {
    saveToLocalStorage(tasks);
  }, [tasks]);

  const addTask = async () => {
    setError('');
    setSuccessMessage('');

    const trimmedTask = taskInput.trim();
    if (!trimmedTask) {
      setError('Please enter a task');
      return;
    }

    try {
      setSuccessMessage('Checking task...');
      const response = await fetch('http://localhost:5000/validate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: trimmedTask }),
      });

      const data = await response.json();

      if (!data.valid) {
        setError('Invalid task. Please enter a meaningful one.');
        setSuccessMessage('');
        return;
      }

      setTasks([...tasks, { id: Date.now(), text: trimmedTask, completed: false }]);
      setTaskInput('');
      setSuccessMessage('New Task Added !!!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Validation error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const toggleTask = (id) =>
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));

  const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));

  const editTask = (id, newText) =>
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));

  const filteredTasks = tasks
    .filter(task =>
      task.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(task => {
      if (filterStatus === 'completed') return task.completed;
      if (filterStatus === 'in-progress') return !task.completed;
      return true;
    });

  const remaining = tasks.filter(task => !task.completed).length;

  return (
    <div className="todo-container">
      <h1>Get Things Done!</h1>

      {/* Input Row */}
      <form onSubmit={(e) => { e.preventDefault(); addTask(); }}>
        <input
          type="text"
          placeholder="What's your next task?"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button type="submit">Add New Task</button>
      </form>

      {/* Error & Success */}
      {error && <p className="error-text">{error}</p>}
      {successMessage && <div className="success-alert">{successMessage}</div>}

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Options */}
      <div className="filter-options">
        <label>
          <input
            type="radio"
            name="filter"
            value="all"
            checked={filterStatus === 'all'}
            onChange={() => setFilterStatus('all')}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="in-progress"
            checked={filterStatus === 'in-progress'}
            onChange={() => setFilterStatus('in-progress')}
          />
          In Progress
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="completed"
            checked={filterStatus === 'completed'}
            onChange={() => setFilterStatus('completed')}
          />
          Completed
        </label>
      </div>

      {/* Task Count */}
      <p className="task-count">
        You have <strong>{remaining}</strong> task(s) to complete
      </p>

      {/* Task List */}
      <ul className="todo-list">
        {filteredTasks.map(task => (
          <TodoItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
