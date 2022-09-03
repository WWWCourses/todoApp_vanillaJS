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
		<li data-id=${todo.id} class="${todo.completed?'completed':''}">
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


const fetchAndRenderTodos = function fetchAndRenderTodos(APIRoot) {
	fetch(APIRoot)
		.then(r=>{
			if(r.ok){
				return r.json()
			}
		})
		.then(data=> {
			todos = data;
			renderTodos(todos);
		})
		.catch( err=>console.warn(err) );
}


const addTodo = function addTodo() {
	// get the input text
	const todoText = nodes.addTodoInput.value;

	// TODO: do not addTodo on empty input

	// create the new todo object - no need to add id (server will set it)
	const newTodo = {
		"title": todoText,
		"completed": false,
	};

	// change server state and if success => change local state
	fetch(APIRoot, {
		method: 'POST',
		body: JSON.stringify(newTodo),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	.then(response => {
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return response.json();
	})
	.then(data => {
		// change local state
		todos = [...todos, data];
		// update UI on state change:
		renderTodos(todos);
	})
	.catch( err=>console.error(`Ups, ${err}`) );
}

const removeTodo = function removeTodo(todoID) {
	// change server state and if success => change local state
	fetch(`${APIRoot}/${todoID}`,{
		method: 'DELETE',
		headers:{
			"Content-Type":"application/json"
		}
	})
	.then(response => {
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return response.json();
	})
	.then(data => {
		// change local state
		todos = todos.filter(todo=> todo.id !== todoID)
		// update UI on state change:
		renderTodos(todos);
	})
	.catch( err=>console.error(`Ups, ${err}`) );
}

const toggleComplete = function toggleComplete(todoID) {
	//get todo object to be patched
	let todo = todos.filter(todo=>todo.id===todoID)[0];

	// make body payload - todo object to be patched
	let payload = {
		"completed": !todo.completed
	}

	// change server state and if success => change local state
	fetch(`${APIRoot}/${todoID}`,{
		method: 'PATCH',
		body: JSON.stringify(payload),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	.then(response=>{
		if (!response.ok) {
			throw Error(response.statusText);
		}

		return response.json();
	})
	.then(data => {
		// change local state:
		todo.completed = !todo.completed;
		// todos[todoID] = data

		// update UI on state change:
		renderTodos(todos);
	})
	.catch( err=>console.error(`Ups, ${err}`) );
}


// DOM cache:
const nodes = {
	'todoItems': document.querySelector('ul.todo-list-items'),
	'addTodoInput': document.querySelector('.todo-add>input'),
	'addTodoBtn': document.querySelector('.todo-add>.todo-add-btn'),
	'totalItemsCount': document.querySelector('.todo-app .todos-total>.output')
}


const APIRoot = "http://localhost:3000/todos"

// inint local todos (state)
let todos = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// attach events
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.addEventListener('DOMContentLoaded', function (e) {
	fetchAndRenderTodos(APIRoot);
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
	const id = li.dataset.id*1;


	if( e.target.classList.contains('fa-trash-alt')){
		// if user have clicked the trash icon:
		removeTodo(id)
	}else if( e.target.classList.contains('fa-check-square')|| e.target.classList.contains('fa-square')){
		// if user have clicked the completed icon:
		toggleComplete(id)
	}
})