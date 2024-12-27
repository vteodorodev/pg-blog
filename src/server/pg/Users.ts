import { DatabaseError, type QueryResult } from 'pg';
import type { UserDto } from '../models/UserDto';
import { client } from '../db';
import { PGError } from '../errors';

function mapUserResult(res: QueryResult): UserDto[] {
  return res.rows.map((r) => ({
    username: r.username,
    password: r.password,
    id: r.id,
    email: r.email,
  }));
}

export async function createUser(username: string, hashedPassword: string) {
  const sql = `
    INSERT INTO users (username, password) 
    VALUES ('${username}', '${hashedPassword}');
    `;

  try {
    return await client.query(sql);
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      throw new PGError(error.code, PGError.USER_EXISTS_MESSAGE);
    }
    throw error;
  }
}

export async function getUserByName(username: string): Promise<UserDto> {
  const sql = `
        SELECT * FROM USERS
        WHERE username = '${username}';`;
  const res = await client.query(sql);
  return mapUserResult(res)[0];
}
