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
> ./todolist add 2 your item
# Add a new item with priority "2" and item {your item} to the list.

> ./todolist ls
# Show incomplete priority list items sorted by priority in ascending order.

> ./todolist done INDEX
# Mark the incomplete item with the given index as complete.

> ./todolist del INDEX
# Delete the incomplete item with the given index.

> ./todolist help
# Show help.

>./todolist report
# Statistics.
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
