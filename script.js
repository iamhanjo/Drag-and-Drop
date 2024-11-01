const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;


// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn; 


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}
getSavedColumns();
updateSavedColumns();

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray,progressListArray,completeListArray,onHoldListArray];
  const arrayNames = ['backlog','progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index)=>{
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));

  });
}

// FILTER ARRAYS TO REMOVE EMPTY ELEMENTS
function filterArray(array){
  const filteredArray = array.filter(item => item != null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart' , 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index},${column})`);

  // Append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad){
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index)=>{
    createItemEl(backlogList,0, backlogItem, index);
 });
 backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index)=>{
    createItemEl(progressList,1, progressItem, index);

  });
  progressListArray = filterArray(progressListArray);


  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index)=>{
    createItemEl(completeList,2, completeItem,index);

  });
  completeListArray = filterArray(completeListArray);


  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index)=>{
    createItemEl(onHoldList,0, onHoldItem,index);

  });
  onHoldListArray = filterArray(onHoldListArray);


  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}
// Update Item (delete if necessary)
function updateItem(id, column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if(!selectedColumnEl[id].textContent){
    delete selectedArray[id];
  }
  updateDOM();
}


// add to column list, reset textbox
function addToColumn(column){
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// show add items input box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';

}

// hide item input box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}


// Allow arrays to reflect drag and deop idtems
function rebuildArrays(){
  backlogListArray = [];
  for(let i = 0; i< backlogList.children.length; i++){
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for(let i = 0; i< progressList.children.length; i++){
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for(let i = 0; i< completeList.children.length; i++){
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for(let i = 0; i< onHoldList.children.length; i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

// when item starts dragging 

function drag(e){
  draggedItem = e.target;
  console.log('draggedItem', draggedItem);
  
}
 
// Column allows for item to drop 
function allowDrop(e){
  e.preventDefault();
}

// when the  item enters the column area
function dragEnter(column){
  listColumns[column].classList.add('over');
  currentColumn = column;
}
// Droping item in column
function drop(e){
  e.preventDefault();
  const parent  = listColumns[currentColumn];
 
  // removing background color padding 
  listColumns.forEach((column) =>{
    column.classList.remove('over');
  });

  // ADD item to column
  parent.appendChild(draggedItem);
  rebuildArrays();
}

//  On Load
updateDOM();