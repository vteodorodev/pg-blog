import { client } from '../db';
import type { PostDto } from '../models/PostDto';
import type { QueryResult } from 'pg';

function mapPostResult(res: QueryResult): PostDto[] {
  return res.rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.content,
    createdOn: r.created_on,
    updatedOn: r.updated_on,
    updated: r.updated,
  }));
}

export async function getAllPosts(): Promise<PostDto[]> {
  const sql = `
    SELECT id,title, content, created_on, updated_on
    FROM posts
    ORDER BY created_on DESC;
  `;
  const res = await client.query(sql);
  return mapPostResult(res);
}

export async function getPosts(
  amount: number,
  offset: number,
): Promise<PostDto[]> {
  const sql = `SELECT id,title, content, created_on, updated_on, updated
               FROM posts
               ORDER BY created_on DESC
               LIMIT ${amount}
               OFFSET ${offset};
  `;
  const res = await client.query(sql);
  return mapPostResult(res);
}

export async function getPostById(id: number): Promise<PostDto> {
  const sql = `SELECT id, title, content, created_on, updated_on, updated
               FROM posts
               WHERE id = ${id};
              `;
  const res = await client.query(sql);
  return mapPostResult(res)[0];
}

export async function searchPostByString(word: string): Promise<PostDto[]> {
  const sql = `SELECT *
               FROM posts
               WHERE to_tsvector(title) @@ to_tsquery('${word}')
                OR to_tsvector(content) @@ to_tsquery('${word}');`;
  const res = await client.query(sql);
  return mapPostResult(res);
}

export async function countPosts(): Promise<number> {
  const sql = `SELECT COUNT(*)
               FROM posts;
              `;
  const res = await client.query(sql);
  return res.rows[0].count;
}

export async function addPost(title: string, body: string, userId: number) {
  const createdOn = new Date().toISOString();
  const updatedOn = createdOn;
  const sql = `
    INSERT INTO posts (title, content, created_on, updated_on, user_id)
    VALUES ('${title}', '${body}', '${createdOn}', '${updatedOn}', ${userId});`;
  return await client.query(sql);
}

export async function editPost(title: string, body: string, postId: number) {
  const updatedOn = new Date().toISOString();
  const sql = `
    UPDATE posts 
    SET title = '${title}', content = '${body}', updated_on = '${updatedOn}', updated = true
    WHERE id=${postId};`;
  return await client.query(sql);
}
