import { Client, type QueryResult } from 'pg';
import type { UserDto } from '../models/UserDto';
import { client } from '../db';

function mapUserResult(res: QueryResult): UserDto[] {
  return res.rows.map((r) => ({
    username: r.username,
    password: r.password,
    id: r.id,
    email: r.email,
  }));
}

export async function getUserByName(username: string): Promise<UserDto[]> {
  const sql = `
        SELECT * FROM USERS
        WHERE username = '${username}';`;
  const res = await client.query(sql);
  return mapUserResult(res);
}
