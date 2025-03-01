import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";

const STORAGE_KEY = "board";

export const boardService = {
  query,
  getById,
  create,
  update,
  remove,
  addBoardMsg,
  saveTask,
  removeTask,
  saveGroup,
  removeGroup,
  saveStatusPicker,
};
window.cs = boardService;

// localStorage.clear()
// _createBoards()

async function query(filterBy = { status: "", title: "" }) {
  let boards = utilService.loadFromStorage(STORAGE_KEY);
  if (!boards || !boards.length) {
    _createBoards();
  }

  boards = await storageService.query(STORAGE_KEY);

  // for now... will be in the backend
  boards = boards.map((board) => ({
    _id: board._id,
    title: board.title,
    numOfGroups: board.groups?.length
  }))
  
  // if (filterBy.txt) {
  //     const regex = new RegExp(filterBy.txt, 'i')
  //     boards = boards.filter(board => regex.test(car.vendor) || regex.test(car.description))
  // }
  return boards;
}

async function getById(boardId) {
  return storageService.get(STORAGE_KEY, boardId);
}

async function remove(boardId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, boardId);
}

async function create(boardTitle) {
  const newBoard = getEmptyBoard()
  newBoard.createdBy = userService.getLoggedinUser(); //at back - no need
  newBoard.title = boardTitle;

  const savedBoard = await storageService.post(STORAGE_KEY, newBoard);
  
  return savedBoard;
}

async function update(board) {
  const savedBoard = await storageService.put(STORAGE_KEY, board);
  return savedBoard;
}

function getGroupFromBoardById(board, groupId) {
  return board.groups.find((group) => group.id === groupId);
}

async function saveTask(board, groupId, task, activity) {
  
  // if there is not specific group -> add to first group
  var groupToAddTaskTo = board.groups[0];

  // if there is specific group -> add according to groupId
  if (groupId) {
    groupToAddTaskTo = getGroupFromBoardById(board, groupId);
  }

  // check if it is an update
  if (task && task.id) {
    const tasks = groupToAddTaskTo.tasks.map((existTask) => {
      return existTask.id === task.id ? task : existTask;
    });
    groupToAddTaskTo = { ...groupToAddTaskTo, tasks: tasks };
  } else {
    task.id = utilService.makeId();
    groupToAddTaskTo.tasks.push(task);
  }

  board.groups = board.groups.map((g) => (g.id === groupToAddTaskTo.id ? groupToAddTaskTo : g));

  // board = saveGroup(board, null, groupToAddTaskTo, activity)
  return board;
}

async function removeTask(board, groupId, taskId, activity) {
  let group = getGroupFromBoardById(board, groupId);
  const filteredTasks = group.tasks.filter(
    (existTask) => existTask.id !== taskId
  );
  group = { ...group, tasks: filteredTasks };

  board.groups = board.groups.map((g) => (g.id === group.id ? group : g));

  // board.activities.unshift(activity)
  return board;
}

async function removeGroup(board, groupId, activity) {
  const filteredGroups = board.groups.filter((g) => g.id !== groupId);
  board = { ...board, groups: filteredGroups };
  // board.activities.unshift(activity)
  return board;
}

async function saveGroup(board, index = null, group, activity) {
  // if new group
  if (index === 0) {
    board.groups.unshift(group);
  } else if (index > 0) {
    board.groups.push(group);
  } else if (!index) {
    //if update
    board.groups = board.groups.map((g) => (g.id === group.id ? group : g));
  }
  // board.activities.unshift(activity)
  return board;
}

async function saveStatusPicker(board, statusPicker) {
  board.statusPicker = statusPicker;
  return board;
}

async function addBoardMsg(boardId, txt) {
  // Later, this is all done by the backend
  const board = await getById(boardId);
  if (!board.msgs) board.msgs = [];

  const msg = {
    id: utilService.makeId(),
    by: userService.getLoggedinUser(),
    txt,
  };
  board.msgs.push(msg);
  await storageService.put(STORAGE_KEY, board);

  return msg;
}

// function getEmptyTask(){
//     return {
//         "id": "",
//         "title": "New Task",
//         "status": "",
//         "priority": "",
//     }
// }

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))

export function getEmptyGroup() {
  return {
    id: utilService.makeId(),
    title: "New Group",
    archivedAt: 1589983468418,
    tasks: [],
    style: utilService.getRandomColor(),
  };
}

