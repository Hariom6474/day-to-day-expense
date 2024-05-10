"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const todos = [];
router.get('/', (req, res, next) => {
    res.status(200).json({ todo: todos });
});
router.post('/todo', (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text
    };
    todos.push(newTodo);
    res.status(201).json({ todo: todos });
});
router.delete('/del', (req, res, next) => {
    const id = req.body.id;
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos.splice(index, 1);
        res.status(202).json({ message: 'Todo deleted' });
    }
    else {
        res.status(404).json({ message: 'Todo not found' });
    }
});
router.put('/edit', (req, res, next) => {
    const newText = req.body.newText;
    const id = req.body.id;
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos[index].text = newText;
        res.status(203).json({ message: 'Todo edited' });
    }
    else {
        res.status(404).json({ message: 'Todo not found' });
    }
});
exports.default = router;
