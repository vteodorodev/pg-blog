import type { PostDto } from '../models/PostDto';
import { Client, type QueryResult } from 'pg';

function mapPostResult(res: QueryResult): PostDto[] {
  return res.rows.map((r) => ({
    title: r.title,
    body: r.content,
    userId: r.user_id,
  }));
}

export async function getPostFromUser(username: string): Promise<PostDto[]> {
  const connectionString = process.env.PG_URI;
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query(`
            SELECT user_id, username, title, content 
            FROM posts INNER JOIN users 
            ON Users.id = Posts.user_id 
            WHERE username = '${username}';`);
    return mapPostResult(res);
  } finally {
    client.end();
    console.log('Connection closed');
  }
}

export async function addPost() {}
