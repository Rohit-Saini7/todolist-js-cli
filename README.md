# todolist-js-cli

- Command line based To Do List.
- Built with JavaScript .
- functionality: `add, done, delete, show, report`.

## Usage (for Linux)

```
./todolist
```

![just filename](images/Screenshot-first.png)

```
./todolist add 2 "your item"
```

Add a new item with priority "2" and item {"your item"} to the list.
![Add item](images/Screenshot-add.png)

```
./todolist ls
```

Show incomplete priority list items sorted by priority in ascending order.
![list items](images/Screenshot-ls.png)

```
./todolist done INDEX
```

Mark the incomplete item with the given index as complete.
![Mark done item](images/Screenshot-done.png)

```
./todolist del INDEX
```

Delete the incomplete item with the given index.
![Delete item](images/Screenshot-del.png)

```
./todolist help
```

Show help.
![Shows help](images/Screenshot-help.png)

```
./todolist report
```

Get report of complete and incomplete items.
![Shows report](images/Screenshot-report.png)

## For windows

edit file `todolist`

```
@echo off
node index.js %1 %2 %3
```
