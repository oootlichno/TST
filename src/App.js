import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await axios.get("http://localhost:9000/todos");
        setTodos(res.data);
      } catch {
        console.error(error);
      }
    };
    getTodos();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const onChange = (evt) => {
    setValue(evt.target.value);
  };

  const logStuff = () => {
    console.log('logging stuff')
  }

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:9000/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (!value.trim()) return;
    const res = await axios.post("http://localhost:9000/todos", {
      text: value,
      complete: false,
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
          <li key={todo.id}>
            {todo.text}{" "}
            <button onClick={() => onDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={logStuff}>log stuff</button>
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
