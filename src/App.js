import { formatISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import "./styles/style.css";
import "./styles/tasks.css";
import "./styles/lists.css";

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
// ------

const taskFactory = (title) => {
  let isDone = false;
  let isImportant = false;

  const creationDate = formatISO(Date.now());
  const taskId = uuidv4();
  return { title, isDone, isImportant, creationDate, taskId };
};

const toggleTaskDone = (task) => {
  const id = task.taskId;
  let listId;
  let foundTask;

  listOfLists.forEach((list) => {
    list.listTasks.forEach((task) => {
      if (task.taskId === id) {
        listId = list.listId;
        foundTask = task;
      }
    });
  });

  foundTask.isDone = !foundTask.isDone;
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
  const id = task.taskId;

  let listId;
  let foundTask;

  listOfLists.forEach((list) => {
    list.listTasks.forEach((task) => {
      if (task.taskId === id) {
        listId = list.listId;
        foundTask = task;
      }
    });
  });

  foundTask.isImportant = !foundTask.isImportant;
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

const deleteTask = (task) => {
  const id = task.taskId;
  listOfLists.forEach((list) => {
    list.listTasks = list.listTasks.filter((task) => {
      return task.taskId !== id;
    });
  });
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

  let iconsDiv = document.createElement("div");
  iconsDiv.setAttribute("class", "task__icons");

  let priorityIcon = document.createElement("button");
  priorityIcon.innerHTML = "☆";
  priorityIcon.setAttribute("class", "task__priority-icon");
  priorityIcon.setAttribute("id", `icon-${id}`);

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML =
    "<img src='icons/trash-alt-regular.svg' height='18px' alt='delete-icon' />";
  deleteButton.setAttribute("class", "task__delete-button");

  innerDiv.append(checkbox);
  innerDiv.append(label);

  iconsDiv.append(priorityIcon);
  iconsDiv.append(deleteButton);

  li.append(innerDiv);
  li.append(iconsDiv);

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
    openList(`content-${listId}`, listId);
  });

  priorityIcon.addEventListener("click", function () {
    toggleTaskImportance(task);
    checkIsImportant(task);
    localStorage.setItem("lists", JSON.stringify(listOfLists));
    openList(`content-${listId}`, listId);
  });

  deleteButton.addEventListener("click", function () {
    deleteTask(task);
    localStorage.setItem("lists", JSON.stringify(listOfLists));
    openList(`content-${listId}`, listId);
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

  let listTitleContainer = document.createElement("div");
  listTitleContainer.setAttribute("class", "list-content__title-container");

  let listTitle = document.createElement("h2");
  listTitle.setAttribute("class", "list-content__title");
  listTitle.innerHTML = list.listTitle;

  let deleteListButton = document.createElement("button");
  // deleteListButton.innerHTML = (
  //   <svg
  //     aria-hidden="true"
  //     focusable="false"
  //     data-prefix="far"
  //     data-icon="trash-alt"
  //     className="svg-inline--fa fa-trash-alt fa-w-14"
  //     role="img"
  //     xmlns="http://www.w3.org/2000/svg"
  //     viewBox="0 0 448 512"
  //   >
  //     <path
  //       fill="#990ed7"
  //       d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
  //     ></path>
  //   </svg>
  // );
  deleteListButton.setAttribute("class", "delete-list-button");

  // Adding ul for tasks to store
  let ul = document.createElement("ul");
  ul.setAttribute("class", "tasks-list");

  listTitleContainer.append(listTitle);
  listTitleContainer.append(deleteListButton);

  content.append(listTitleContainer);
  content.append(ul);

  document.querySelector(".list-page").append(content);

  button.addEventListener("click", () => {
    openList(`content-${list.listId}`, list.listId);
  });

  document.querySelector(".all-lists").append(button);
};
// ------

const openList = (contentId, listId) => {
  let tasksListElements = document.getElementsByClassName("tasks-list");
  for (const tasksListElement of tasksListElements) {
    tasksListElement.innerHTML = "";
  }

  // Check importance of tasks and push them to separate array
  if (listId === "102") {
    let importantTasks = [];

    listOfLists.forEach((list) =>
      list.listTasks.forEach((task) => {
        if (task.isImportant === true) {
          importantTasks.push(task);
        }
      })
    );

    importantTasks.forEach((task) => {
      appendTaskToDOM(task, listId);
    });

    form.style.display = "none";
  } else {
    const foundList = listOfLists.find((list) => {
      return list.listId === listId;
    });
    foundList.listTasks.forEach((task) => {
      appendTaskToDOM(task, listId);
    });
    form.style.display = "flex";
  }

  // listContent and lists is an HTMLCollection and HTMLCollections do not have the forEach() method.
  // HTMLCollection can be used with the spread operator.
  let listContent = document.getElementsByClassName("list-content");
  [...listContent].forEach((list) => {
    list.style.display = "none";
    list.classList.remove("activeContent");
  });

  let lists = document.getElementsByClassName("list");
  [...lists].forEach((list) => {
    list.classList.remove("active");
  });

  document.getElementById(contentId).style.display = "flex";
  document.getElementById(contentId).classList.add("activeContent");

  let currentList = document.getElementById(listId);
  currentList.classList.add("active");
};

listOfLists.forEach((list) => {
  appendListToDOM(list);
});

// To show Today list on page load
openList("content-101", "101");

const addTask = (event) => {
  event.preventDefault();
  let title = input.value;

  let currentList = document.querySelector(".active");
  let id = currentList.id;

  let newTask = taskFactory(title, id);

  let index = listOfLists.findIndex((list) => list.listId === id);
  listOfLists[index].listTasks.push(newTask);
  //------

  form.reset();

  localStorage.setItem("lists", JSON.stringify(listOfLists));

  // Added ID below
  appendTaskToDOM(newTask, id);
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
// ------

// Event listener to add new task
form.addEventListener("submit", addTask);

// Event listener to add new list
listForm.addEventListener("submit", addList);
