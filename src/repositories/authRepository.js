import { connection } from '../database.js';

export async function searchUserByEmail(userEmail) {
  const promise = await connection.query(`
    SELECT 
      * 
    FROM users 
    WHERE email=$1
  `, [userEmail]);

  return promise;
}

export async function createSession(token, userId) {
  const promise = await connection.query(`
    INSERT INTO sessions 
      (token, "userId") 
    VALUES 
      ($1, $2)
  `, [token, userId]);

  return promise;
}