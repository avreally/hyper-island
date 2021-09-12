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

  // src/App.js
  var form = document.querySelector(".add-task-form");
  var input = document.querySelector(".add-task-input");
  var taskContainer = document.getElementById("todo-container");
  var taskFactory = (title) => {
    const isDone = false;
    const creationDate = formatISO(Date.now());
    return { title, isDone, creationDate };
  };
  var tasksList = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
  var appendTaskToDOM = (task) => {
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
  var addTask = (event) => {
    event.preventDefault();
    let title = input.value;
    let newTask = taskFactory(title);
    tasksList.push(newTask);
    form.reset();
    localStorage.setItem("tasks", JSON.stringify(tasksList));
    appendTaskToDOM(newTask);
  };
  form.addEventListener("submit", addTask);
})();
