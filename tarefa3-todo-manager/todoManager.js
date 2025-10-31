console.log("Início Tarefa 3 - [Chat GPT] ");

// tarefa3-todo-manager/todoManager.js

class Task {
  static validStatuses = ["todo", "in_progress", "done"];
  static validPriorities = ["low", "medium", "high"];

  constructor(id, code, title, description, priority) {
    if (!title || typeof title !== "string") {
      throw new Error("Título inválido");
    }
    if (!Task.validPriorities.includes(priority)) {
      throw new Error("Prioridade inválida");
    }

    this.id = id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.status = "todo";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.completedAt = null;
  }

  update(data) {
    const { title, description, priority } = data;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim())
        throw new Error("Título inválido");
      this.title = title.trim();
    }

    if (description !== undefined) {
      this.description = description;
    }

    if (priority !== undefined) {
      if (!Task.validPriorities.includes(priority))
        throw new Error("Prioridade inválida");
      this.priority = priority;
    }

    this.updatedAt = new Date();
  }

  setStatus(newStatus) {
    if (!Task.validStatuses.includes(newStatus))
      throw new Error("Status inválido");

    this.status = newStatus;
    this.updatedAt = new Date();

    if (newStatus === "done") {
      this.completedAt = new Date();
    } else {
      this.completedAt = null;
    }
  }
}

class TodoManager {
  constructor() {
    this.tasks = [];
    this.idCounter = 1;
    this.projectCounters = {};
  }

  // -------------------------
  // Utilitários internos
  // -------------------------

  generateCode(project) {
    if (!project || typeof project !== "string") {
      throw new Error("Nome do projeto inválido");
    }

    const prefix = project.toUpperCase();

    if (!this.projectCounters[prefix]) {
      this.projectCounters[prefix] = 1;
    } else {
      this.projectCounters[prefix]++;
    }

    return `${prefix}-${this.projectCounters[prefix]}`;
  }

  findTaskById(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error("Tarefa não encontrada");
    return task;
  }

  // -------------------------
  // CRUD
  // -------------------------

  createTask(project, title, description, priority) {
    const code = this.generateCode(project);
    const newTask = new Task(this.idCounter++, code, title, description, priority);
    this.tasks.push(newTask);
    return newTask;
  }

  listTasks() {
    return [...this.tasks];
  }

  updateTask(id, newData) {
    const task = this.findTaskById(id);
    task.update(newData);
    return task;
  }

  removeTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Tarefa não encontrada");
    this.tasks.splice(index, 1);
  }

  // -------------------------
  // Status
  // -------------------------

  changeStatus(id, newStatus) {
    const task = this.findTaskById(id);
    task.setStatus(newStatus);
    return task;
  }

  // -------------------------
  // Filtros e buscas
  // -------------------------

  filterByStatus(status) {
    if (!Task.validStatuses.includes(status))
      throw new Error("Status inválido");
    return this.tasks.filter((t) => t.status === status);
  }

  filterByPriority(priority) {
    if (!Task.validPriorities.includes(priority))
      throw new Error("Prioridade inválida");
    return this.tasks.filter((t) => t.priority === priority);
  }

  searchByTitle(query) {
    if (!query || typeof query !== "string")
      throw new Error("Texto de busca inválido");
    const q = query.toLowerCase();
    return this.tasks.filter((t) => t.title.toLowerCase().includes(q));
  }

  findByCode(code) {
    return this.tasks.find((t) => t.code === code) || null;
  }

  countByStatus() {
    const counts = { todo: 0, in_progress: 0, done: 0 };
    for (const t of this.tasks) {
      if (counts[t.status] !== undefined) counts[t.status]++;
    }
    return counts;
  }
}

// Exporta para uso em testes ou importação
module.exports = { Task, TodoManager };
