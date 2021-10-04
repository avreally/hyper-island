import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-form__input");
const listForm = document.querySelector(".add-list-form");
const listInput = document.querySelector(".add-list-form__input");

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

const taskFactory = (title, listId) => {
  let isDone = false;
  let isImportant;

  if (listId === "102") {
    isImportant = true;
  } else {
    isImportant = false;
  }

  const creationDate = formatISO(Date.now());
  const taskId = uuidv4();
  return { title, isDone, isImportant, creationDate, taskId };
};

//TODO find index function (replace taskID and other to id)?

const toggleTaskDone = (task) => {
  // Finding a list in array of lists and it's index first
  let currentList = document.querySelector(".active");
  let listId = currentList.id;
  let listIndex = listOfLists.findIndex((list) => list.listId === listId);

  // then finding a task there
  let id = task.taskId;

  //TODO Finding index (create separate function bc I use it 3 times?)
  let index = listOfLists[listIndex].listTasks.findIndex(
    (task) => task.taskId === id
  );
  listOfLists[listIndex].listTasks[index].isDone =
    !listOfLists[listIndex].listTasks[index].isDone;
};

const checkIsDone = (task) => {
  let id = task.taskId;
  let checkbox = document.getElementById(id);
  let icon = document.getElementById(`icon-${id}`);

  if (task.isDone) {
    checkbox.setAttribute("checked", "");
    icon.classList.add("task__priority-icon-important");
  } else {
    icon.classList.remove("task__priority-icon-important");
  }
};

const toggleTaskImportance = (task) => {
  //Finding a list in array of lists first
  let currentList = document.querySelector(".active");
  let listId = currentList.id;
  let listIndex = listOfLists.findIndex((list) => list.listId === listId);

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
  let li = document.createElement("li");
  li.classList.add("task");

  let innerDiv = document.createElement("div");
  innerDiv.classList.add("task__main-part");

  let label = document.createElement("label");
  label.textContent = task.title;
  label.setAttribute("for", id);
  label.setAttribute("class", "task__main-part__label");

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", id);
  checkbox.setAttribute("class", "task__main-part__checkbox");

  let priorityIcon = document.createElement("button");
  priorityIcon.innerHTML = "☆";
  priorityIcon.setAttribute("class", "task__priority-icon");
  priorityIcon.setAttribute("id", `icon-${id}`);

  innerDiv.append(checkbox);
  innerDiv.append(label);

  li.append(innerDiv);
  li.append(priorityIcon);

  if (listId) {
    let ul = document.querySelector(`#content-${listId}`).lastChild;
    ul.append(li);
    document.querySelector(`#content-${listId}`).append(ul);
  } else {
    let ul = document.querySelector(".activeContent").lastChild;
    ul.append(li);
    document.querySelector(".activeContent").append(ul);
  }

  checkbox.addEventListener("change", function () {
    toggleTaskDone(task);
    checkIsDone(task);

    localStorage.setItem("lists", JSON.stringify(listOfLists));
  });

  priorityIcon.addEventListener("click", function () {
    toggleTaskImportance(task);
    checkIsImportant(task);
    localStorage.setItem("lists", JSON.stringify(listOfLists));
  });

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
  listTitle.setAttribute("class", "list-content__title");
  listTitle.innerHTML = list.listTitle;

  //Adding ul for tasks to store
  let ul = document.createElement("ul");
  ul.setAttribute("class", "tasks-list");

  content.append(listTitle);
  content.append(ul);

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
openList("content-101", "101");

listOfLists.forEach((list) => {
  list.listTasks.forEach((task) => {
    appendTaskToDOM(task, list.listId);
  });
});

const addTask = (event) => {
  event.preventDefault();
  let title = input.value;

  let currentList = document.querySelector(".active");
  let id = currentList.id;

  let newTask = taskFactory(title, id);

  //TODO Finding index (create separate function bc I use it twice?)
  let index = listOfLists.findIndex((list) => list.listId === id);
  listOfLists[index].listTasks.push(newTask);
  //------

  form.reset();

  localStorage.setItem("lists", JSON.stringify(listOfLists));

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

// Event listener to add new task
form.addEventListener("submit", addTask);

// Event listener to add new list
listForm.addEventListener("submit", addList);
