const fs = require("fs");
const readline = require("readline");
const PATH_TXT_TASK = ".text-files/task.txt";
const PATH_TXT_COMPLETED = ".text-files/completed.txt";
const spawn = require("child_process").spawn;
const sort = spawn("sort", ["-k1,1", PATH_TXT_TASK]);
const sort2 = spawn("sort", ["-k1,1", PATH_TXT_COMPLETED]);

let n = 0;
let m = 0;
let pending = [];
let completed = [];

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