export function getEmptyBoard() {
  return {
    _id: "",
    title: "New board",
    isStarred: false,
    archivedAt: 1589983468418,
    createdBy: {
      _id: "",
      fullname: "",
      imgUrl: "",
    },
    members: [
      {
        _id: "u101",
        fullname: "Sapir Teper",
        imgUrl: "",
      },
      {
        _id: "u102",
        fullname: "Nofar Melamed",
        imgUrl: "",
      },
      {
        _id: "u103",
        fullname: "Adi Marom",
        imgUrl: "",
      },
    ],
    groups: [getEmptyGroup()],
    cmpsOrder: ["people", "status", "priority","timeLine"],
    statusPicker: [
      { label: "Done", backgroundColor: " rgb(0, 200, 117)" },
      { label: "Working on it", backgroundColor: "rgb(253, 171, 61)" },
      { label: "Stuck", backgroundColor: "rgb(226, 68, 92)" },
      { label: "Not Started", backgroundColor: "rgb(196, 196, 196)" },
    ],
    priorityPicker: [
      { label: "Critical ⚠", backgroundColor: "rgb(51, 51, 51)" },
    { label: "High", backgroundColor: "rgb(64, 22, 148)" },
    { label: "Medium", backgroundColor: "rgb(85, 89, 223)" },
    { label: "Low", backgroundColor: "rgb(87, 155, 252)" },
    { label: "", backgroundColor: "rgb(196, 196, 196)" },
  ],
  };
}




