import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");
// const todayContainer = document.querySelector(".today-container");
// const importantContainer = document.querySelector(".important-container");

const listForm = document.querySelector(".add-list-form");
const listInput = document.querySelector(".add-list-input");

// // Array of lists
// let listOfLists = [
//   { listTitle: "Today", listId: "101", listTasks: [] },
//   { listTitle: "Important", listId: "102", listTasks: [] },
// ];
//
// localStorage.setItem("lists", JSON.stringify(listOfLists));

// Array of lists
let listOfLists = localStorage.getItem("lists")
  ? JSON.parse(localStorage.getItem("lists"))
  : [
      { listTitle: "Today", listId: "101", listTasks: [] },
      { listTitle: "Important", listId: "102", listTasks: [] },
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

// Removed this because I set listOfLists to Local storage at 21 line
// let tasksList = localStorage.getItem("tasks")
//   ? JSON.parse(localStorage.getItem("tasks"))
//   : [];

//TODO find index function (replace taskID and other to id)

// const findIndex = (item, array) => {
//   let id = item.taskId;
//   let index = array.findIndex((task) => task.taskId === id);
//   return index;
// };

const toggleTaskDone = (task) => {
  //Finding a list in array of lists and it's index first
  let currentList = document.querySelector(".active");
  let listId = currentList.id;
  let listIndex = listOfLists.findIndex((list) => list.listId === listId);
  // listOfLists[listIndex];

  //  then finding a task there
  let id = task.taskId;

  //TODO Finding index (create separate function bc I use it 3 times?)
  let index = listOfLists[listIndex].listTasks.findIndex(
    (task) => task.taskId === id
  );
  listOfLists[listIndex].listTasks[index].isDone =
    !listOfLists[listIndex].listTasks[index].isDone;

  // //  How it was
  //   let index = tasksList.findIndex((task) => task.taskId === id);
  //   tasksList[index].isDone = !tasksList[index].isDone;
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
  // //============ How it was
  // let id = task.taskId;
  //
  // //TODO Finding index (create separate function bc I use it twice?)
  // let index = tasksList.findIndex((task) => task.taskId === id);
  // tasksList[index].isImportant = !tasksList[index].isImportant;
  // //============

  //Finding a list in array of lists first
  let currentList = document.querySelector(".active");
  let listId = currentList.id;
  let listIndex = listOfLists.findIndex((list) => list.listId === listId);
  // listOfLists[listIndex];

  //  then finding a task there
  let id = task.taskId;

  //TODO Finding index (create separate function bc I use it 3 times?)
  let index = listOfLists[listIndex].listTasks.findIndex(
    (task) => task.taskId === id
  );
  listOfLists[listIndex].listTasks[index].isImportant =
    !listOfLists[listIndex].listTasks[index].isImportant;
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

const appendTaskToDOM = (task, listId) => {
  let id = task.taskId;
  let div = document.createElement("div");
  div.classList.add("todo-item");
  // console.log("that is div", div);

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

  //new - not working
  // let currentList = document.querySelector(".active");
  // console.log("current list", currentList);
  //
  // let listContentArray = document.getElementsByClassName("list-content");
  // console.log("array", listContentArray);
  // for (let i = 0; i < listContentArray.length; i++) {
  //   if (listContentArray[i].style.display === "block") {
  //     document.querySelector("h1").append(div);
  //     console.log("block");
  //   } else {
  //     console.log("not");
  //   }
  // }
  // let listId = currentList.id;
  // let container = document.querySelector(`.${listId}-container`);
  // console.log("this is container", container);
  // container.append(div);

  //=====

  if (listId) {
    document.querySelector(`#content-${listId}`).append(div);
  } else {
    document.querySelector(".activeContent").append(div);
  }

  checkbox.addEventListener("change", function () {
    toggleTaskDone(task);
    checkIsDone(task);

    // localStorage.setItem("tasks", JSON.stringify(tasksList));
    localStorage.setItem("lists", JSON.stringify(listOfLists));
  });

  priorityIcon.addEventListener("click", function () {
    toggleTaskImportance(task);
    checkIsImportant(task);
    // localStorage.setItem("tasks", JSON.stringify(tasksList));
    localStorage.setItem("lists", JSON.stringify(listOfLists));
  });

  //Removed bc now tasks are added to listOfLists array
  // if (!task.isImportant) {
  //   todayContainer.append(div);
  // } else {
  //   importantContainer.append(div);
  // }

  //TODO Check if I need these two
  checkIsDone(task);
  checkIsImportant(task);
};

// Function for rendering new list
const appendListToDOM = (list) => {
  let button = document.createElement("button");
  button.setAttribute("class", "list");
  button.setAttribute("id", list.listId);
  button.innerHTML = list.listTitle;

  let content = document.createElement("div");
  content.setAttribute("class", "list-content");
  content.setAttribute("id", `content-${list.listId}`);
  content.style.display = "none";

  let listTitle = document.createElement("h1");
  listTitle.setAttribute("class", "title");
  listTitle.innerHTML = list.listTitle;

  //Trying to remove it
  // let tasksContainer = document.createElement("div");
  // tasksContainer.setAttribute("class", `${list.listId}-container`);

  content.append(listTitle);
  // content.append(tasksContainer);

  document.querySelector(".list-page").append(content);

  button.addEventListener("click", () =>
    openList(`content-${list.listId}`, list.listId)
  );

  document.querySelector(".all-lists").append(button);
};
//------

const openList = (contentId, listId) => {
  //listContent and lists is an HTMLCollection and HTMLCollections do not have the forEach() method.
  //HTMLCollection can be used with the spread operator.
  let listContent = document.getElementsByClassName("list-content");
  [...listContent].forEach(
    (list) => (
      (list.style.display = "none"), list.classList.remove("activeContent")
    )
  );

  let lists = document.getElementsByClassName("list");
  [...lists].forEach((list) => {
    list.classList.remove("active");
  });

  document.getElementById(contentId).style.display = "block";
  document.getElementById(contentId).classList.add("activeContent");

  let currentList = document.getElementById(listId);
  currentList.classList.add("active");
};

//TODO change
// tasksList.forEach((task) => {
//   appendTaskToDOM(task);
// });

listOfLists.forEach((list) => {
  appendListToDOM(list);
});

//To show Today list on page load
// document.getElementById("101").click();
openList("content-101", "101");

listOfLists.forEach((list) => {
  list.listTasks.forEach((task) => {
    // console.log("adding task");

    // console.log("task is", task);
    appendTaskToDOM(task, list.listId);
  });
});

const addTask = (event) => {
  event.preventDefault();
  let title = input.value;

  let newTask = taskFactory(title);

  let currentList = document.querySelector(".active");
  let id = currentList.id;

  //TODO Finding index (create separate function bc I use it twice?)
  let index = listOfLists.findIndex((list) => list.listId === id);
  listOfLists[index].listTasks.push(newTask);
  //------

  // tasksList.push(newTask);

  form.reset();

  localStorage.setItem("lists", JSON.stringify(listOfLists));

  // localStorage.setItem("tasks", JSON.stringify(tasksList));
  appendTaskToDOM(newTask);
};

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

// // Tabs of lists on the sidebar
// const listToday = document.getElementById("101");
// // console.log("list today", listToday);
// listToday.addEventListener("click", () => openList("today-content", "101"));
//
// const listImportant = document.getElementById("102");
// listImportant.addEventListener("click", () =>
//   openList("important-content", "102")
// );

// Event listener to add new task
form.addEventListener("submit", addTask);

// Event listener to add new list
listForm.addEventListener("submit", addList);
