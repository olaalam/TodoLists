import React from "react";
import Swal from 'sweetalert2';
export default function TaskList({
  todos,
  title,
  setTitle,
  addTodos,
  setTodos,
  setIsLoading,
}) {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount
    ? (completedCount / totalCount) * 100
    : 0;

    async function deleteTodo(id) {
        const { isConfirmed } = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });
      
        if (isConfirmed) {
          try {
            setIsLoading(true);
            const obj = {
              todoId: id,
            };
            const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
              method: "DELETE",
              body: JSON.stringify(obj),
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (response.ok) {
              const data = await response.json();
              if (data.message === "success") {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
                Swal.fire('Deleted!', 'Your task has been deleted.', 'success'); // Show success message
              }
            }
          } catch (error) {
            console.error("Error:", error); // Log the error
            Swal.fire('Error!', 'There was an error deleting your task.', 'error'); // Show error message
          } finally {
            setIsLoading(false); // Reset loading state
          }
        }
      }
  async function complete(id) {
    try {
      const obj = { todoId: id };
      const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          setTodos((prevTodo) =>
            prevTodo.map((todo) => {
              if (todo._id === id) {
                return { ...todo, completed: true };
              }
              return todo;
            })
          );
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    addTodos();
  }

  return (
    <>
      <section className="w-50 mx-auto my-4">
        <div className="status-todo bg-light bg-opacity-25 p-3 rounded mb-4 shadow border d-flex align-items-center justify-content-between">
          <div>
            <div className="flex-grow-1">
              <h1 className="h5">Todo App</h1>
              <span className="small">keep it up!</span>
            </div>
        <div id="progressBar">
        <div id="progress" style={{ width: `${progressPercentage}%` }} />
      </div>
            <div className="status-number">
              <span>{completedCount}</span> / <span>{totalCount}</span>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="d-flex gap-5 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            className="form-control custom-input"
            placeholder="task to be done..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" className="add-task">
            Add
          </button>
        </form>
        <ul className="task-container bg-white mt-5 p-4 rounded shadow">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="d-flex align-items-center justify-content-between border-bottom pb-2 my-2"
            >
              <span
                onClick={() => complete(todo._id)}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                className="task-name"
              >
                {todo.title}
              </span>
              <div className="d-flex align-items-center gap-4">
                {todo.completed && (
                  <span>
                    <i
                      className="fa-regular fa-circle-check"
                      style={{ color: "#63e6be" }}
                    />
                  </span>
                )}
                <span onClick={() => deleteTodo(todo._id)} className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
