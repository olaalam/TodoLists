import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";

export default function Home() {
  const apiKey = "67569dae60a208ee1fddc428";
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getTodos() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos/${apiKey}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          setTodos(data.todos);
        }
      }
    } catch {
      console.log("error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  async function addTodos() {
    if (!title.trim()) {
      alert("Please enter a valid title!");
      return;
    }
    try {
      const obj = {
        title: title,
        apiKey: apiKey,
      };
      const response = await fetch(`https://todos.routemisr.com/api/v1/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          setTodos((prevTodos) => [...prevTodos, { ...obj, _id: data.todoId, completed: false }]);
          setTitle("");
        }
      }
    } catch {
      console.log("error");
    }
  }

  return (
    <>
      <div className={`loading ${isLoading ? "" : "d-none"}`}>
        <span className="loader" />
      </div>
      <TaskList
        todos={todos}
        setTodos={setTodos}
        title={title}
        setTitle={setTitle}
        addTodos={addTodos}
        setIsLoading={setIsLoading}
      />
    </>
  );
}