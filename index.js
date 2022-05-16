const fs = require("fs");
const readline = require("readline");
const PATH_TXT_TASK = "./text-files/task.txt";
const PATH_TXT_COMPLETED = "./text-files/completed.txt";
const spawn = require("child_process").spawn;
const sort = spawn("sort", ["-k1,1", PATH_TXT_TASK]);
const sort2 = spawn("sort", ["-k1,1", PATH_TXT_COMPLETED]);

let n = 0;
let m = 0;
let pending = [];
let completed = [];
let command = process.argv[2];

switch (command) {
  case "help":
    usage();
    break;
  case "ls":
    listAllPending();
    break;
  case "add":
    add();
    break;
  case "del":
    del();
    break;
  case "done":
    done();
    break;
  case "report":
    report();
    break;
  default:
    usage();
    break;
}

function usage() {
  console.log(`
Usage :-
> ./todolist add 2 "your item"
# Add a new item with priority "2" and item {"your item"} to the list.

> ./todolist ls
# Show incomplete priority list items sorted by priority in ascending order.

> ./todolist done INDEX
# Mark the incomplete item with the given index as complete.

> ./todolist del INDEX
# Delete the incomplete item with the given index.

> ./todolist help
# Show help.

>./todolist report
# Get report of complete and incomplete items.
`);
}

function add() {
  let priority = process.argv[3];
  let task = process.argv[4];

  if (task == undefined) {
    console.error("Error: Missing tasks string. Nothing added!");
    return;
  } else if (priority == undefined || isNaN(priority)) {
    console.error("priority must be number");
    return;
  } else if (priority < 0) {
    console.error("priority cant be less than 0");
    return;
  }

  var logger = fs.createWriteStream(PATH_TXT_TASK, {
    flags: "a",
  });

  logger.write("[" + priority + "]" + " " + task + "\n");
  console.log('Added task: "' + task + '" with priority [' + priority + "]");
}

function listAllPending() {
  let n = 0;
  sort.stdout.on("data", function (data) {
    const logger = fs.createWriteStream(PATH_TXT_TASK, {
      flags: "w",
    });

    data
      .toString()
      .split("\n")
      .forEach((record) => {
        if (record.length != 0) {
          n++;
          logger.write(record + "\n");
          console.info(
            `${n}. ${record.slice(4, record.length)} ${record.slice(0, 3)}`
          );
        }
      });
  });
  sort.on("exit", function (e) {
    if (e) {
      console.log("There are no pending tasks!");
    }
  });
}

function done() {
  let index = process.argv[3];
  let n = 0;
  let taskCompleted = "a";

  if (index == undefined || isNaN(index)) {
    console.error("Error: Missing NUMBER for marking tasks as done.");
    return;
  } else if (index <= 0) {
    console.error("Error: no incomplete item with index #0 exists.");
    return;
  }

  sort.stdout.on("data", function (data) {
    const logger = fs.createWriteStream(PATH_TXT_TASK, {
      flags: "w",
    });
    data
      .toString()
      .split("\n")
      .forEach((record) => {
        if (record) {
          n++;
          if (n == index) {
            taskCompleted = record;
          } else {
            logger.write(record + "\n");
          }
        }
      });
  });

  sort.on("exit", function (e) {
    if (e) {
      console.log(e);
    }
    if (n < index) {
      console.log("no incomplete item with INDEX [" + index + "] exists.");
    } else {
      fs.createWriteStream(PATH_TXT_COMPLETED, {
        flags: "a",
      }).write(taskCompleted + "\n");
      console.log("Marked item as done.");
    }
  });
}

function del() {
  let index = process.argv[3];
  let n = 0;

  if (index == undefined || isNaN(index)) {
    console.error("Error: Missing INDEX for deleting tasks.");
    return;
  } else if (index <= 0) {
    console.error(
      "Error: task with INDEX [0] does not exist, Nothing deleted."
    );
    return;
  }

  sort.stdout.on("data", function (data) {
    const logger = fs.createWriteStream(PATH_TXT_TASK, {
      flags: "w",
    });
    data
      .toString()
      .split("\n")
      .forEach((record) => {
        if (record) {
          n++;
          if (n == index) {
          } else {
            logger.write(record + "\n");
          }
        }
      });
  });
  sort.on("exit", function (err) {
    if (err) {
      console.error(err);
    }
    if (n < index) {
      console.error(
        "Error: task with INDEX [" +
          index +
          "] does not exist, Nothing deleted."
      );
    } else {
      console.log("Deleted task with INDEX [" + index + "].");
    }
  });
}

function report() {
  const file = readline.createInterface({
    input: fs.createReadStream(PATH_TXT_TASK),
    output: process.stdout,
    terminal: false,
  });
  file.on("line", (record) => {
    n++;
    pending.push(record);
  });
  const file2 = readline.createInterface({
    input: fs.createReadStream(PATH_TXT_COMPLETED),
    output: process.stdout,
    terminal: false,
  });
  file2.on("line", (line) => {
    m++;
    completed.push(line);
  });

  setTimeout(function () {
    console.log("\nPending : " + n);
    for (let i = 0; i < pending.length; i++) {
      console.info(
        `${i + 1}. ${pending[i].slice(4, pending[i].length)} ${pending[i].slice(
          0,
          3
        )}`
      );
    }
    console.log("\nCompleted : " + m);
    for (let j = 0; j < completed.length; j++) {
      console.info(`${j + 1}. ${completed[j].slice(4, completed[j].length)}`);
    }
  }, 15);
}
