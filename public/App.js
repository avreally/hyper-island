// console.log("test");

const form = document.querySelector(".add-task-form");
const input = document.querySelector(".add-task-input");

const taskFactory = (title) => {
  const isDone = false;
  return { title, isDone };
};

const addedTask = (event) => {
  event.preventDefault();
  let title = input.value;
  console.log("submitted", "title is", title);
  let newTask = taskFactory(title);
  console.log("new task", newTask);
};

form.addEventListener("submit", addedTask);
