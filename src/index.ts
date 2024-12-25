// src/index.ts
import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { getPostFromUser } from './server/pg/Post';
import { getUserByName } from './server/pg/Users';
import { connectClient } from './server/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectClient()
  .then(() => {
    console.log('Connected to database');
    main();
  })
  .catch((error) => {
    console.log('Failed to connect to database');
    console.log(error);
  });

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'hi' });
});

app.get('/get_posts', async (req: Request, res: Response) => {
  try {
    const data = await getPostFromUser('trees');
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await getUserByName(id);
    res.status(200).json({ data: data[0] });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

function main() {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
