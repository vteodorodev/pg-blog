// src/index.ts
import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import expressLayout from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { getPostFromUser } from './server/pg/Post';
import { getUserByName } from './server/pg/Users';
import { connectClient } from './server/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static('./src/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(expressLayout);
app.use(cookieParser());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }),
);

app.set('views', './src/views');
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

connectClient()
  .then(() => {
    console.log('Connected to database');
    main();
  })
  .catch((error) => {
    console.log('Failed to connect to database');
    console.log(error);
  });

function main() {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
