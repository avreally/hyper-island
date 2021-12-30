(() => {
  // node_modules/date-fns/esm/_lib/requiredArgs/index.js
  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
    }
  }

  // node_modules/date-fns/esm/toDate/index.js
  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
      return new Date(argument.getTime());
    } else if (typeof argument === "number" || argStr === "[object Number]") {
      return new Date(argument);
    } else {
      if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
        console.warn(new Error().stack);
      }
      return new Date(NaN);
    }
  }

  // node_modules/date-fns/esm/isValid/index.js
  function isValid(dirtyDate) {
    requiredArgs(1, arguments);
    var date = toDate(dirtyDate);
    return !isNaN(date);
  }

  // node_modules/date-fns/esm/_lib/addLeadingZeros/index.js
  function addLeadingZeros(number, targetLength) {
    var sign = number < 0 ? "-" : "";
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = "0" + output;
    }
    return sign + output;
  }

  // node_modules/date-fns/esm/formatISO/index.js
  function formatISO(dirtyDate, dirtyOptions) {
    if (arguments.length < 1) {
      throw new TypeError("1 argument required, but only ".concat(arguments.length, " present"));
    }
    var originalDate = toDate(dirtyDate);
    if (!isValid(originalDate)) {
      throw new RangeError("Invalid time value");
    }
    var options = dirtyOptions || {};
    var format = options.format == null ? "extended" : String(options.format);
    var representation = options.representation == null ? "complete" : String(options.representation);
    if (format !== "extended" && format !== "basic") {
      throw new RangeError("format must be 'extended' or 'basic'");
    }
    if (representation !== "date" && representation !== "time" && representation !== "complete") {
      throw new RangeError("representation must be 'date', 'time', or 'complete'");
    }
    var result = "";
    var tzOffset = "";
    var dateDelimiter = format === "extended" ? "-" : "";
    var timeDelimiter = format === "extended" ? ":" : "";
    if (representation !== "time") {
      var day = addLeadingZeros(originalDate.getDate(), 2);
      var month = addLeadingZeros(originalDate.getMonth() + 1, 2);
      var year = addLeadingZeros(originalDate.getFullYear(), 4);
      result = "".concat(year).concat(dateDelimiter).concat(month).concat(dateDelimiter).concat(day);
    }
    if (representation !== "date") {
      var offset = originalDate.getTimezoneOffset();
      if (offset !== 0) {
        var absoluteOffset = Math.abs(offset);
        var hourOffset = addLeadingZeros(Math.floor(absoluteOffset / 60), 2);
        var minuteOffset = addLeadingZeros(absoluteOffset % 60, 2);
        var sign = offset < 0 ? "+" : "-";
        tzOffset = "".concat(sign).concat(hourOffset, ":").concat(minuteOffset);
      } else {
        tzOffset = "Z";
      }
      var hour = addLeadingZeros(originalDate.getHours(), 2);
      var minute = addLeadingZeros(originalDate.getMinutes(), 2);
      var second = addLeadingZeros(originalDate.getSeconds(), 2);
      var separator = result === "" ? "" : "T";
      var time = [hour, minute, second].join(timeDelimiter);
      result = "".concat(result).concat(separator).concat(time).concat(tzOffset);
    }
    return result;
  }

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/regex.js
  var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  // node_modules/uuid/dist/esm-browser/validate.js
  function validate(uuid) {
    return typeof uuid === "string" && regex_default.test(uuid);
  }
  var validate_default = validate;

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  var i;
  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!validate_default(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var stringify_default = stringify;

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return stringify_default(rnds);
  }
  var v4_default = v4;

  // src/App.js
  var form = document.querySelector(".add-task-form");
  var input = document.querySelector(".add-task-form__input");
  var listForm = document.querySelector(".add-list-form");
  var listInput = document.querySelector(".add-list-form__input");
  var listOfLists = localStorage.getItem("lists") ? JSON.parse(localStorage.getItem("lists")) : [
    { listTitle: "Today", listId: "101", listTasks: [] },
    { listTitle: "Important", listId: "102", listTasks: [] }
  ];
  localStorage.setItem("lists", JSON.stringify(listOfLists));
  var listFactory = (listTitle) => {
    const listId = v4_default();
    const listTasks = [];
    return { listTitle, listId, listTasks };
  };
  var taskFactory = (title) => {
    const isDone = false;
    const isImportant = false;
    const creationDate = formatISO(Date.now());
    const taskId = v4_default();
    return { title, isDone, isImportant, creationDate, taskId };
  };
  var toggleTaskDone = (task) => {
    const id = task.taskId;
    let listId;
    let foundTask;
    listOfLists.forEach((list) => {
      list.listTasks.forEach((task2) => {
        if (task2.taskId === id) {
          listId = list.listId;
          foundTask = task2;
        }
      });
    });
    foundTask.isDone = !foundTask.isDone;
  };
  var checkIsDone = (task) => {
    const id = task.taskId;
    const checkbox = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    if (task.isDone) {
      checkbox.setAttribute("checked", "");
      icon.classList.add("task__priority-icon-important");
    } else {
      icon.classList.remove("task__priority-icon-important");
    }
  };
  var toggleTaskImportance = (task) => {
    const id = task.taskId;
    let listId;
    let foundTask;
    listOfLists.forEach((list) => {
      list.listTasks.forEach((task2) => {
        if (task2.taskId === id) {
          listId = list.listId;
          foundTask = task2;
        }
      });
    });
    foundTask.isImportant = !foundTask.isImportant;
  };
  var checkIsImportant = (task) => {
    const id = `icon-${task.taskId}`;
    const icon = document.getElementById(id);
    if (task.isImportant) {
      icon.innerHTML = "\u2605";
    } else {
      icon.innerHTML = "\u2606";
    }
  };
  var deleteTask = (task) => {
    const id = task.taskId;
    listOfLists.forEach((list) => {
      list.listTasks = list.listTasks.filter((task2) => {
        return task2.taskId !== id;
      });
    });
  };
  var deleteList = (list) => {
    const id = list.listId;
    listOfLists = listOfLists.filter((list2) => {
      return list2.listId !== id;
    });
  };
  var appendTaskToDOM = (task, listId) => {
    const id = task.taskId;
    const li = document.createElement("li");
    li.classList.add("task");
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("task__main-part");
    const label = document.createElement("label");
    label.textContent = task.title;
    label.setAttribute("for", id);
    label.setAttribute("class", "task__main-part__label");
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);
    checkbox.setAttribute("class", "task__main-part__checkbox");
    const iconsDiv = document.createElement("div");
    iconsDiv.setAttribute("class", "task__icons");
    const priorityIcon = document.createElement("button");
    priorityIcon.innerHTML = "\u2606";
    priorityIcon.setAttribute("class", "task__priority-icon");
    priorityIcon.setAttribute("id", `icon-${id}`);
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#990ed7" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>';
    deleteButton.setAttribute("class", "task__delete-button");
    innerDiv.append(checkbox);
    innerDiv.append(label);
    iconsDiv.append(priorityIcon);
    iconsDiv.append(deleteButton);
    li.append(innerDiv);
    li.append(iconsDiv);
    if (listId) {
      const ul = document.querySelector(`#content-${listId}`).lastChild;
      ul.append(li);
      document.querySelector(`#content-${listId}`).append(ul);
    } else {
      const ul = document.querySelector(".activeContent").lastChild;
      ul.append(li);
      document.querySelector(".activeContent").append(ul);
    }
    checkbox.addEventListener("change", function() {
      toggleTaskDone(task);
      checkIsDone(task);
      localStorage.setItem("lists", JSON.stringify(listOfLists));
      openList(`content-${listId}`, listId);
    });
    priorityIcon.addEventListener("click", function() {
      toggleTaskImportance(task);
      checkIsImportant(task);
      localStorage.setItem("lists", JSON.stringify(listOfLists));
      openList(`content-${listId}`, listId);
    });
    deleteButton.addEventListener("click", function() {
      deleteTask(task);
      localStorage.setItem("lists", JSON.stringify(listOfLists));
      openList(`content-${listId}`, listId);
    });
    checkIsDone(task);
    checkIsImportant(task);
  };
  var appendListToDOM = (list) => {
    const button = document.createElement("button");
    button.setAttribute("class", "list");
    button.setAttribute("id", list.listId);
    button.innerHTML = list.listTitle;
    const content = document.createElement("div");
    content.setAttribute("class", "list-content");
    content.setAttribute("id", `content-${list.listId}`);
    content.style.display = "none";
    const listTitleContainer = document.createElement("div");
    listTitleContainer.setAttribute("class", "list-content__title-container");
    const listTitle = document.createElement("h2");
    listTitle.setAttribute("class", "list-content__title");
    listTitle.innerHTML = list.listTitle;
    const deleteListButton = document.createElement("button");
    deleteListButton.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#990ed7" d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path></svg>';
    deleteListButton.setAttribute("class", "list-delete-button");
    deleteListButton.addEventListener("click", function() {
      if (window.confirm(`Are you sure you want to delete this list "${list.listTitle}" and all tasks in it?`)) {
        deleteList(list);
        document.getElementById(`${list.listId}`).remove();
        localStorage.setItem("lists", JSON.stringify(listOfLists));
        openList("content-101", "101");
      }
    });
    listTitleContainer.append(listTitle);
    if (list.listId !== "101" && list.listId !== "102") {
      listTitleContainer.append(deleteListButton);
    }
    const ul = document.createElement("ul");
    ul.setAttribute("class", "tasks-list");
    content.append(listTitleContainer);
    content.append(ul);
    document.querySelector(".list-page").append(content);
    button.addEventListener("click", () => {
      openList(`content-${list.listId}`, list.listId);
    });
    document.querySelector(".all-lists").append(button);
  };
  var openList = (contentId, listId) => {
    const tasksListElements = document.getElementsByClassName("tasks-list");
    for (const tasksListElement of tasksListElements) {
      tasksListElement.innerHTML = "";
    }
    if (listId === "102") {
      const importantTasks = [];
      listOfLists.forEach((list) => list.listTasks.forEach((task) => {
        if (task.isImportant === true) {
          importantTasks.push(task);
        }
      }));
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
    const listContent = document.getElementsByClassName("list-content");
    [...listContent].forEach((list) => {
      list.style.display = "none";
      list.classList.remove("activeContent");
    });
    const lists = document.getElementsByClassName("list");
    [...lists].forEach((list) => {
      list.classList.remove("active");
    });
    document.getElementById(contentId).style.display = "flex";
    document.getElementById(contentId).classList.add("activeContent");
    const currentList = document.getElementById(listId);
    currentList.classList.add("active");
  };
  listOfLists.forEach((list) => {
    appendListToDOM(list);
  });
  openList("content-101", "101");
  var addTask = (event) => {
    event.preventDefault();
    let title;
    if (input.value.trim() === "") {
      title = "Untitled task";
    } else {
      title = input.value;
    }
    const currentList = document.querySelector(".active");
    const id = currentList.id;
    const newTask = taskFactory(title, id);
    const index = listOfLists.findIndex((list) => list.listId === id);
    listOfLists[index].listTasks.push(newTask);
    form.reset();
    localStorage.setItem("lists", JSON.stringify(listOfLists));
    appendTaskToDOM(newTask, id);
  };
  var addList = (event) => {
    event.preventDefault();
    let listTitle;
    if (listInput.value.trim() === "") {
      listTitle = "Untitled list";
    } else {
      listTitle = listInput.value;
    }
    const newList = listFactory(listTitle);
    listOfLists.push(newList);
    listForm.reset();
    localStorage.setItem("lists", JSON.stringify(listOfLists));
    appendListToDOM(newList);
  };
  form.addEventListener("submit", addTask);
  listForm.addEventListener("submit", addList);
  var backgroundBlurLayer = document.querySelector(".background-blur");
  var sidebarToggle = document.querySelector("#sidebar-toggle-checkbox");
  var closeSidebarOnBackgroundBlurClick = () => {
    sidebarToggle.checked = false;
  };
  backgroundBlurLayer.addEventListener("click", closeSidebarOnBackgroundBlurClick);
})();
