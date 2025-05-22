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
    }
    createUser(name) {
        const user = new User(name);
        this.users.push(user);
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
        return true;
    }
    createTask(title, description) {
        const task = new Task(title, description);
        this.tasks.push(task);
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
        return true;
    }
    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1)
            return false;
        this.tasks.splice(index, 1);
        return true;
    }
    assignTaskToUser(taskId, userId) {
        const task = this.getTask(taskId);
        const user = this.getUser(userId);
        if (!task || !user)
            return false;
        task.assignedUserId = userId;
        return true;
    }
    unassignTask(taskId) {
        const task = this.getTask(taskId);
        if (!task)
            return false;
        task.assignedUserId = null;
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
const remove = new User("Brian");
const user1 = manager.createUser("Brian");
const user2 = manager.createUser("sharon");
const task1 = manager.createTask("write Blog", "fix the cpu");
const task2 = manager.createTask("format computer", "Document the code");
manager.assignTaskToUser(task1.id, user1.id);
manager.assignTaskToUser(task2.id, user2.id);
console.log("Tasks assigned to Brian:", manager.getTasksByUser(user1.id));
manager.unassignTask(task1.id);
console.log("After unassigning:", manager.getTasksByUser(user1.id));
manager.deleteUser(user1.id);
