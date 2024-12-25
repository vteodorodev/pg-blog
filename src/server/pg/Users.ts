import { Client, type QueryResult } from 'pg';
import type { UserDto } from '../models/UserDto';

function mapUserResult(res: QueryResult): UserDto[] {
  return res.rows.map((r) => ({
    username: r.username,
    password: r.password,
    id: r.id,
    email: r.email,
  }));
}

export async function getUserByName(username: string): Promise<UserDto[]> {
  const connectionString = process.env.PG_URI;
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
        SELECT * FROM USERS
        WHERE username = '${username}';`;
    const res = await client.query(sql);
    return mapUserResult(res);
  } finally {
    client.end();
  }
}
