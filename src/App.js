import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");
const taskContainer = document.getElementById("todo-container");

const taskFactory = (title) => {
  const isDone = false;
  const creationDate = formatISO(Date.now());
  const taskId = uuidv4();
  return { title, isDone, creationDate, taskId };
};

let tasksList = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

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

tasksList.forEach((task) => {
  appendTaskToDOM(task);
});

const addTask = (event) => {
  event.preventDefault();
  let title = input.value;

  let newTask = taskFactory(title);

  tasksList.push(newTask);

  form.reset();

  localStorage.setItem("tasks", JSON.stringify(tasksList));

  appendTaskToDOM(newTask);
};

form.addEventListener("submit", addTask);
