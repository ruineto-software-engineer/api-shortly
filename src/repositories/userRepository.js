import { connection } from '../database.js';

export async function existingUsers(userEmail) {
  const promise = await connection.query(`
    SELECT 
      * 
    FROM users 
    WHERE email=$1
  `, [userEmail]);

  return promise;
}

export async function createUser(userName, userEmail, passwordHash) {
  const promise = await connection.query(`
    INSERT INTO users
      (name, email, password) 
    VALUES 
      ($1, $2, $3)
  `, [userName, userEmail, passwordHash]);

  return promise;
}

export async function searchedUser(id) {
  const promise = await connection.query(`
    SELECT 
      u.id, u.name 
    FROM users AS u
    WHERE u.id=$1
  `, [id]);

  return promise;
}

export async function searchedShortUrls(searchedUserId) {
  const promise = await connection.query(`
    SELECT 
      s.id, s."shortUrl", s.url, s."visitCount"
    FROM "shortenedUrls" AS s
    WHERE s."userId"=$1
    ORDER BY s."visitCount" DESC
  `, [searchedUserId]);

  return promise;
}

export async function usersRanking() {
  const promise = await connection.query(`
    SELECT 
      u.id, u.name,
      COUNT(s."shortUrl") AS "linksCount",
      SUM(s."visitCount") AS "visitCount"
    FROM users AS u
      JOIN "shortenedUrls" AS s ON s."userId"=u.id
    GROUP BY u.id
    ORDER BY "visitCount" DESC
    LIMIT 10
  `);

  return promise;
}