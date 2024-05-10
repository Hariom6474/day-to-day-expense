// const express = require("express");
import express from 'express';
// import {Routes} from 'express';
import bodyParser from 'body-parser';
import todosRoutes from './Routes/todos';

const app = express();
app.use(bodyParser.json());
app.use(todosRoutes);

app.listen(3000);
