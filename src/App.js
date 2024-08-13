import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const getTodos = async () => {
    try {
      const res = await axios.get("http://localhost:9000/todos");
      setTodos(res.data);
    } catch {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const onChange = (evt) => {
    setValue(evt.target.value);
  };

  const handleUpdate = async (todo) => {
    await axios.put(
      `http://localhost:9000/todos/${todo.id}`,
      { ...todo, completed: !todo.completed }
    );
    getTodos();
  };

  const onDelete = async (event, id) => {
    event.stopPropagation();
    await axios.delete(`http://localhost:9000/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (!value.trim()) return;
    const res = await axios.post("http://localhost:9000/todos", {
      text: value,
      completed: false,
    });
    console.log(res);
    setTodos([...todos, res.data]);
    setValue("");
  };

  return (
    <div>
      <h1>To do list:</h1>
      <ul>
        {todos?.map((todo) => (
          <li
            style={{ textDecoration: todo.completed ? "line-through" : "" }}
            onClick={() => handleUpdate(todo)}
            key={todo.id}
          >
            {todo.text}{" "}
            <button onClick={(e) => onDelete(e, todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <form onSubmit={onSubmit}>
          <input
            id="input"
            value={value}
            placeholder="Type your todo"
            onChange={onChange}
            type="text"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
