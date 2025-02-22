document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    loadTasks();

    // Add task event
    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        // Add task to the list and local storage
        addTaskToList(task);
        saveTaskToLocalStorage(task);
        taskInput.value = '';
    }

    function addTaskToList(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    }

    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => addTaskToList(task));
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    window.toggleTaskCompletion = function(taskId) {
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    window.editTask = function(taskId) {
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === taskId);
        const newTaskText = prompt('Edit task:', task.text);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            task.text = newTaskText.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    };

    window.deleteTask = function(taskId) {
        const tasks = getTasksFromLocalStorage().filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    function renderTasks() {
        taskList.innerHTML = '';
        loadTasks();
    }
});
