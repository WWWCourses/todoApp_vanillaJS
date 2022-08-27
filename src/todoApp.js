// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// define variables and functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const displayTodoItemsCount = function displayTodoItemsCount(todos) {
	let count = todos.length || 0;
	nodes.totalItemsCount.innerHTML = count;
}

const renderTodos = function renderTodos(todos) {
	// clean current todos:
	nodes.todoItems.innerHTML = '';

	// add todo item at the end
	todos.forEach( todo => {
		nodes.todoItems.innerHTML += `
		<li data-color='red' data-id=${todo.id} class="${todo.completed?'completed':''}">
			<span class="todoID">${todo.id}.</span>
			<span>${todo.title}</span>
			<div class="todo-remove"><i class="far fa-trash-alt"></i></div>
			<div class="todo-togle-complete"><i class="far ${todo.completed ? 'fa-check-square':'fa-square'}"></i></div>
		</li>
		`;
	})

	// clear input text
	nodes.addTodoInput.value = '';

	// focus on input for new todo:
	nodes.addTodoInput.focus();

	displayTodoItemsCount(todos);
}


const addTodo = function addTodo() {
	// get the input text
	const todoText = nodes.addTodoInput.value;

	// TODO: do not addTodo on empty input

	// create the new todo object
	const newTodo = {
		"id": todos[todos.length-1]?.id +1 || 1, // in real app will be done by the server
		"title": todoText,
		"completed": false,
	};

	// change local state
	todos = [...todos, newTodo];
	console.log(`todos: ${todos}`);

	// save todos to local storage
	window.localStorage.setItem('todos', JSON.stringify(todos));

	// update UI on state change:
	renderTodos(todos);
}
const removeTodo = function removeTodo(todoID) {
	// change local state:
	todos = todos.filter(todo=> todo.id !== todoID)

	// save todos to local storage
	window.localStorage.setItem('todos', JSON.stringify(todos));

	// update UI on state change:
	renderTodos(todos);
}

const toggleComplete = function toggleComplete(todoID) {
	// console.log(`todoID: ${todoID}`);
	//get todo object to be patched
	let todo = todos.filter(todo=>todo.id===todoID)[0];

	// change local state:
	todo.completed = !todo.completed;

	// save todos to local storage
	window.localStorage.setItem('todos', JSON.stringify(todos));

	// update UI on state change:
	renderTodos(todos);
}


// DOM cache:
const nodes = {
	'todoItems': document.querySelector('ul.todo-list-items'),
	'addTodoInput': document.querySelector('.todo-add>input'),
	'addTodoBtn': document.querySelector('.todo-add>.todo-add-btn'),
	'totalItemsCount': document.querySelector('.todo-app .todos-total>.output')
}



// get data from local storage
let todosValue = window.localStorage.getItem('todos');
let todos = JSON.parse(todosValue) || [];



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// attach events
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.addEventListener('DOMContentLoaded', function (e) {
	renderTodos(todos)
});

//// add Todo Item
// on Add button click
nodes.addTodoBtn.addEventListener('click', function (e) {
	addTodo();
});
// on 'enter' key pressed:
nodes.addTodoInput.addEventListener('keypress', function(e) {
	if(e.keyCode === 13){
		addTodo();
	}
})

// on remove or completed:
nodes.todoItems.addEventListener('click', function todoItemsClickHandler(e) {
	// console.dir(e.target);

	// get the LI element which contains the icon being clicked on, inorder to get the id of the todo (check HTML in renderTodos() to see the structure)
	const li = e.target.parentElement.parentElement;

	console.dir(li.dataset.color)

	const id = li.dataset.id*1;


	if( e.target.classList.contains('fa-trash-alt')){
		// if user have clicked the trash icon:
		removeTodo(id)
	}else if( e.target.classList.contains('fa-check-square')|| e.target.classList.contains('fa-square')){
		// if user have clicked the completed icon:
		toggleComplete(id)
	}
})