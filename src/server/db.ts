import { Client } from 'pg';

export let client: Client;

export const connectClient = async () => {
  client = new Client({ connectionString: process.env.PG_URI });
  return await client.connect();
};
