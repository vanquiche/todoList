const controller = (() => {
// data cotainers
let myList = [];
let listFolder = [];
let activeList = 'main';
// variables
const folderContainer = document.getElementById('folderContainer');
const listContainer = document.getElementById('content');
const addFolderBtn = document.getElementById('newFolder');
const main = document.getElementById('mainFolder');
const addTaskBtn = document.getElementById('newTask');
const dateText = document.getElementById('contentDate');
// form variables
const folderForm = document.getElementById('newFolderForm');
const createFolderBtn = document.getElementById('createFolder');
const cancelFolderBtn = document.getElementById('cancelFolder');
const folderName = document.getElementById('folderName');
const folderDate = document.getElementById('folderDate');
const form = document.getElementById('form');
const formTitle = document.getElementById('formTitle');
const formNote = document.getElementById('formNote');
const formDate = document.getElementById('formDate');
const cancelForm = document.getElementById('cancelForm');

// EVENT LISTENERS
// add new task
addTaskBtn.addEventListener('click', () => {
  form.classList.toggle('visible');
  const submitForm = document.createElement('input');
  submitForm.setAttribute('type', 'submit');
  submitForm.className = 'formBtn';
  submitForm.id = 'submitBtn';
  submitForm.value = 'Save';
  submitForm.addEventListener('click', (event) => {
    if (formTitle.value == '') return;
    event.preventDefault();
    createTask();
    update();
    form.reset();
    form.classList.toggle('visible');
    submitForm.remove();
  });
  form.appendChild(submitForm);
});
// add new folder
addFolderBtn.addEventListener('click', () => {
  newFolderForm.classList.toggle('visible');
});
createFolderBtn.addEventListener('click', (event) => {
  event.preventDefault();
  newFolderForm.classList.toggle('visible');
  listFolder.push({
    name: folderName.value,
    date: folderDate.value,
  });
  newFolder(folderName.value, folderDate.value);
  setFolder();
  folderForm.reset();
});
cancelFolderBtn.addEventListener('click', () => {
  folderForm.reset();
  newFolderForm.classList.toggle('visible');
})
// form buttons
cancelForm.addEventListener('click', () => {
  const submitBtn = document.getElementById('submitBtn');
  const updateBtn = document.getElementById('updateBtn');
  submitBtn === null ? false : submitBtn.remove();
  updateBtn === null ? false : updateBtn.remove();
  form.classList.toggle('visible');
  form.reset();
});
// main folder tab
main.addEventListener('click', (e) => {
  activeList = 'main';
  controlTab(e);
  switchList();
});

// FUNCTIONS
// new task factory function
const newTask = (title, note, complete) => {
  complete = false;
  return {
    title,
    note,
    complete,
  };
};

const removeFolder = (e) => {
  const index = listFolder.indexOf(e.target.id);
  listFolder.splice(index, 1);
  const tab = document.getElementById(e.target.parentNode.id);
  tab.remove();
  localStorage.removeItem(e.target.id);
  setFolder();
};
// add new folder
const newFolder = (title, date) => {
  const newTab = document.createElement('div');
  const remove = document.createElement('p');
  const dueDate = document.createElement('p');
  remove.innerHTML = 'clear';
  remove.className = 'closeout';
  remove.classList.add('material-icons');
  remove.classList.add('md-18');
  remove.id = title;
  remove.addEventListener('click', removeFolder);
  newTab.setAttribute('data-date', `${date}`);
  const duedate = newTab.getAttribute('data-date');
  newTab.id = title + 'folder';
  newTab.innerText = title;
  newTab.className = 'folderTab';
  newTab.classList.add('tabFont');
  newTab.addEventListener('click', (event) => {
    newTab.classList.toggle('tabActive');
    activeList = title;
    controlTab(event);
    switchList();
  });
  dueDate.className = 'dueDate';
  dueDate.innertText = date;
  // appended
  folderContainer.appendChild(newTab);
  newTab.appendChild(remove);
  listContainer.appendChild(dueDate);
};
// add class to active tabs
const controlTab = (event) => {
  const tabs = document.querySelectorAll('.folderTab');
  tabs.forEach((tab) => tab.classList.remove('tabActive'));
  event.target.classList.add('tabActive');
};

const populateContent = () => {
  let i; let l = myList.length;
  for (i = 0; i < l; i++) {
    const taskCard = document.createElement('div');
    const title = document.createElement('p');
    const expandCard = document.createElement('p');
    const note = document.createElement('p');
    const date = document.createElement('p');
    const markComplete = document.createElement('input');
    const deleteTask = document.createElement('input');
    const editCard = document.createElement('input');
    // task card prop
    taskCard.classList = 'card';
    title.className = 'cardTitle';
    title.innerText = myList[i].title;
    // paragraph prop
    note.className = 'cardText';
    note.innerText = myList[i].note;
    // date.className = 'cardText';
    // date.innerText = 'due date: ' + myList[i].date;
    // expand button prop
    expandCard.className = 'collapsible';
    expandCard.addEventListener('click', () => {
      taskCard.classList.toggle('expand');
      expandCard.classList.toggle('active');
    });
    // mark complete prop
    markComplete.setAttribute('type', 'checkbox');
    markComplete.className = 'checkbox';
    markComplete.addEventListener('click', () => {
      title.classList.toggle('strikeout');
    });
    // editTask btn prop
    editCard.setAttribute('type', 'button');
    editCard.className = 'btn';
    editCard.value = 'edit';
    editCard.id = i;
    editCard.addEventListener('click', editTask);
    // delete task prop
    deleteTask.setAttribute('type', 'button');
    deleteTask.className = 'btn';
    deleteTask.value = 'delete';
    deleteTask.id = i;
    deleteTask.addEventListener('click', deleteCard);
    // appendages
    listContainer.appendChild(taskCard);
    taskCard.appendChild(markComplete);
    taskCard.appendChild(title);
    taskCard.appendChild(expandCard);
    taskCard.appendChild(note);
    taskCard.appendChild(date);
    taskCard.appendChild(editCard);
    taskCard.appendChild(deleteTask);
  }
};

// add new task function
const createTask = () => {
  const list = newTask(formTitle.value, formNote.value);
  myList.unshift(list);
  populateContent();
};

// edit tasks
const editTask = (e) => {
  const index = e.target.id;
  const card = myList[index];
  const updateBtn = document.createElement('input');
  formTitle.value = card.title;
  formNote.value = card.note;
  // formDate.value = card.date;
  // button prop
  updateBtn.setAttribute('type', 'submit');
  updateBtn.className = 'formBtn';
  updateBtn.id = 'updateBtn';
  updateBtn.value = 'update';
  // event listener
  updateBtn.addEventListener('click', (event) => {
    event.preventDefault();
    card.title = formTitle.value;
    card.note = formNote.value;
    // card.date = formDate.value;
    update();
    updateBtn.remove();
    form.classList.toggle('visible');
    form.reset();
  });
  form.classList.toggle('visible');
  form.appendChild(updateBtn);
};

// delete item from array
const deleteCard = (e) => {
  myList.splice(e.target.id, 1);
  update();
};

// clear list and array
const clearContent = () => {
  const cards = listContainer.querySelectorAll('.card');
  cards.forEach((item) => item.remove());
};

// localStorage function
// folders
const setFolder = () => {
  const myFolder_string = JSON.stringify(listFolder);
  localStorage.setItem('userFolder', myFolder_string);
};
const getFolder = () => {
  const myFolder_array = JSON.parse(localStorage.getItem('userFolder'));
  if (myFolder_array === null) return;
  listFolder.push(...myFolder_array);
};
const restoreFolder = () => {
  let i; let l = listFolder.length;
  for (i = 0; i < l; i++) {
    newFolder(listFolder[i].name, listFolder[i].date);
  }
};
// lists
const saveList = (name, arr) => {
  const myList_string = JSON.stringify(arr);
  localStorage.setItem(name, myList_string);
};
const retrieveList = (name) => {
  const myList_object = JSON.parse(localStorage.getItem(name));
  if (myList_object === null) return;
  myList.push(...myList_object);
};
const update = () => {
  clearContent();
  populateContent();
  saveList(activeList, myList);
};
const switchList = () => {
  myList = [];
  clearContent();
  retrieveList(activeList);
  populateContent();
};
// initialize
window.addEventListener('load', () => {
  getFolder();
  restoreFolder();
  retrieveList(activeList);
  populateContent();
  main.classList.add('tabActive');
});
})();