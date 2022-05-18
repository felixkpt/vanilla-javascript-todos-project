// Selectors
const todoInput = document.querySelector('.todo-input')
const todoForm = document.querySelector('.todo-form')
const todoList = document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')

// Event Listeners
todoForm.addEventListener('submit', addTodo)
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('click', filterTodo)

// Functions
function addTodo(event) {
    event.preventDefault()
    // Save Todo to localStorage
    saveToLocal(todoInput.value)

    printTodos()

}

function deleteCheck(e) {
    const item = e.target
    // console.log(item)
    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;
        // Animation
        todo.classList.add('fall')
        // Deletion
        todo.addEventListener('transitionend', function() {
            todo.remove()
        })

       deleteFromLocal(item.parentElement.querySelector('span').getAttribute('id'))
    }
    
    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement
        updateLocal(item.parentElement.querySelector('span').getAttribute('id'), 'completed')
        printTodos()
    }

}

function filterTodo(e) {
    
    const todos = getFromLocal()
    todos.forEach(function(todo) {
        switch (e.target.value) {
            case 'all' :
                printTodos()
                break
            case 'completed' :
                printTodos('completed')
                break
            case 'uncompleted' :
                printTodos('uncompleted')
                break
        }
    })
}

function saveToLocal(todo) {
    let todos
    // localStorage.removeItem('todos')
    const storage = localStorage.getItem('todos')
    if (storage === null) {
        todos = []
    }else {
        todos = JSON.parse(storage)
    }

    let id = todos.length + 1;
    todos.push({id: id, todo: todo, completed: 'uncompleted'})
    localStorage.setItem('todos', JSON.stringify(todos))
}

function getFromLocal() {
    let todos
    const storage = localStorage.getItem('todos')
    if (storage === null) {
        todos = []
    }else {
        todos = JSON.parse(storage)
    }
    return todos
}

function updateLocal(todo) {
    todo = parseInt(todo)
    let todos
    const storage = localStorage.getItem('todos')
    
    todos = JSON.parse(storage)

    todos = todos.map(i => {
                if (i.id == todo) {
                    return {...i, completed: 'completed'}
                }
                return i
            })
    localStorage.setItem('todos', JSON.stringify(todos))
}

function deleteFromLocal(todo) {
    todo = parseInt(todo)
    let todos
    const storage = localStorage.getItem('todos')
    
    todos = JSON.parse(storage)

    todos = todos.filter(i => i.id !== todo)
    
    localStorage.setItem('todos', JSON.stringify(todos))
}

function printTodos(completion = null) {
    let todos = getFromLocal()
    if (completion) {
        todos = todos.filter(i => i.completed == completion)
    }
    
    todoList.replaceChildren();
    todos.forEach(function(todo) {
        // console.log(todo)
        // Todo Div
        const todoDiv = document.createElement('div')
        todoDiv.classList.add('todo')
        // Create li
        const newTodo = document.createElement('li')
        newTodo.innerHTML = `<span id="${todo.id}">${todo.todo}<span>`
        newTodo.classList.add('todo-item')
        if (todo.completed == 'completed') {
            newTodo.classList.add('completed')
        }
        todoDiv.appendChild(newTodo)
        
        // Check Mark Button
        const completeButton = document.createElement('button')
        completeButton.innerHTML = '<i class="fas fa-check"></i>'
        completeButton.classList.add('complete-btn')
        todoDiv.appendChild(completeButton)

        // Check trash Buttton
        const trashButton = document.createElement('button')
        trashButton.innerHTML = '<i class="fas fa-trash"></i>'
        trashButton.classList.add('trash-btn')
        todoDiv.appendChild(trashButton)

        // Append To List
        todoList.appendChild(todoDiv)
        todoInput.value = ""

    })
}

printTodos()
