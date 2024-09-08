import { Router } from "express";
import { getTasks, addTask, editTask, deleteTask, saveTasks } from "../controllers/task.controller.js";

const router = Router();

router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', editTask);
router.delete('/:id', deleteTask);
router.post('/save-tasks', saveTasks);

export default router;
