import express from 'express';
import jwt from 'jsonwebtoken';
import UsersRouter from './routes/users.route.js';
import CharactersRouter from './routes/characters.route.js'
import ItemRouter from './routes/item.route.js'
import dotenv from 'dotenv';

const app = express();
const PORT = 3019;
dotenv.config();
app.use(express.json());

app.use('/api',[UsersRouter, CharactersRouter, ItemRouter]);

app.listen(PORT, () => {
console.log(PORT, `port open`);
});