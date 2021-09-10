// import { format } from "date-fns";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");
const taskContainer = document.getElementById("todo-container");

const taskFactory = (title) => {
  const isDone = false;
  // const creationDate = format(Date.now());
  return { title, isDone };
};

const tasksList = [];

const appendTaskToDOM = (task) => {
  let div = document.createElement("div");

  let label = document.createElement("label");
  label.textContent = task.title;

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");

  label.prepend(checkbox);

  div.append(label);
  div.classList.add("todo-item");

  taskContainer.append(div);
};

const addTask = (event) => {
  event.preventDefault();
  let title = input.value;

  let newTask = taskFactory(title);
  console.log("new task", newTask);

  tasksList.push(newTask);

  appendTaskToDOM(newTask);
  console.log("tasks list", tasksList);
  form.reset();
};

form.addEventListener("submit", addTask);
