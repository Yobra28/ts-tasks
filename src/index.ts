type UserID = number;
type TaskID = number;

class User {
    static nextId = 1;
    id: UserID;
    name: string;

    constructor(name: string) {
        this.id = User.nextId++;
        this.name = name;
    }
}

class Task {
    static nextId = 1;
    id: TaskID;
    title: string;
    description: string;
    assignedUserId: UserID | null;

    constructor(title: string, description: string) {
        this.id = Task.nextId++;
        this.title = title;
        this.description = description;
        this.assignedUserId = null;
    }
}

class UserTaskManager {
    private users: User[] = [];
    private tasks: Task[] = [];

    createUser(name: string): User {
        const user = new User(name);
        this.users.push(user);
        return user;
    }

    getUser(id: UserID): User | undefined {
        return this.users.find(u => u.id === id);
    }

    updateUser(id: UserID, newName: string): boolean {
        const user = this.getUser(id);
        if (!user) return false;
        user.name = newName;
        return true;
    }

    deleteUser(id: UserID): boolean {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1) return false;

     
        this.tasks.forEach(task => {
            if (task.assignedUserId === id) task.assignedUserId = null;
        });

        this.users.splice(userIndex, 1);
        return true;
    }

   
    createTask(title: string, description: string): Task {
        const task = new Task(title, description);
        this.tasks.push(task);
        return task;
    }

    getTask(id: TaskID): Task | undefined {
        return this.tasks.find(t => t.id === id);
    }

    updateTask(id: TaskID, newTitle: string, newDescription: string): boolean {
        const task = this.getTask(id);
        if (!task) return false;
        task.title = newTitle;
        task.description = newDescription;
        return true;
    }

    deleteTask(id: TaskID): boolean {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.tasks.splice(index, 1);
        return true;
    }

  
    assignTaskToUser(taskId: TaskID, userId: UserID): boolean {
        const task = this.getTask(taskId);
        const user = this.getUser(userId);
        if (!task || !user) return false;

        task.assignedUserId = userId;
        return true;
    }

    unassignTask(taskId: TaskID): boolean {
        const task = this.getTask(taskId);
        if (!task) return false;

        task.assignedUserId = null;
        return true;
    }

    getTasksByUser(userId: UserID): Task[] {
        return this.tasks.filter(task => task.assignedUserId === userId);
    }

    listAllUsers(): User[] {
        return this.users;
    }

    listAllTasks(): Task[] {
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
