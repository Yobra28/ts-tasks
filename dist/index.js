"use strict";
class User {
    constructor(name) {
        this.id = User.nextId++;
        this.name = name;
    }
}
User.nextId = 1;
class Task {
    constructor(title, description) {
        this.id = Task.nextId++;
        this.title = title;
        this.description = description;
        this.assignedUserId = null;
    }
}
Task.nextId = 1;
class UserTaskManager {
    constructor() {
        this.users = [];
        this.tasks = [];
        this.loadFromStorage();
    }
    saveToStorage() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('userNextId', User.nextId.toString());
        localStorage.setItem('taskNextId', Task.nextId.toString());
    }
    loadFromStorage() {
        const usersData = localStorage.getItem('users');
        const tasksData = localStorage.getItem('tasks');
        const userNextId = localStorage.getItem('userNextId');
        const taskNextId = localStorage.getItem('taskNextId');
        if (usersData) {
            this.users = JSON.parse(usersData);
        }
        if (tasksData) {
            this.tasks = JSON.parse(tasksData);
        }
        if (userNextId)
            User.nextId = parseInt(userNextId, 10);
        if (taskNextId)
            Task.nextId = parseInt(taskNextId, 10);
    }
    createUser(name) {
        const user = new User(name);
        this.users.push(user);
        this.saveToStorage();
        return user;
    }
    getUser(id) {
        return this.users.find(u => u.id === id);
    }
    updateUser(id, newName) {
        const user = this.getUser(id);
        if (!user)
            return false;
        user.name = newName;
        this.saveToStorage();
        return true;
    }
    deleteUser(id) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1)
            return false;
        this.tasks.forEach(task => {
            if (task.assignedUserId === id)
                task.assignedUserId = null;
        });
        this.users.splice(userIndex, 1);
        this.saveToStorage();
        return true;
    }
    createTask(title, description) {
        const task = new Task(title, description);
        this.tasks.push(task);
        this.saveToStorage();
        return task;
    }
    getTask(id) {
        return this.tasks.find(t => t.id === id);
    }
    updateTask(id, newTitle, newDescription) {
        const task = this.getTask(id);
        if (!task)
            return false;
        task.title = newTitle;
        task.description = newDescription;
        this.saveToStorage();
        return true;
    }
    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1)
            return false;
        this.tasks.splice(index, 1);
        this.saveToStorage();
        return true;
    }
    assignTaskToUser(taskId, userId) {
        const task = this.getTask(taskId);
        const user = this.getUser(userId);
        if (!task || !user)
            return false;
        task.assignedUserId = userId;
        this.saveToStorage();
        return true;
    }
    unassignTask(taskId) {
        const task = this.getTask(taskId);
        if (!task)
            return false;
        task.assignedUserId = null;
        this.saveToStorage();
        return true;
    }
    getTasksByUser(userId) {
        return this.tasks.filter(task => task.assignedUserId === userId);
    }
    listAllUsers() {
        return this.users;
    }
    listAllTasks() {
        return this.tasks;
    }
}
const manager = new UserTaskManager();
const userList = document.getElementById('userList');
const taskList = document.getElementById('taskList');
const addUserInput = document.getElementById('addUserName');
const updateUserSelect = document.getElementById('updateUserSelect');
const updateUserNameInput = document.getElementById('updateUserName');
const deleteUserSelect = document.getElementById('deleteUserSelect');
const getUserTasksSelect = document.getElementById('getUserTasksSelect');
const addTaskTitle = document.getElementById('addTaskTitle');
const addTaskDescription = document.getElementById('addTaskDescription');
const updateTaskSelect = document.getElementById('updateTaskSelect');
const updateTaskTitle = document.getElementById('updateTaskTitle');
const updateTaskDescription = document.getElementById('updateTaskDescription');
const deleteTaskSelect = document.getElementById('deleteTaskSelect');
const assignTaskSelect = document.getElementById('assignTaskSelect');
const assignUserSelect = document.getElementById('assignUserSelect');
const unassignTaskSelect = document.getElementById('unassignTaskSelect');
function refreshUI() {
    refreshUserDropdowns();
    refreshTaskDropdowns();
    displayUsers();
    displayTasks();
}
function refreshUserDropdowns() {
    const users = manager.listAllUsers();
    [updateUserSelect, deleteUserSelect, assignUserSelect, getUserTasksSelect].forEach(select => {
        select.innerHTML = users.map(u => `<option value="${u.id}">${u.name} (ID: ${u.id})</option>`).join('');
    });
}
function refreshTaskDropdowns() {
    const tasks = manager.listAllTasks();
    [updateTaskSelect, deleteTaskSelect, assignTaskSelect, unassignTaskSelect].forEach(select => {
        select.innerHTML = tasks.map(t => `<option value="${t.id}">${t.title} (ID: ${t.id})</option>`).join('');
    });
}
function displayUsers() {
    userList.innerHTML = manager.listAllUsers()
        .map(user => `<li>${user.name} (ID: ${user.id})</li>`)
        .join('');
}
function displayTasks() {
    taskList.innerHTML = manager.listAllTasks()
        .map(task => {
        const assigned = task.assignedUserId !== null ? `Assigned to User ID: ${task.assignedUserId}` : "Unassigned";
        return `<li>${task.title} - ${task.description} [${assigned}]</li>`;
    }).join('');
}
document.getElementById('addUserBtn').addEventListener('click', () => {
    const name = addUserInput.value.trim();
    if (name) {
        manager.createUser(name);
        addUserInput.value = '';
        refreshUI();
    }
});
document.getElementById('updateUserBtn').addEventListener('click', () => {
    const id = parseInt(updateUserSelect.value);
    const newName = updateUserNameInput.value.trim();
    if (newName) {
        manager.updateUser(id, newName);
        updateUserNameInput.value = '';
        refreshUI();
    }
});
document.getElementById('deleteUserBtn').addEventListener('click', () => {
    const id = parseInt(deleteUserSelect.value);
    manager.deleteUser(id);
    refreshUI();
});
document.getElementById('getUserTasksBtn').addEventListener('click', () => {
    const id = parseInt(getUserTasksSelect.value);
    const userTasks = manager.getTasksByUser(id);
    taskList.innerHTML = userTasks.map(task => `<li>${task.title} - ${task.description}</li>`).join('');
});
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const title = addTaskTitle.value.trim();
    const description = addTaskDescription.value.trim();
    if (title && description) {
        manager.createTask(title, description);
        addTaskTitle.value = '';
        addTaskDescription.value = '';
        refreshUI();
    }
});
document.getElementById('updateTaskBtn').addEventListener('click', () => {
    const id = parseInt(updateTaskSelect.value);
    const newTitle = updateTaskTitle.value.trim();
    const newDescription = updateTaskDescription.value.trim();
    if (newTitle && newDescription) {
        manager.updateTask(id, newTitle, newDescription);
        updateTaskTitle.value = '';
        updateTaskDescription.value = '';
        refreshUI();
    }
});
document.getElementById('deleteTaskBtn').addEventListener('click', () => {
    const id = parseInt(deleteTaskSelect.value);
    manager.deleteTask(id);
    refreshUI();
});
document.getElementById('assignTaskBtn').addEventListener('click', () => {
    const taskId = parseInt(assignTaskSelect.value);
    const userId = parseInt(assignUserSelect.value);
    manager.assignTaskToUser(taskId, userId);
    refreshUI();
});
document.getElementById('unassignTaskBtn').addEventListener('click', () => {
    const taskId = parseInt(unassignTaskSelect.value);
    manager.unassignTask(taskId);
    refreshUI();
});
refreshUI();