function _createBoards() {
  // let boards = utilService.loadFromStorage(STORAGE_KEY)
  // if (!boards || !boards.length){
  var boards = [
    {
      _id: utilService.makeId(),
      title: "Team Sunday: 17 - 21/3",
      isStarred: false,
      archivedAt: 1589983468418,
      createdBy: {
        _id: "",
        fullname: "",
        imgUrl: "",
      },
      members: [
        {
          _id: "u101",
          fullname: "Sapir Teper",
          imgUrl: "",
        },
        {
          _id: "u102",
          fullname: "Nofar Melamed",
          imgUrl: "",
        },
        {
          _id: "u103",
          fullname: "Adi Marom",
          imgUrl: "",
        },
      ],
      groups: [
        {
          id: utilService.makeId(),
          title: "Development",
          archivedAt: 1589983468418,
          tasks: [
            {
              id: utilService.makeId(),
              title: "add page navigation",
              people: "u103",
              status: "Stuck",
              priority: "Low",
              timeLine:{
                from: 'Sun Feb 10 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Apr 3 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "add edit options",
              people: "u103",
              status: "Stuck",
              priority: "Low",
              timeLine:{
                from: 'Sun Feb 14 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Apr 9 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "sticky Title",
              people: "u101",
              status: "Working on it",
              priority: "High",
              timeLine:{
                from: 'Sun Mar 17 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 20 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "add Contact Page",
              people: "u101",
              status: "Working on it",
              priority: "High",
              timeLine:{
                from: 'Sun Mar 18 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 22 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "improve Tool Bar navigation",
              people: "u103",
              status: "Stuck",
              priority: "Critical",
              timeLine:{
                from: 'Sun Mar 18 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 22 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "drag and drop",
              people: "u101",
              status: "Done",
              priority: "Critical",
              timeLine:{
                from: 'Sun Mar 17 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 19 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "design task table",
              people: "u101",
              status: "Done",
              priority: "Critical",
              timeLine:{
                from: 'Sun Mar 17 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 20 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "add members column to table",
              people: "u101",
              status: "Done",
              priority: "Medium",
              timeLine:{
                from: 'Sun Mar 17 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 21 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            }
          ],
          style: utilService.getRandomColor(),
        },
        {
          id: utilService.makeId(),
          title: "QA Tests",
          archivedAt: 1589983468418,
          tasks: [
            {
              id: utilService.makeId(),
              title: "Chat information",
              people: "",
              status: "Done",  // put id 
              priority: "High", // put id 
              timeLine:{
                from: 'Sun Mar 21 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 26 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
              
            },
            {
              id: utilService.makeId(),
              title: "Sign-in tests",
              people: "",
              status: "Working on it",
              priority: "Medium",
              timeLine: {
                from: 'Sun Mar 20 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 27 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
          ],
          style: utilService.getRandomColor(),
        },
        {
          id: utilService.makeId(),
          title: "Bugs",
          archivedAt: 1589983468418,
          tasks: [
            {
              id: utilService.makeId(),
              title: "flicker when new task is added",
              people: "u102",
              status: "Working on it",  // put id 
              priority: "Critical", // put id 
              timeLine:{
                from: 'Sun Mar 24 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Thu Mar 28 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
              
            },
            {
              id: utilService.makeId(),
              title: "filter task does not work",
              people: "u102",
              status: "Working on it",
              priority: "High",
              timeLine: {
                from: 'Sun Mar 24 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 28 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
          ],
          style: utilService.getRandomColor(),
        }
      ],
      cmpsOrder: ["people", "status", "priority", "timeLine"],
      statusPicker: [
        { label: "Done", backgroundColor: " rgb(0, 200, 117)" },
        { label: "Working on it", backgroundColor: "rgb(253, 171, 61)" },
        { label: "Stuck", backgroundColor: "rgb(226, 68, 92)" },
        { label: "Not Started", backgroundColor: "rgb(196, 196, 196)" },
      ],
      priorityPicker: [
        { label: "Critical", backgroundColor: "rgb(51, 51, 51)" },
        { label: "High", backgroundColor: "rgb(64, 22, 148)" },
        { label: "Medium", backgroundColor: "rgb(85, 89, 223)" },
        { label: "Low", backgroundColor: "rgb(87, 155, 252)" },
        // { label: "", backgroundColor: "rgb(196, 196, 196)" },
      ],
    },
    {
      _id: utilService.makeId(),
      title: "UI Team Sunday",
      isStarred: false,
      archivedAt: 1589983468418,
      createdBy: {
        _id: "",
        fullname: "",
        imgUrl: "",
      },
      members: [
        {
          _id: "u101",
          fullname: "Sapir Teper",
          imgUrl: "",
        },
        {
          _id: "u102",
          fullname: "Nofar Melamed",
          imgUrl: "",
        },
        {
          _id: "u103",
          fullname: "Adi Marom",
          imgUrl: "",
        },
      ],

      groups: [
        {
          id: utilService.makeId(),
          title: "UI",
          archivedAt: 1589983468418,
          tasks: [
            {
              id: utilService.makeId(),
              title: "Change HomePage - first part",
              people: "u101",
              priority: "Critical",
              status: "Stuck",
              timeLine:{
                from: 'Sun Mar 17 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 20 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "Add fonts to sccs files",
              people: "u101",
              priority: "Low",
              status: "Working on it",
              timeLine:{
                from: 'Sun Mar 13 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 18 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "change padding buttons",
              people: "u102",
              priority: "Medium",
              status: "Done",
              timeLine:{
                from: 'Sun Mar 21 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 26 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            }
          ],
          style: utilService.getRandomColor(),
        },
      ],
      // 
      cmpsOrder: ["people", "status", "priority", "timeLine"],
      statusPicker: [
        { label: "Done", backgroundColor: "rgb(0, 200, 117)" },
        { label: "Working on it", backgroundColor: "rgb(253, 171, 61)" },
        { label: "Stuck", backgroundColor: "rgb(226, 68, 92)" },
        { label: "Not Started", backgroundColor: "rgb(196, 196, 196)" },
      ],
      priorityPicker: [
        { label: "Critical", backgroundColor: "rgb(51, 51, 51)" },
        { label: "High", backgroundColor: "rgb(64, 22, 148)" },
        { label: "Medium", backgroundColor: "rgb(85, 89, 223)" },
        { label: "Low", backgroundColor: "rgb(87, 155, 252)" },
        // { label: "", backgroundColor: "rgb(196, 196, 196)" },
      ],
    },
    {
      _id: utilService.makeId(),
      title: "Test",
      isStarred: false,
      archivedAt: 1589983468418,
      createdBy: {
        _id: "",
        fullname: "",
        imgUrl: "",
      },
      members: [
        {
          _id: "u101",
          fullname: "Sapir Teper",
          imgUrl: "",
        },
        {
          _id: "u102",
          fullname: "Nofar Melamed",
          imgUrl: "",
        },
        {
          _id: "u103",
          fullname: "Adi Marom",
          imgUrl: "",
        },
      ],

      groups: [
        {
          id: utilService.makeId(),
          title: "Test",
          archivedAt: 1589983468418,
          tasks: [
            {
              id: utilService.makeId(),
              title: "unit test",
              people: "",
              priority: "Critical",
              status: "",
              timeLine:{
                from: 'Sun Mar 17 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 20 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
            {
              id: utilService.makeId(),
              title: "another test",
              people: "",
              priority: "Low",
              status: "",
              timeLine:{
                from: 'Sun Mar 13 2024 00:00:00 GMT+0200 (Israel Standard Time)',
                to: 'Sat Mar 18 2024 00:00:00 GMT+0300 (Israel Daylight Time)'
              }
            },
          ],
          style: utilService.getRandomColor(),
        },
      ],
      // 
      cmpsOrder: ["people", "status", "priority", "timeLine"],
      statusPicker: [
        { label: "Done", backgroundColor: "rgb(0, 200, 117)" },
        { label: "Working on it", backgroundColor: "rgb(253, 171, 61)" },
        { label: "Stuck", backgroundColor: "rgb(226, 68, 92)" },
        { label: "Not Started", backgroundColor: "rgb(196, 196, 196)" },
      ],
      priorityPicker: [
        { label: "Critical", backgroundColor: "rgb(51, 51, 51)" },
        { label: "High", backgroundColor: "rgb(64, 22, 148)" },
        { label: "Medium", backgroundColor: "rgb(85, 89, 223)" },
        { label: "Low", backgroundColor: "rgb(87, 155, 252)" },
        // { label: "", backgroundColor: "rgb(196, 196, 196)" },
      ],
    },
  ];

  // }
  utilService.saveToStorage(STORAGE_KEY, boards);
  
}


const user = {
  "_id": "u101",
  "fullname": "Sapir Teper",
  "username": "Sapir@ababmi.com",
  "password": "Sapir123",
  "imgUrl": "http://some-img.jpg",
  "mentions": [{ //optional
      "id": "m101",
      "boardId": "m101",
      "taskId": "t101"
  }]
}