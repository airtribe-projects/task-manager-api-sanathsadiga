const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');

router.get("/tasks", taskController.getAllTask);
router.post("/tasks", taskController.createTask);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);


module.exports = router;