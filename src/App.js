import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");
const todayContainer = document.querySelector(".today-container");
const importantContainer = document.querySelector(".important-container");
const listToday = document.getElementById("today-list");
const listImportant = document.getElementById("important-list");

const listForm = document.querySelector(".add-list-form");
const listInput = document.querySelector(".add-list-input");

// Array of lists
let listOfLists = [
  { listTitle: "Today", listId: 1, listTasks: [] },
  { listTitle: "Important", listId: 2, listTasks: [] },
];

localStorage.setItem("lists", JSON.stringify(listOfLists));

// Lists factory function
const listFactory = (listTitle) => {
  const listId = uuidv4();
  let listTasks = [];
  return { listTitle, listId, listTasks };
};
//------

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

  if (!task.isImportant) {
    todayContainer.append(div);
  } else {
    importantContainer.append(div);
  }

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

// Function for rendering new list
const appendListToDOM = (list) => {
  let button = document.createElement("button");
  button.setAttribute("class", "list");
  button.setAttribute("id", list.listId);
  button.innerHTML = list.listTitle;

  let content = document.createElement("div");
  content.setAttribute("class", "list-content");
  content.setAttribute("id", `${list.listId}-content`);
  content.style.display = "none";

  let listTitle = document.createElement("h1");
  listTitle.setAttribute("class", "title");
  listTitle.innerHTML = list.listTitle;

  let tasksContainer = document.createElement("div");
  tasksContainer.setAttribute("class", `${list.listTitle}-container`);

  content.append(listTitle);
  content.append(tasksContainer);

  document.querySelector(".list-page").append(content);

  button.addEventListener("click", () =>
    openList(`${list.listId}-content`, list.listId)
  );

  document.querySelector(".all-lists").append(button);
};
//------

// Form to add list
const addList = (event) => {
  event.preventDefault();
  let listTitle = listInput.value;

  let newList = listFactory(listTitle);
  listOfLists.push(newList);

  listForm.reset();

  localStorage.setItem("lists", JSON.stringify(listOfLists));
  appendListToDOM(newList);
};
//------

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

// Tabs of lists on the sidebar
listToday.addEventListener("click", () =>
  openList("today-content", "today-list")
);
listImportant.addEventListener("click", () =>
  openList("important-content", "important-list")
);

//To show Today list on page load
document.getElementById("today-list").click();

form.addEventListener("submit", addTask);

// Event listener to add new list
listForm.addEventListener("submit", addList);
