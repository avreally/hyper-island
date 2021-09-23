import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");
const taskContainer = document.querySelector(".todo-container");
const listToday = document.getElementById("today-list");
const listImportant = document.getElementById("important-list");

const taskFactory = (title) => {
  let isDone = false;
  let isImportant = false;
  const creationDate = formatISO(Date.now());
  const taskId = uuidv4();
  return { title, isDone, isImportant, creationDate, taskId };
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
  let checkbox = document.getElementById(id);
  let icon = document.getElementById(`icon-${id}`);

  if (task.isDone) {
    checkbox.setAttribute("checked", "");
    icon.classList.add("priority-icon-important");
  } else {
    icon.classList.remove("priority-icon-important");
  }
};

const toggleTaskImportance = (task) => {
  let id = task.taskId;
  let index = tasksList.findIndex((task) => task.taskId === id);
  tasksList[index].isImportant = !tasksList[index].isImportant;
};

const checkIsImportant = (task) => {
  let id = `icon-${task.taskId}`;
  let icon = document.getElementById(id);

  if (task.isImportant) {
    icon.innerHTML = "★";
  } else {
    icon.innerHTML = "☆";
  }
};

const appendTaskToDOM = (task) => {
  let id = task.taskId;
  let div = document.createElement("div");
  div.classList.add("todo-item");

  let innerDiv = document.createElement("div");
  innerDiv.classList.add("todo-item-left-part");

  let label = document.createElement("label");
  label.textContent = task.title;
  label.setAttribute("for", id);

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", id);
  checkbox.setAttribute("class", "task-checkbox");

  let priorityIcon = document.createElement("button");
  priorityIcon.innerHTML = "☆";
  priorityIcon.setAttribute("class", "priority-icon");
  priorityIcon.setAttribute("id", `icon-${id}`);

  innerDiv.append(checkbox);
  innerDiv.append(label);
  div.append(innerDiv);
  div.append(priorityIcon);

  checkbox.addEventListener("change", function () {
    toggleTaskDone(task);
    checkIsDone(task);

    localStorage.setItem("tasks", JSON.stringify(tasksList));
  });

  priorityIcon.addEventListener("click", function () {
    toggleTaskImportance(task);
    checkIsImportant(task);
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  });

  taskContainer.append(div);
  checkIsDone(task);
  checkIsImportant(task);
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

const openList = (contentId, listId) => {
  //listContent and lists is an HTMLCollection and HTMLCollections do not have the forEach() method.
  //HTMLCollection can be used with the spread operator.
  let listContent = document.getElementsByClassName("list-content");
  [...listContent].forEach((list) => (list.style.display = "none"));

  let lists = document.getElementsByClassName("list");
  [...lists].forEach((list) => {
    list.classList.remove("active");
  });

  document.getElementById(contentId).style.display = "block";

  let currentList = document.getElementById(listId);
  currentList.classList.add("active");
};

listToday.addEventListener("click", () =>
  openList("today-content", "today-list")
);
listImportant.addEventListener("click", () =>
  openList("important-content", "important-list")
);

//To show Today list on page load
document.getElementById("today-list").click();

form.addEventListener("submit", addTask);
