import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");
const taskContainer = document.querySelector(".todo-container");

const taskFactory = (title) => {
  let isDone = false;
  const creationDate = formatISO(Date.now());
  const taskId = uuidv4();
  return { title, isDone, creationDate, taskId };
};

let tasksList = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

const toggleTaskDone = (task) => {
  let id = task.taskId;
  let index = tasksList.findIndex((task) => task.taskId === id);
  tasksList[index].isDone = !tasksList[index].isDone;
};

const checkIsDone = (task) => {
  let id = task.taskId;
  if (task.isDone) {
    let checkbox = document.getElementById(id);
    checkbox.setAttribute("checked", "");
  }
};

const appendTaskToDOM = (task) => {
  let div = document.createElement("div");

  let label = document.createElement("label");
  label.textContent = task.title;
  label.setAttribute("for", task.taskId);

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", task.taskId);
  checkbox.setAttribute("class", "task-checkbox");

  // label.prepend(checkbox);

  div.append(checkbox);
  div.append(label);
  div.classList.add("todo-item");

  checkbox.addEventListener("change", function () {
    toggleTaskDone(task);
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  });

  taskContainer.append(div);
  checkIsDone(task);
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
