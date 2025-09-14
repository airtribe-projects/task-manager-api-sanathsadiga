const tasks = require("../task.json");

// Validation Helper
function validateTaskData({ title, description, completed }) {

  if (
    !title || typeof title !== "string" || title.trim() === "" ||
    !description || typeof description !== "string" || description.trim() === "" ||
    typeof completed !== "boolean"
  ) {
    return false;
  }
  return true;
}

// Create Task
exports.createTask = (req, res) => {
  const { title, description, completed } = req.body;

  if (!validateTaskData({ title, description, completed})) {
    return res.status(400).send();
  }

  const newTask = {
    id: tasks.tasks.length + 1,
    title,
    description,
    completed
  };

  tasks.tasks.push(newTask);
  return res.status(201).send(newTask);
};

// Get All Tasks (with filtering + sorting)
exports.getAllTask = (req, res) => {
  let result = tasks.tasks;

  // Filter by completion
  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === "true";
    result = result.filter(task => task.completed === isCompleted);
  }

  return res.status(200).send(result);
};

// Get Task By ID
exports.getTaskById = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.tasks?.find((t) => t.id === id);

  if (!task) {
    return res.status(404).send();
  }

  return res.status(200).send(task);
};

// Update Task
exports.updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.tasks?.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).send();
  }

  // ✅ destructure from request body
  const { title, description, completed } = req.body;

  // validate
  if (!validateTaskData({ title, description, completed })) {
    return res.status(400).send();
  }

  // update the task
  tasks.tasks[taskIndex] = {
    id,
    title,
    description,
    completed
  };

  return res.status(200).send(tasks.tasks[taskIndex]);
};


// Delete Task
exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).send();
  }

  tasks.tasks.splice(taskIndex, 1);
  return res.status(200).send();
};

