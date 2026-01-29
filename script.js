let taskIdCounter = 0;

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    let userInput = document.getElementById("task-input").value.trim();
    
    if(userInput === "") {
        alert("Please write something!");
        return;
    }

    let list = document.getElementById("task-list");
    createTaskElement(userInput, false, Date.now());
    
    document.getElementById("task-input").value = "";
    saveTasks();
}

function createTaskElement(text, isCompleted, id) {
    let list = document.getElementById("task-list");
    let listItem = document.createElement('li');
    listItem.setAttribute('data-id', id);
    if (isCompleted) listItem.classList.add('completed');

    listItem.innerHTML = `
        <span onclick="toggleTask(this)" class="task-text">${text}</span>
        <div class="task-actions">
            <button onclick="editTask(this)" class="edit-btn">Edit</button>
            <button onclick="deleteTask(this)" class="delete-btn">Delete</button>
        </div>
    `;
    list.prepend(listItem);
}

function toggleTask(span) {
    span.parentElement.classList.toggle('completed');
    saveTasks();
}

function deleteTask(btn) {
    btn.parentElement.parentElement.remove();
    saveTasks();
}

function editTask(btn) {
    let span = btn.parentElement.parentElement.querySelector('.task-text');
    let newText = prompt("Edit Task:", span.innerText);
    if (newText) {
        span.innerText = newText;
        saveTasks();
    }
}

document.getElementById("task-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

function clearAllTasks() {
    if (confirm("Clear all tasks?")) {
        document.getElementById("task-list").innerHTML = "";
        localStorage.removeItem('tasks');
    }
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').innerText,
            completed: li.classList.contains('completed'),
            id: li.getAttribute('data-id')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let stored = JSON.parse(localStorage.getItem('tasks') || "[]");
    stored.reverse().forEach(t => createTaskElement(t.text, t.completed, t.id));
}