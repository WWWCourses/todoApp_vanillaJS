// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// define variables and functions used
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const displayTodoItemsCount = function() {
    let count = todos.length || 0;
    nodes.totalItemsCount.innerHTML = count;
}

const addTodo = function() {
    // get the input text and make new todo object:
	const todoText = nodes.addTodoInput.value;
	const newTodo = {
		"title": todoText,
		"completed": false
	};
	// console.log('new todo: ',newTodo);

	// post the new todo:
	fetch(todosAPIroot,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newTodo)
	}).then(response=>{
		if(response.status === 201){
			// sync and render todos:
			todos = [...todos, newTodo];
			renderTodos();
		}
	})

	// update todos count:
    displayTodoItemsCount();

    // clear input text
    nodes.addTodoInput.value = '';

    // focus on input for new todo:
    nodes.addTodoInput.focus();
}
const removeTodo = function (e) {
	// get id of todo to be removed:
	let todoID;
	if(e.target.classList.contains('fa-trash-alt')){
		todoID = e.target.parentNode.parentNode.dataset.id;
	}else if( e.target.classList.contains('removeTodo')){
		todoID = e.target.parentNode.dataset.id;
	}

	// remove todo:
	fetch(`${todosAPIroot}/${todoID}`,{
		method: 'DELETE'
	})
	.then(response=>{
		console.log(response);
		if(response.status === 200){
			// sync and render todos - we can fetch again all todos, or skip the load and sync it localy:
			// get the index of todo to be removed and remove it:
			// console.dir(todos);
			let idx = todos.findIndex(todo => {
				(todo.id === todoID) || (console.log(`todo.id: ${todo.id}, todoID: ${todoID}`));
			});
			// console.log(`idx: ${idx}`);
			idx>=0 && todos.splice(idx,1);
		}
	})
}
const completeTodo = function (e) {
	// HW: implement the function body
}


const renderTodos = function(e) {
	// clean current todos:
	nodes.todoListUL.innerHTML = '';

	todos.forEach( todo => {
		const li = document.createElement('li');

		li.innerHTML = `
			<span class="todoID">${todo.id}.</span>
			<span ${todo.completed? 'class="completed"' : ''}>${todo.title}</span>
			<div class="removeTodo"><i class="far fa-trash-alt"></i></div>
			<div class="editTodo"><i class="fas fa-pencil-alt"></i></div>
		`;

		li.setAttribute("data-id", todo.id);
		nodes.todoListUL.appendChild(li);
	});

	displayTodoItemsCount();
}


let nodes = {
    'todoListUL': document.querySelector('ul.todoListItems'),
    'addTodoInput': document.querySelector('.addTodo>input'),
	'addTodoBtn': document.querySelector('.addTodo>.btnAdd'),
    'totalItemsCount': document.querySelector('.todoApp .total>.output')
}

let todosAPIroot = 'http://localhost:3000/todos';

// todos array of todo objects:
let todos = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// attach events
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.addEventListener('DOMContentLoaded', event=>{
	fetch(todosAPIroot)
		.then(response=>response.json())
		.then(data => {
			console.log(`data: ${data}`);
			// sync and render todos:
			todos = [...data];
			renderTodos();
		});
});

// add Todo Item (on button click or on enter pressed):
nodes.addTodoBtn.addEventListener('click', addTodo);
nodes.addTodoInput.addEventListener('keyup', function(e) {
    if(e.keyCode === 13){
        addTodo();
    }
})
// remove Todo Item:
nodes.todoListUL.addEventListener('click', removeTodo, {capture: true})

// complete Todo: HW